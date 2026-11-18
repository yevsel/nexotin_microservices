const express = require("express")
const videoModel = require("../models/videoModel")
const router = express.Router()
const jwt = require("jsonwebtoken")
const videoLikesModel = require("../models/videoLikesModel")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET

const videoLikesCountFunc = async(ids)=>{
    return new Promise(async(resolve,reject)=>{
        let arr = []
        for (let i=0;i<ids.length;i++){
            const countResponse = await videoLikesModel.countDocuments({videoId:ids[i]})
            arr.push(countResponse)
        }
        resolve(arr)
    })
}

router.post("/",async(req,res)=>{
    try {
        // const token = req.headers.authorization.split(" ")[1]
        // const secret_info = jwt.verify(token,LOGIN_SECRET)
        const {vendorId,createdAt} = req.body
        const responseFromDatabase = await videoModel.find({vendorId,createdAt:{$lt:createdAt}}).sort({ createdAt: -1 }).limit(5)
        const ids = responseFromDatabase.map(item=>item._id.toString())
        const countRes = await videoLikesCountFunc(ids)
        let finalVideoWithLikes = []
        if(responseFromDatabase.length>0){
            finalVideoWithLikes= responseFromDatabase.map((item,index)=>{
                return {
                _id:item._id,
                accountType:item.accountType,
                vendorId:item.vendorId,
                title:item.title,
                productId:item.productId,
                videoObject:item.videoObject,
                createdAt:item.createdAt,
                likes:countRes[index]
                }
            })
        }
        res.json({msg:finalVideoWithLikes})
        
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router