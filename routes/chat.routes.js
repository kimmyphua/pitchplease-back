const router = require("express").Router();
const Chat = require("../models/chat.model");

router.get('/', async (req, res) => {
    try {
        await res.status(200).send('Hello!')
    } catch (e) {
        res.status(500).json({message: "something went wrong"})
    }
})

router.post('/new/conversation', async (req, res) => {
    const dbData = req.body
    try {
        await Chat.create(dbData, (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(201).send(data)
            }
        })
    } catch (e) {
        res.status(400).json({message: e})
    }
})

router.post('/new/message', async (req, res) => {
    try {
        await Chat.updateOne(
            {_id: req.query.id},
            {$push: {conversation: req.body}},
            (err, data) => {
                if (err) {
                    console.log("Error sending message...")
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(202).send(data)
                }
            })
    } catch (e) {
        res.status(400).json({message: e})
    }
})

router.get('/get/conversationList', async (req, res) => {
    try {
        await Chat.find((err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                data.sort((b, a) => {
                    return a.timestamp - b.timestamp;
                });
                let conversations = []
                console.log(data)
                data.map((conversationData) => {
                    const conversationInfo = {
                        id: conversationData._id,
                        name: conversationData.chatName,
                        timestamp: conversationData.conversation[0].timestamp
                    }
                    conversations.push(conversationInfo)
                })
                res.status(200).send(conversations)
            }
        })
    } catch (e) {
        res.status(500).json({message: "something went wrong"})
    }
})

router.get('/get/conversation', async (req, res) => {
    const id = req.query.id
    try {
        await Chat.find({_id: id}, (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                res.status(200).send(data)
            }
        })
    } catch (e) {
        res.status(500).json({message: "something went wrong"})
    }
})

router.get('/get/lastMessage', async (req, res) => {
    const id = req.query.id
    try {
        await Chat.find({_id: id}, (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                let convData = data[0].conversation
                convData.sort((b, a) => {
                    return a.timestamp - b.timestamp;
                });
                res.status(200).send(convData[0])
            }
        })
    } catch (e) {
        res.status(500).json({message: "something went wrong"})
    }
})

module.exports = router;
