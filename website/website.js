const mongo = require("../mongo.js")
const serverSettings = require('../schemas/serverSettings.js')

module.exports = {
    startServer: (client) => {
        const express = require('express');
        const https = require('https');
        const http = require('http');
        const fs = require('fs');
        const app = express();
        const port = 443;
        const path = require('path')
        const rateLimit = require("express-rate-limit");
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 50 // limit each IP to 100 requests per windowMs
        });
        const httpsserver = https.createServer({
            key: fs.readFileSync('/etc/letsencrypt/live/shielded.ddns.net/privkey.pem'),
            cert: fs.readFileSync('/etc/letsencrypt/live/shielded.ddns.net/fullchain.pem'),
            ca: fs.readFileSync('/etc/letsencrypt/live/shielded.ddns.net/chain.pem', 'utf8')
          }, app);
        
        app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
        app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
        app.get('/bad', (req, res) => res.sendFile(path.join(__dirname, '/badinput.html')));
        app.get('/submit', (req, res) => res.sendFile(path.join(__dirname, '/submit.html')));
        app.get('/scripts/style.css', (req, res) => res.sendFile(path.join(__dirname, '/style.css')));
        app.get('/images/favicon', (req, res) => res.sendFile(path.join(__dirname, '/favicon.png')));

        app.use((req, res, next) => {
            if (process.env.NODE_ENV === 'production') {
                if (req.headers['x-forwarded-proto'] !== 'https'){
                    return res.redirect('https://' + req.headers.host + req.url);
                } else {
                    return next();
                }
            } else {
                return next();
            }
            }
        );
        
        httpsserver.listen(port, () => console.log(`Example httpsserver listening at https://${_website}:${port}`));
        
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