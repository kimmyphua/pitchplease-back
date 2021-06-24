const express = require('express')
require('./lib/mongodb')
const app = express()
require('dotenv').config()
const session = require('express-session')
const passport = require('./lib/passportConfig')
const cors = require('cors')


//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


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




app.use(function(req, res, next){
    // console.log(req)
    //setting global variables for ejs
    res.locals.currentUser = req.user
    next()
})

<<<<<<< HEAD
=======
// app.use("/api", require('./routes/property.routes'))
>>>>>>> 3cdfafcc89d51f4cfe5c4ae319444a1c6f04694a
app.use("/chat", require('./routes/chat.routes'))
app.use("/pitch", require('./routes/pitch.routes'))
app.use("/user", require('./routes/user.routes'))
app.use("/auth", require('./routes/auth.routes'))
app.use("/", require('./routes/dashboard.routes'))



app.listen(process.env.PORT, () => console.log(`running on ${process.env.PORT}`))
