module.exports = {
    startServer: (client) => {
        const express = require('express');
        const app = express();
        const port = 3000;
        const path = require('path')
        const rateLimit = require("express-rate-limit");
        const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 50 // limit each IP to 100 requests per windowMs
        });
        
        app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/index.html')));
        app.get('/bad', (req, res) => res.sendFile(path.join(__dirname, '/badinput.html')));
        app.get('/scripts/style.css', (req, res) => res.sendFile(path.join(__dirname, '/style.css')));
        app.get('/images/favicon', (req, res) => res.sendFile(path.join(__dirname, '/favicon.png')));
        
        app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
        
        app.use(express.urlencoded({ extended: false }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(limiter);
        
        app.post('/submit-form', function (req, res) {
        const { channelID, channeltype, message, password } = req.body
        if(channeltype !== "DM" && channeltype !== "GUILD") return res.sendFile(path.join(__dirname, '/badinput.html'));
        if(password !== process.env.password) return res.sendFile(path.join(__dirname, '/submit.html'));
        try{
            if(channeltype == "DM") client.users.cache.get(channelID).send(message)
            if(channeltype == "GUILD") client.channels.cache.get(channelID).send(message)
        } catch(e){
            res.sendFile(path.join(__dirname, '/badinput.html'))
        }
        res.sendFile(path.join(__dirname, '/submit.html'));
        });
    }
}