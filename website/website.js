const mongo = require("../mongo.js")
const serverSettings = require('../schemas/serverSettings.js')

module.exports = {
    startServer: (client) => {
        const express = require('express');
        const app = express();
        const port = 80;
        const path = require('path')
        const rateLimit = require("express-rate-limit");
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 50 // limit each IP to 100 requests per windowMs
        });
        
        app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
        app.get('/bad', (req, res) => res.sendFile(path.join(__dirname, '/badinput.html')));
        app.get('/submit', (req, res) => res.sendFile(path.join(__dirname, '/submit.html')));
        app.get('/scripts/style.css', (req, res) => res.sendFile(path.join(__dirname, '/style.css')));
        app.get('/images/favicon', (req, res) => res.sendFile(path.join(__dirname, '/favicon.png')));
        
        app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
        
        app.use(express.urlencoded({ extended: false }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(limiter);
        app.engine('html', require('ejs').renderFile);
        
        app.post('/submit-form', function (req, res) {
        const { channelID, channeltype, message, password } = req.body
        if(channeltype !== "DM" && channeltype !== "GUILD") return res.sendFile(path.join(__dirname, '/badinput.html'));
        if(password !== process.env.password0 && password !== process.env.password1) return res.sendFile(path.join(__dirname, '/submit.html'));
        try{
            if(channeltype == "DM") client.users.cache.get(channelID).send(message)
            if(channeltype == "GUILD") client.channels.cache.get(channelID).send(message)
        } catch(e){
            res.sendFile(path.join(__dirname, '/badinput.html'))
        }
        res.sendFile(path.join(__dirname, '/submit.html'));
        });

        app.get('/servers/:id/badwords/confirmed', (req, res) => {
            let badwords = "none"
            mongo().then(async (mongoose) => {
                const result = serverSettings.findOne({ guildId: req.params.id }, function (err, docs) {
                    if (err){
                        console.log(err)
                    }
                    else{
                        if(docs && docs.badwords){
                            badwords = docs.badwords.join(",badwords-seperator,")
                        }
                        res.render(path.join(__dirname, '/badwordspage.html'), {id:req.params.id,page:req.params.page,badwords:badwords})
                    }
                });
            })
        });
        app.get('/servers/:id/badwords/', (req, res) => {
            res.sendFile(path.join(__dirname, '/confirmbadwords.html'))
        });
    }
}