const mongoose = require('mongoose');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config.js/config');
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
};
connectWithRetry();

const express = require('express');
const postRouter = require('./routes/postRoute');
const userRouter = require('./routes/userRoute');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello !!!')
});

// localhost:3000/api/v1/$$$
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000; 

app.listen(port, () => console.log(`listening on ${port}`)) 