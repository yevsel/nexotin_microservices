const express = require("express")
const ordersModel = require("../models/ordersModel")
const router = express.Router()
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret = process.env.LOGIN_SECRET

router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1].trim()
        const secret_info = jwt.verify(token,jwt_secret)
        const response = await ordersModel.find({buyerId:secret_info.id}).sort({ createdAt: -1 })
        res.json({msg:response})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router