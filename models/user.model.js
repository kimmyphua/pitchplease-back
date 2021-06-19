const mongoose = require('mongoose')
const {Schema} = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },

});

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model("User", userSchema)
