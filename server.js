const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/', express.static(__dirname + '/public'));
// app.use('/auth', express.static(__dirname + '/public'));


app.use('/', require('./routers/login'))
app.use('/auth', require('./routers/auth'))
app.set("view engine", "ejs")

app.listen('3000', ()=> {console.log("Srever started")})