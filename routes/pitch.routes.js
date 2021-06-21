const router = require("express").Router();
const userModel = require("../models/user.model");
const pitchModel = require("../models/pitch.model")
// const checkUser = require("../lib/check")

router.get("/",async (req,res)=>{
    try{
        let pitches = await pitchModel.find()
        res.status(200).json({pitches})
    }catch(e){
        res.status(400).json({"message":"fail to find pitches"})
    }
})

router.get("/:id", async(req,res)=>{
    try{
        //find all files that has this parent id as well
        let pitch = await pitchModel.findById(req.params.id)
        res.status(200).json({pitch})
    }catch (e) {
        res.status(400).json({"message":"fail to find user/pitch"})
    }
})

router.post("/create", async(req,res)=>{
    try{
        let pitch = new pitchModel(req.body)
        console.log(pitch)
        await pitch.save()
        await userModel.findByIdAndUpdate(req.body.creator, {$push: { pitches: pitch }})
        // await pitchModel.findByIdAndUpdate(req.body.pitch, {$push: { pitches: pitch }})
        // await userModel.findByIdAndUpdate({ _id: req.body.creator._id}, {$push: { pitches: pitch._id }})
        res.status(201).json({message: "pitch created!"})
    }catch (e) {
        console.log(e)
        res.status(400).json({message:"failed to create pitch"})
    }
})

router.delete("/delete/:id", async(req,res)=>{
    try{
        await pitchModel.findByIdAndDelete(req.params.id)
        res.status(204).json({"message":"deleted pitch"})
    }catch (e) {
        res.status(400).json({"message":"fail to delete pitch"})
    }
})

router.put("/edit/:id", async(req,res)=>{
    try{
        await pitchModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({"message":"updated pitch"})
    }catch (e) {
        res.status(400).json({"message":"fail to edit pitch"})
    }
})

module.exports = router
