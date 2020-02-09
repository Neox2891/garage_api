'use strict';

const result = require('dotenv').config();
if (result.error) {
    throw new Error(result.error);
}

const express = require('express');
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://13.58.177.122:1883')

// Constants
const PORT = 3030;
const HOST = 'localhost';
const TOPIC = 'garage';

const TOKENS = {
    ely: process.env.ELY,
    mary: process.env.MARY,
    nestor: process.env.NESTOR,
    mama: process.env.MAMA,
    papa: process.env.PAPA,
}

const ACTIONS = {
    open: 'open',
    stop: 'stop',
    close: 'close',
}

// App
const app = express();

client.on('connect', function () {
    console.log('Connected to mqtt broker!!!');
    client.subscribe(TOPIC, function (err) {
        if (!err) {
            console.log(`Suscribed to "${TOPIC}" topic`);
        } else {
            console.log(`cannot susccribed to "${TOPIC}" topic`);
        }
    });
});

app.use('/garage/open/:token', (req, res, next) => {
    let token = (req.params) ? req.params.token : null;
    if (!token) return res.send('send token to access!');
    if (Object.values(TOKENS).includes(token)) {
        console.log('logged');
        next();
    } else {
        return res.status(401).send('Unauthorized');
    }
});

app.post('/garage/open/:token', (req, res) => {
    client.publish('garage', ACTIONS.open);
    return res.send('Opening...');
});

app.post('/garage/stop/:token', (req, res) => {
    client.publish('garage', ACTIONS.stop);
    return res.send('Stoping...');
});

app.post('/garage/close/:token', (req, res) => {
    client.publish('garage', ACTIONS.close);
    return res.send('Closing...');
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);