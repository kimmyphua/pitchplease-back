const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatName: String,
    jsId: String,
    recId: String,
    conversation: [
        {
            message: String,
            timestamp: String,
            user: {
                name: String,
                email: String,
                _id: String
            }
        }
    ]
})

module.exports = mongoose.model("conversations", chatSchema)

