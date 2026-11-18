const express = require("express")
const videoLikesModel = require("../models/videoLikesModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {buyerEmail,videoId} = req.body
        // Find product first
        const deletionRes = await videoLikesModel.deleteOne({buyerEmail,videoId})
        if(deletionRes){
            res.json({msg:true})
        }
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router