const mongoose = require('mongoose')
const Schema = mongoose.Schema

const
    pitchSchema = new Schema({
        creator: {
            type: Schema.Types.ObjectId,
            // required: true,
            ref: 'User'
        },
        title:{type: String, required: true},
        selfintro: {type: String, required: true, minlength: 1, maxlength: 200},
        usp: {type: String, required: true, minlength: 1, maxlength: 200},
        goals: {type: String, required: true, minlength: 1, maxlength: 200},

    })

module.exports = mongoose.model("Pitch", pitchSchema)
