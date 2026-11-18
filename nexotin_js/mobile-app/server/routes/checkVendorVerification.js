const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret = process.env.LOGIN_SECRET
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const accountTypeModels = 
{
    "individual":individualAccountModel, 
    "business":businessAccountModel
}

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1].trim()
        const info = jwt.verify(token,jwt_secret)
        const response  = await accountTypeModels[info.accountType].findOne({_id:info.id}).select("verified")
        res.json({msg:response})
    } catch (error) {
        res.json({msg:false})
    }
})

module.exports = router