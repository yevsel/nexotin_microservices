const express = require("express")
const expoNotificationTokenModel = require("../models/expoNotificationTokensModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const secret_info = jwt.verify(token,LOGIN_SECRET)
        // Check if token is already in
        const response = await expoNotificationTokenModel.find({ownerId:secret_info.id})
        res.json({msg:response})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router