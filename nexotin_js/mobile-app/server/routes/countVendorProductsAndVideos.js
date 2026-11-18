const express = require("express")

const productModel = require("../models/productModel")
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const videoModel = require("../models/videoModel")
// const jwt = require("jsonwebtoken")
require("dotenv").config()
// const LOGIN_SECRET = process.env.LOGIN_SECRET
const router = express.Router()



router.post("/",async(req,res)=>{
    
    try {
        const {vendorId} = req.body
        const productCount = await productModel.countDocuments({ accountOwnerID: vendorId });
        const videoCount = await videoModel.countDocuments({vendorId})
        res.json({msg:{productCount,videoCount}})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports=router