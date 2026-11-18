const express = require("express")
const videoModel = require("../models/videoModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret = process.env.LOGIN_SECRET
const router = express.Router()


router.post("/",async(req,res)=>{
    try {
        const {title,productId,videoObject} = req.body
        const token = req.headers.authorization.split(" ")[1].trim()
        const info = jwt.verify(token,jwt_secret)
        const response = await videoModel.create({
            accountType:info.accountType,
            vendorId:info.id,
            title,
            productId,
            videoObject,
            createdAt:Date.now()
        })
        
        res.json({msg:response})
    } catch (error) {
        res.status(404).json({msg:error.message})
    }
})

module.exports = router