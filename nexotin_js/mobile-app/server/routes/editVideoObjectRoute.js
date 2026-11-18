const express = require("express")
const videoModel = require("../models/videoModel")
require("dotenv").config()
const router = express.Router()

router.post("/",async(req,res)=>{
    try{   
        const {videoId,title,productId} = req.body
        // const response = await  videoModel.findOne({_id:videoId})
        const response = await videoModel.updateOne({ _id: videoId }, { $set: { title, productId } });
        res.json({msg:response})
    }catch(error){
        res.json({msg:error})
    }
})

module.exports = router