const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatName: String,
    conversation: [
        {
            message: String,
            timestamp: String,
            user: {
                displayName: String,
                email: String,
                photo: String,
                uid: String
            }
        }
    ]
})

module.exports = mongoose.model("conversations", chatSchema)

