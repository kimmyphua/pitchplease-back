const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/user.model')
const FacebookStrategy = require('passport-facebook').Strategy
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



/////extra codes heereeee
passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID_FB,
        clientSecret: process.env.CLIENT_SECRET_FB,
        callbackURL: "http://localhost:8000/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']
    },
    function(token, refreshToken, profile, done) {
        UserModel.findOne({'uid': profile.id}, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    console.log("user found")
                    console.log(user)
                    return done(null, user); // user found, return that user
                }
                else {
                    // if there is no user found with that facebook id, create them
                    let newUser = new UserModel();

                    // set all of the facebook information in our user model
                    newUser.uid = profile.id; // set the users facebook id
                    newUser.token = token; // we will save the token that facebook provides to the user
                    newUser.password = profile.name.givenName,
                    newUser.firstname = profile.name.givenName,
                    newUser.lastname = profile.name.familyName,
                    newUser.username = profile.name.givenName + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    newUser.gender = profile.gender
                    newUser.pic = profile.photos[0].value
                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
            }
        );
    }))




module.exports = passport
