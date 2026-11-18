const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret = process.env.LOGIN_SECRET
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const cloudinary = require("../utils/cloudinary")
const accountTypeModels = 
{
    "individual":individualAccountModel, 
    "business":businessAccountModel
}

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1].trim()
        const {image} = req.body 
        // const {secure_url} = await cloudinary.uploader.upload(image,{upload_preset:"profile_images"})
        const info = jwt.verify(token,jwt_secret)
        const responseFromDB = await accountTypeModels[info.accountType].updateOne({_id:info.id},{bannerImage:image})
        // res.json({msg:responseFromDB})
        res.json({msg:responseFromDB})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router