const express = require("express")
const videoModel = require("../models/videoModel")

const router = express.Router()

router.get("/",async(req,res)=>{
    try {
        // const response = await videoModel.find().sort({ createdAt: 1 }).limit(10)
        const response = await videoModel.aggregate([{$sample:{size:4}}])
        res.status(200).json({msg:response})
    } catch (error) {
        res.status(404).json({msg:error.message})
    }
})

module.exports = router 