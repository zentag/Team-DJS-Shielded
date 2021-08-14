const serverRecords = require('../schemas/serverSettings.js')
const mongo = require("../mongo.js")

module.exports = (client) => {
    let banCounter = {}
    let kickCounter = {}
    let channelCreateCounter = {}
    let channelDeleteCounter = {}
    let roleCreateCounter = {}
    let roleDeleteCounter = {}
    let unbanCounter = {}
    client.on("guildBanAdd", async (guild, user) => {
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });
        const banLog = fetchedLogs.entries.first();
        if (!banLog) return 
        const { executor, target } = banLog;
        if(executor.id == client.user.id) return 
        const name = executor.id
        if(!banCounter[guild.id]) banCounter[guild.id] = {}

        banCounter[guild.id][name] = (banCounter[guild.id][name] || 0) + 1
    })
    client.on("guildBanRemove", async (guild, user) => {
        console.log("test")
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_REMOVE',
        });
        const Log = fetchedLogs.entries.first();
        if (!Log) return 
        const { executor, target } = Log;
        if(executor.id == client.user.id) return 
        const name = executor.id
        if(!unbanCounter[guild.id]) unbanCounter[guild.id] = {}

        unbanCounter[guild.id][name] = (unbanCounter[guild.id][name] || 0) + 1
    })
    client.on("guildMemberRemove", async (member) => {
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        const Log = fetchedLogs.entries.first();
        if (!Log) return 
        const { executor, target } = Log;
        if(executor.id == client.user.id) return 
        const name = executor.id
        if(!kickCounter[guild.id]) kickCounter[guild.id] = {}
        if (target.id === member.id) {
            kickCounter[guild.id][name] = (kickCounter[guild.id][name] || 0) + 1
        }
        
    })
    client.on("channelDelete", async (channel) => {
        const guild = channel.guild
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_DELETE',
        });
        const Log = fetchedLogs.entries.first();
        if (!Log) return 
        const { executor, target } = Log;
        if(executor.id == client.user.id) return 
        const name = executor.id
        if(!channelDeleteCounter[guild.id]) channelDeleteCounter[guild.id] = {}

        channelDeleteCounter[guild.id][name] = (channelDeleteCounter[guild.id][name] || 0) + 1
    })
    client.on("channelCreate", async (channel) => {
        const guild = channel.guild
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_CREATE',
        });
        const Log = fetchedLogs.entries.first();
        if (!Log) return 
        const { executor, target } = Log;
        if(executor.id == client.user.id) return 
        const name = executor.id
        if(!channelCreateCounter[guild.id]) channelCreateCounter[guild.id] = {}

        channelCreateCounter[guild.id][name] = (channelCreateCounter[guild.id][name] || 0) + 1
    })
    client.on("roleCreate", async (role) => {
        const guild = role.guild
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_CREATE',
        });
        const Log = fetchedLogs.entries.first();
        if (!Log) return 
        const { executor, target } = Log;
        if(executor.id == client.user.id) return 
        const name = executor.id
        if(!roleCreateCounter[guild.id]) roleCreateCounter[guild.id] = {}

        roleCreateCounter[guild.id][name] = (roleCreateCounter[guild.id][name] || 0) + 1
    })
    client.on("roleDelete", async (role) => {
        const guild = role.guild
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: 'ROLE_DELETE',
        });
        const Log = fetchedLogs.entries.first();
        if (!Log) return 
        const { executor, target } = Log;
        if(executor.id == client.user.id) return 
        const name = executor.id
        if(!roleDeleteCounter[guild.id]) roleDeleteCounter[guild.id] = {}

        roleDeleteCounter[guild.id][name] = (roleDeleteCounter[guild.id][name] || 0) + 1
    })


    setInterval(() => {
        client.guilds.cache.forEach(async (guild) => {
            await mongo().then(async (mongoose) => {
                const result = serverRecords.findOne({ guildId: guild.id }, function (err, docs) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        if(!docs) return 
                        if(banCounter[guild.id] && docs.banLimit){
                            const sortedUsers = Object.keys(banCounter[guild.id]).sort(
                                (a, b) => banCounter[guild.id][b] - banCounter[guild.id][a]
                            )
                            for(const userID of sortedUsers){
                                const count = banCounter[guild.id][userID]
                                if(count > docs.banLimit){
                                    const user = client.users.cache.get(userID)
                                    const member = guild.members.cache.get(userID)
                                    if(!member.kickable){
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I can't kick ${user.tag}! ${user.tag} surpassed the **BAN** limit and I cannot kick them. Try moving the "Shielded" role above their highest role`)
                                    } else {
                                        member.kick()
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I've kicked ${user.tag} (${userID}) for surpassing the **BAN** limit`)
                                    }
                                }
                            }
                            banCounter[guild.id] = {}
                        }
                        if(kickCounter[guild.id] && docs.kickLimit){
                            const sortedUsers = Object.keys(kickCounter[guild.id]).sort(
                                (a, b) => kickCounter[guild.id][b] - kickCounter[guild.id][a]
                            )
                            for(const userID of sortedUsers){
                                const count = kickCounter[guild.id][userID]
                                if(count > docs.kickLimit){
                                    const user = client.users.cache.get(userID)
                                    const member = guild.members.cache.get(userID)
                                    if(!member.kickable){
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I can't kick ${user.tag}! ${user.tag} surpassed the **KICK** limit and I cannot kick them. Try moving the "Shielded" role above their highest role`)
                                    } else {
                                        member.kick()
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I've kicked ${user.tag} (${userID}) for surpassing the **KICK** limit`)
                                    }
                                }
                            }
                            kickCounter[guild.id] = {}
                        }
                        if(unbanCounter[guild.id] && docs.unbanLimit){
                            const sortedUsers = Object.keys(unbanCounter[guild.id]).sort(
                                (a, b) => unbanCounter[guild.id][b] - unbanCounter[guild.id][a]
                            )
                            for(const userID of sortedUsers){
                                const count = unbanCounter[guild.id][userID]
                                if(count > docs.unbanLimit){
                                    const user = client.users.cache.get(userID)
                                    const member = guild.members.cache.get(userID)
                                    if(!member.kickable){
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I can't kick ${user.tag}! ${user.tag} surpassed the **UNBAN** limit and I cannot kick them. Try moving the "Shielded" role above their highest role`)
                                    } else {
                                        member.kick()
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I've kicked ${user.tag} (${userID}) for surpassing the **UNBAN** limit`)
                                    }
                                }
                            }
                            unbanCounter[guild.id] = {}
                        }
                        if(channelCreateCounter[guild.id] && docs.channelCreateLimit){
                            const sortedUsers = Object.keys(channelCreateCounter[guild.id]).sort(
                                (a, b) => channelCreateCounter[guild.id][b] - channelCreateCounter[guild.id][a]
                            )
                            for(const userID of sortedUsers){
                                const count = channelCreateCounter[guild.id][userID]
                                if(count > docs.channelCreateLimit){
                                    const user = client.users.cache.get(userID)
                                    const member = guild.members.cache.get(userID)
                                    if(!member.kickable){
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I can't kick ${user.tag}! ${user.tag} surpassed the **CHANNEL CREATE** limit and I cannot kick them. Try moving the "Shielded" role above their highest role`)
                                    } else {
                                        member.kick()
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I've kicked ${user.tag} (${userID}) for surpassing the **CHANNEL CREATE** limit`)
                                    }
                                }
                            }
                            channelCreateCounter[guild.id] = {}
                        }
                        if(channelDeleteCounter[guild.id] && docs.channelDeleteLimit){
                            const sortedUsers = Object.keys(channelDeleteCounter[guild.id]).sort(
                                (a, b) => channelDeleteCounter[guild.id][b] - channelDeleteCounter[guild.id][a]
                            )
                            for(const userID of sortedUsers){
                                const count = channelDeleteCounter[guild.id][userID]
                                if(count > docs.channelDeleteLimit){
                                    const user = client.users.cache.get(userID)
                                    const member = guild.members.cache.get(userID)
                                    if(!member.kickable){
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I can't kick ${user.tag}! ${user.tag} surpassed the **CHANNEL DELETE** limit and I cannot kick them. Try moving the "Shielded" role above their highest role`)
                                    } else {
                                        member.kick()
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I've kicked ${user.tag} (${userID}) for surpassing the **CHANNEL DELETE** limit`)
                                    }
                                }
                            }
                            channelDeleteCounter[guild.id] = {}
                        }
                        if(roleCreateCounter[guild.id] && docs.roleCreateLimit){
                            const sortedUsers = Object.keys(roleCreateCounter[guild.id]).sort(
                                (a, b) => roleCreateCounter[guild.id][b] - roleCreateCounter[guild.id][a]
                            )
                            for(const userID of sortedUsers){
                                const count = roleCreateCounter[guild.id][userID]
                                if(count > docs.roleCreateLimit){
                                    const user = client.users.cache.get(userID)
                                    const member = guild.members.cache.get(userID)
                                    if(!member.kickable){
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I can't kick ${user.tag}! ${user.tag} surpassed the **ROLE CREATE** limit and I cannot kick them. Try moving the "Shielded" role above their highest role`)
                                    } else {
                                        member.kick()
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I've kicked ${user.tag} (${userID}) for surpassing the **ROLE CREATE** limit`)
                                    }
                                }
                            }
                            roleCreateCounter[guild.id] = {}
                        }
                        if(roleDeleteCounter[guild.id] && docs.roleDeleteLimit){
                            const sortedUsers = Object.keys(roleDeleteCounter[guild.id]).sort(
                                (a, b) => roleDeleteCounter[guild.id][b] - roleDeleteCounter[guild.id][a]
                            )
                            for(const userID of sortedUsers){
                                const count = roleDeleteCounter[guild.id][userID]
                                if(count > docs.roleDeleteLimit){
                                    const user = client.users.cache.get(userID)
                                    const member = guild.members.cache.get(userID)
                                    if(!member.kickable){
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I can't kick ${user.tag}! ${user.tag} surpassed the **ROLE DELETE** limit and I cannot kick them. Try moving the "Shielded" role above their highest role`)
                                    } else {
                                        member.kick()
                                        client.users.cache.get(docs.sendAntiNukeMessage || guild.owner.id).send(`I've kicked ${user.tag} (${userID}) for surpassing the **ROLE DELETE** limit`)
                                    }
                                }
                            }
                            roleDeleteCounter[guild.id] = {}
                        }
                    }
                });
            })
            
        })
    }, 60000)
}