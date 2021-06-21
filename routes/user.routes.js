const router = require("express").Router()
const userModel = require("../models/user.model")
const pitchModel = require("../models/pitch.model")

router.get("/",async (req,res)=>{
    try{
        let users = await userModel.find()
            .populate({
                path: 'pitches'
            })
        res.status(200).json({users})
    }catch(e){
        res.status(400).json({"message":"fail to find users"})
    }
})

router.get("/:id", async(req,res)=>{
    try{
        //get current folder
        let user = await userModel.findById(req.params.id)
            .populate({
                path: 'pitches'
            })

        res.status(200).json({user})
    }catch (e) {
        res.status(400).json({"message":"fail to find user"})
    }
})

// router.post("/create", async(req,res)=>{
//     try{
//         // let user = await userModel.find()
//         //             .populate({
//         //                 path: 'pitches'
//         //             })
//
//         let user = new userModel(req.body)
//         await user.save()
//
//         res.status(201).json({ message:  "user saved", user})
//     }catch (e) {
//         console.log(e)
//         res.status(400).json({message:"failed to create user"})
//     }
// })

router.delete("/delete/:id", async(req,res)=>{
    try{
        console.log(req.params.id)
        await userModel.findByIdAndDelete(req.params.id)
        res.status(204).json({"message":"deleted user"})
    }catch (e) {
        res.status(400).json({"message":"fail to delete user"})
    }
})

router.put("/edit/:id", async(req,res)=>{
    try{
        await userModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({"message":"updated user"})
    }catch (e) {
        res.status(400).json({"message":"fail to edit user"})
    }
})

module.exports = router
