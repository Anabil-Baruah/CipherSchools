const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
require('dotenv').config()
const session = require('express-session');
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ limit: '50mb',extended: true }))
app.use(cookieParser());
app.use('/', express.static(__dirname + '/public'));
app.use('/auth', express.static(__dirname + '/public'));


app.use('/', require('./routers/login'))
app.use('/auth', require('./routers/auth'))
app.set("view engine", "ejs")

app.listen(port, ()=> {console.log("Srever started")})