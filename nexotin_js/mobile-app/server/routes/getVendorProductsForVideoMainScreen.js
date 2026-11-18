const express = require("express")

const productModel = require("../models/productModel")
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET
const router = express.Router()

const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}


router.post("/",async(req,res)=>{
    
    try {
        const {vendorId,accountType,createdAt} = req.body
        // const dataFromDatabase = await productModel.find({accountOwnerID:vendorId}).sort({ createdAt: -1 }).limit(10)
        // const {createdAt} = req.body
        const dataFromDatabase = await productModel.find({accountOwnerID:vendorId,createdAt:{$lt:createdAt}}).sort({ createdAt: -1 }).limit(10)
        res.json({msg:dataFromDatabase})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports=router