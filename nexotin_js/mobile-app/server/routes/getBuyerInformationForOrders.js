const express = require("express")
const usersModels = require("../models/userModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret = process.env.LOGIN_SECRET

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1].trim()
        const info = jwt.verify(token,jwt_secret)
        // console.log("INFO",info)
        const response = await usersModels.findOne({_id:info.id})
        res.json({msg:response})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports=router