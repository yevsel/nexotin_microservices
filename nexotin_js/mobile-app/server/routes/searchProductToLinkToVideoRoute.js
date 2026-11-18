const express = require("express")
const individualAccountModel=require("../models/individualAccountModel")
const businessAccountModel=require("../models/businessAccountModel")
const productModel = require("../models/productModel")
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
        const {token,accountType,productName} = req.body
        const secret_info = jwt.verify(token,LOGIN_SECRET)
        const result = await productModel.find({accountOwnerID:secret_info.id,'name' : new RegExp(productName, 'i')}).sort({createdAt:-1}).select("images name price").limit(10)
        res.json({msg:result})
    } catch (error) {
        res.json({msg:"Error searching"})
    }
})

module.exports = router