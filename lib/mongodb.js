const mongoose = require("mongoose");
const Pusher = require("pusher");
require('dotenv').config()

const pusher = new Pusher({
    appId: "1222502",
    key: "aaca110194e03e7b0484",
    secret: "d59b383a83e3a7d6d2a7",
    cluster: "ap1",
    useTLS: true
});

mongoose.connect(process.env.DB, {
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("mongodb running")
})

mongoose.connection.once('open', () => {
    console.log('DB connected')

    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('chats', 'newChat', {
                'change': change
            })
        } else if (change.operationType === 'update') {
            pusher.trigger('messages', 'newMessage', {
                'change': change
            })
        } else {
            console.log('Error triggering pusher...')
        }
    })
})

module.exports = mongoose
