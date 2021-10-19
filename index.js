const express = require('express');
const mongoose = require('mongoose');
const redis = require("redis")
const session = require("express-session")
const cors = require("cors")

const { 
    MONGO_USER, 
    MONGO_PASSWORD,
    MONGO_IP, 
    MONGO_PORT, 
    REDIS_URL, 
    REDIS_PORT, 
    SESSION_SECRET 
} = require('./config.js/config');



let RedisStore = require("connect-redis")(session)  // passing the session to redis storage
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})


const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
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

// Main app
const app = express();

// Enable "trust proxy" (because our app is behind a reverse proxy)
app.enable("trust proxy")

// Middlewares
app.use(cors) // enable CORS globally
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

// Routes
const postRouter = require('./routes/postRoute');
const userRouter = require('./routes/userRoute');

// Use Routes
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

app.get('/api', (req, res) => {
    res.send('You are using the API!')
    console.log("/api is visited")
});

const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`listening on ${port}`)) 