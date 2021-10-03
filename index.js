const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config.js/config');
const express = require('express')

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

connectWithRetry = () => {
    mongoose
    .connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("connected to DB"))
    .catch((e) => {
        setTimeout(connectWithRetry, 5000)
    });
}



app.get('/', (req, res) => {
    res.send('Hello !!!')
});

const port = process.env.PORT || 3000; 

app.listen(port, () => console.log(`listening on ${port}`)) 