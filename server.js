const express = require('express')
// const expressLayouts = require('express-ejs-layouts')
const mongoose = require("mongoose");
require('./lib/mongodb')
const app = express()
require('dotenv').config()
const session = require('express-session')
const passport = require('./lib/passportConfig')
const cors = require('cors')
const path = require('path');
//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.resolve(__dirname, 'build')));
//static js, css, image, audio, video
app.use(express.static('node_modules'))
app.use(express.static('public'))
// app.set('view engine', 'ejs')
// app.use(expressLayouts)
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 360000}//cookie duration. needed to know cookie duration
}))
app.use(passport.initialize());
app.use(passport.session());
// app.use(function(req, res, next){
//     // console.log(req)
//     //setting global variables for ejs
//     res.locals.currentUser = req.user
//     next()
// })
app.use("/api/pitch", require('./routes/pitch.routes'))
app.use("/api/chat", require('./routes/chat.routes'))
app.use("/api/user", require('./routes/user.routes'))
app.use("/api/auth", require('./routes/auth.routes'))
app.use("/api", require('./routes/dashboard.routes'))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
app.listen(process.env.PORT || 8000, () => console.log(`running on ${process.env.PORT}`))