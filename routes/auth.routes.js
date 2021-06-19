const router = require("express").Router();
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require('dotenv').config()
const checkUser = require("../lib/check")
const passport = require('../lib/passportConfig')


router.get('/user', checkUser, async (req, res) => {
    try {
        let user = await UserModel.findById(req.user.id, "-password")
        res.status(200).json({user})
    } catch (e) {
        res.status(500).json({message: "something went wrong"})
    }
})


router.post('/register', async (req, res) => {
    try {

        let isEmailExist = await UserModel.findOne({email: req.body.email});
        //  error when email already registered
        if (isEmailExist) {
            // throw "Email already exist!"
            res.status(400).json({message: "Email already exists"});
        } else {
            let user = new UserModel(req.body)
            user.password = await bcrypt.hash(user.password, 10)
            console.log(user)
            await user.save()
            let token = jwt.sign({
                user: {
                    id: user._id,
                }
            }, process.env.JWTSECRET, {expiresIn: 1000})


            res.status(201).json({token})
        }
    } catch (e) {
        res.status(400).json({message: e})
    }

})


router.post('/login', async (req, res) => {
    try {
        let user = await UserModel.findOne({email: req.body.email})
        //if user is empty
        if (!user) {
            throw "user not found"
        }
        //if password is not a match
        if (!user.validPassword(req.body.password)) {
            throw "check user password"
        }

        //sign the token
        //process.env.JWTSECRET
        let token = jwt.sign({
            user: {
                id: user._id
            }
        }, process.env.JWTSECRET)


        res.status(200).json({token})
    } catch (e) {
        console.log(e)
        res.status(400).json({message: e})

    }

})


router.get('/auth/linkedin', passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_liteprofile'],
}));

router.get('/linkedin/callback',
    passport.authenticate('linkedin', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: false
    })

);


// router.get("/user", (req, res) => {
//     console.log("getting user data!");
//     res.send(user);
// });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated())
//         return next();
//     res.redirect('/');
// }


// router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}))
//
//
// router.get('/facebook/callback',
//
//     passport.authenticate('facebook', {
//         successRedirect: '/dashboard',
//         failureRedirect: '/auth/login',
//         failureFlash: false
//     })
//
// );

router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback",
    passport.authenticate("facebook"),
    (req, res) => {
        res.redirect("/");
    });




module.exports = router;
