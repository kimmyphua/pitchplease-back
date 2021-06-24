const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/user.model')
require('dotenv').config()



passport.serializeUser(function(user, done) {
    console.log(user)
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use("local",new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password"
    },
    function(email, password, done) {
        UserModel.findOne({ email }, function(err, user) {

            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {

                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));





module.exports = passport
