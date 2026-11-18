const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET
const businessAccountModel = require("../models/businessAccountModel")
const individualAccountModel = require("../models/individualAccountModel")


const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const secret_info = jwt.verify(token,LOGIN_SECRET)
        
        const result = await accountTypeModels[secret_info.accountType].findOne({_id:secret_info.id}).select("shortPath")

        res.status(200).json({msg:result})
        
        
        
    } catch (error) {
        res.status(404).json({msg:error.message})
    }
})

module.exports = router