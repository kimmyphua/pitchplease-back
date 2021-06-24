const mongoose = require('mongoose')
const {Schema} = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    uid: String,
    token: String,
    refreshToken: String,
    name: {
        type: String,
        required: true,
        min: 6,
        max: 25,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 25,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20,
    },
    role: {
        type: String, required:true,
        default: 'jobseeker',
        enum: ['jobseeker', 'recruiter']
    },
    pitches: [{
        type: Schema.Types.ObjectId,
        ref: 'Pitch'
    }],
    skills: [{type: String}],
    favourites:[{
        type: Schema.Types.ObjectId,
        ref: 'Pitch'
    }],
    contact:  {type: Number},
    messages: [{
        sender: {type: String},
        title: {type: String},
        pitchId: {type:String},
        name: {type: String},
        text: {type: String},
        time: {type: String}}
        ]

});

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}
module.exports = mongoose.model("User", userSchema)
