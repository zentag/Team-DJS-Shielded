const mongo = require("../mongo.js")
const serverSettings = require('../schemas/serverSettings.js')

module.exports = {
    startServer: (client) => {
        const express = require('express');
        const https = require('https');
        const fs = require('fs');
        const app = express();
        const port = 80;
        const path = require('path')
        const rateLimit = require("express-rate-limit");
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 50 // limit each IP to 100 requests per windowMs
        });
        app.use(express.static(__dirname, { dotfiles: 'allow' } ));
        // const httpsserver = https.createServer({
        //     key: fs.readFileSync('/etc/letsencrypt/live/shielded.ddns.net/privkey.pem'),
        //     cert: fs.readFileSync('/etc/letsencrypt/live/shielded.ddns.net/fullchain.pem'),
        //   }, app);
        
        // httpsserver.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
        // httpsserver.get('/bad', (req, res) => res.sendFile(path.join(__dirname, '/badinput.html')));
        // httpsserver.get('/submit', (req, res) => res.sendFile(path.join(__dirname, '/submit.html')));
        // httpsserver.get('/scripts/style.css', (req, res) => res.sendFile(path.join(__dirname, '/style.css')));
        // httpsserver.get('/images/favicon', (req, res) => res.sendFile(path.join(__dirname, '/favicon.png')));
        
        app.listen(port, () => console.log(`Example httpsserver listening at http://localhost:${port}`));
        
        // httpsserver.use(express.urlencoded({ extended: false }));
        // httpsserver.use(express.static(path.join(__dirname, 'public')));
        // httpsserver.use(limiter);
        // httpsserver.engine('html', require('ejs').renderFile);
        
        // httpsserver.post('/submit-form', function (req, res) {
        // const { channelID, channeltype, message, password } = req.body
        // if(channeltype !== "DM" && channeltype !== "GUILD") return res.sendFile(path.join(__dirname, '/badinput.html'));
        // if(password !== process.env.password0 && password !== process.env.password1) return res.sendFile(path.join(__dirname, '/submit.html'));
        // try{
        //     if(channeltype == "DM") client.users.cache.get(channelID).send(message)
        //     if(channeltype == "GUILD") client.channels.cache.get(channelID).send(message)
        // } catch(e){
        //     res.sendFile(path.join(__dirname, '/badinput.html'))
        // }
        // res.sendFile(path.join(__dirname, '/submit.html'));
        // });

        // httpsserver.get('/servers/:id/badwords/confirmed', (req, res) => {
        //     let badwords = "none"
        //     mongo().then(async (mongoose) => {
        //         const result = serverSettings.findOne({ guildId: req.params.id }, function (err, docs) {
        //             if (err){
        //                 console.log(err)
        //             }
        //             else{
        //                 if(docs && docs.badwords){
        //                     badwords = docs.badwords.join(",badwords-seperator,")
        //                 }
        //                 res.render(path.join(__dirname, '/badwordspage.html'), {id:req.params.id,page:req.params.page,badwords:badwords})
        //             }
        //         });
        //     })
        // });
        // httpsserver.get('/servers/:id/badwords/', (req, res) => {
        //     res.sendFile(path.join(__dirname, '/confirmbadwords.html'))
        // });
    }
}