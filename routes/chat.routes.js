const router = require("express").Router();
const Chat = require("../models/chat.model");

router.get('/', async (req, res) => {
    try {
        await res.status(200).send('Hello!')
    } catch (e) {
        res.status(500).json({message: "something went wrong"})
    }
})

router.post('/new/conversation',  (req, res) => {
    const dbData = req.body
    try {
         Chat.create(dbData, (err, data) => {

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

router.post('/first/message',  (req, res) => {
    try{
        Chat.updateOne(
            {_id: req.query.id},
            {$push: {conversation: req.body, jsId: req.query.jsId, recId: req.query.recId}},
            (err, data) => {
                if (err) {
                    console.log(data)
                    console.log("Error sending message...")
                    console.log(err)
                    res.status(500).send(err)
                } else {
                    res.status(202).send(data)
                    console.log("hello",req.body)
                    console.log("data:",data)
                }
            })
    } catch (e) {
        res.status(400).json({message: e})
    }

})

router.post('/new/message',  (req, res) => {
    try{
         Chat.updateOne(

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

    try{
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

router.get('/get/conversationFromJS', async (req, res) => {
    const id = req.query.id

    try{
        await Chat.find({jsId: id}, (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                console.log(data)
                res.status(200).send(data)
            }
        })
    } catch (e) {
        res.status(500).json({message: "something went wrong"})
    }
})

router.get('/get/conversationFromRC', async (req, res) => {
    const id = req.query.id

    try{
        await Chat.find({recId: id}, (err, data) => {
            if (err) {
                res.status(500).send(err)
            } else {
                console.log(data)
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
