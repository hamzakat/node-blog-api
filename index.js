const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config.js/config');
const mongoose = require('mongoose');
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const redis = require("redis")
const session = require("express-session")

let RedisStore = require("connect-redis")(session)  // passing the session to redis storage
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})


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
const app = express();

// Routes
const postRouter = require('./routes/postRoute');
const userRouter = require('./routes/userRoute');

// Middlewares
app.use(express.json());
app.use(session({
    store: new RedisStore({
        client: redisClient
    }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000 
    }
}))

app.get('/', (req, res) => {
    res.send('Hello !!!')
});

// localhost:3000/api/v1/$$$
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000; 

app.listen(port, () => console.log(`listening on ${port}`)) 