const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatName: String,
<<<<<<< HEAD
=======
    jsId: String,
    recId: String,
>>>>>>> 3cdfafcc89d51f4cfe5c4ae319444a1c6f04694a
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

