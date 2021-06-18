// module.exports = function (req, res, next){
//     console.log("started check")
//     if(req.isAuthenticated()){
//         next()
//     }else{
//         res.redirect("/auth/login")
//     }
// }
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = async function (req,res,next) {

        let token = req.headers.authorization.split(" ")[1]
        console.log("req.headers.authorization", req.headers.authorization)
        if(!token) {
            return res.status(401).json({message: "no token"})
        }

        try{
            let decoded = jwt.verify(token, process.env.JWTSECRET);
            console.log("decoded",decoded)
            req.user = decoded.user
            next()

        }catch (e){
            return res.status(401).json({message: "token not valid"})
        }

    }
