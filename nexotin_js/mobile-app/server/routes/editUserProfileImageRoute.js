const express = require("express")
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret=process.env.LOGIN_SECRET
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1].trim()
        // return res.json({msg:token})
        const {image} = req.body
        const info = jwt.verify(token,jwt_secret)
        const responseFromDB = await userModel.updateOne({_id:info.id},{profileImage:image})
        res.json({msg:responseFromDB})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router