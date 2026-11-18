const express = require("express")
const videoLikesModel = require("../models/videoLikesModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {buyerEmail,videoId} = req.body
        const videoFind = await videoLikesModel.findOne({buyerEmail,videoId})
        if(videoFind){
            res.json({msg:false})
        }else{
            const response = await videoLikesModel.create({
                buyerEmail,videoId,
                createdAt:Date.now()
            })
            res.json({msg:true})
        }
        
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router