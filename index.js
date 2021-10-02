const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config.js/config');
const express = require('express')

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("connected"))
    .catch((e) => console.log(e))

app.get('/', (req, res) => {
    res.send('Hello !!!')
});

const port = process.env.PORT || 3000; 

app.listen(port, () => console.log(`listening on ${port}`)) 