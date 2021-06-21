const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/user.model')
const FacebookStrategy = require('passport-facebook').Strategy
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy

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


// passport registration

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await UserModel.findOne({where: {linkedinId: id}})
//         done(null, user)
//     } catch (err) {
//         done(err)
//     }
// })
// passport.use(new LinkedInStrategy({
//     clientID: process.env.LINKEDIN_CLIENT_ID,
//     clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/linkedin/callback",
//     scope: ['r_emailaddress', 'r_liteprofile'],
// }, function(accessToken, refreshToken, profile, done) {
//     UserModel.findOne({'uid': profile.id}, function (err, user) {
//
//             // if there is an error, stop everything and return that
//             // ie an error connecting to the database
//             if (err)
//                 return done(err);
//
//             // if the user is found, then log them in
//             if (user) {
//                 console.log("user found")
//                 console.log(user)
//                 return done(null, user); // user found, return that user
//             }
//             else {
//                 // if there is no user found with that facebook id, create them
//                 let newUser = new UserModel();
//
//                 // set all of the facebook information in our user model
//                 newUser.uid = profile.id; // set the users facebook id
//                 newUser.token = accessToken; // we will save the token that facebook provides to the user
//                 newUser.refreshToken = refreshToken;
//                 newUser.password = profile.firstName,
//                     newUser.name = profile.firstName,
//                     // newUser.username = profile._json.firstName + profile._json.lastName; // look at the passport user profile to see how names are returned
//                 newUser.email = profile.emailAddress; // facebook can return multiple emails so we'll take the first
//
//                 // save our user to the database
//                 newUser.save(function (err) {
//                     if (err)
//                         throw err;
//
//                     // if successful, return the new user
//                     return done(null, newUser);
//                 });
//             }
//         }
//     );
// }))

let user = {};

passport.use( new LinkedInStrategy({
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: "/auth/linkedin/callback",
            scope: ["r_emailaddress", "r_liteprofile"],
        },
        (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {
            process.nextTick(() => {
                user = { ...profile };
                return done(null, profile);
            });
        }
    )
);


// passport.use(new FacebookStrategy({
//         clientID: process.env.CLIENT_ID_FB,
//         clientSecret: process.env.CLIENT_SECRET_FB,
//         callbackURL: "/auth/facebook/callback"
//     },
//     (accessToken, refreshToken, profile, cb) => {
//         console.log(JSON.stringify(profile));
//         user = { ...profile };
//         return cb(null, profile);
//     }));













/////extra codes heereeee
passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID_FB,
        clientSecret: process.env.CLIENT_SECRET_FB,
        callbackURL: "/auth/facebook/callback",
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
                    newUser.name = profile.name.givenName,
                    // newUser.lastname = profile.name.familyName,
                    // newUser.username = profile.name.givenName + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                    // newUser.gender = profile.gender
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
