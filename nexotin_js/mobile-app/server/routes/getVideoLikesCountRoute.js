const express = require("express")
// const subscriptionModel = require("../models/subscriptionModel")
const videoLikesModel = require("../models/videoLikesModel")
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {buyerEmail,videoId} = req.body
        const count = await  videoLikesModel.countDocuments({videoId})
        const findBuyer = await videoLikesModel.findOne({buyerEmail,videoId})
        res.json({msg:{count,liked:findBuyer?true:false}})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router