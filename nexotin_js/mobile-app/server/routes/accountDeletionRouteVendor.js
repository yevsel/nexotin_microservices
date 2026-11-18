const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret = process.env.LOGIN_SECRET
const bcrypt = require("bcrypt")
const userModel = require("../models/userModel")
const accountDeletionRequestModelVendor = require("../models/accountDeletionRequestModalVendor")
// const accountDeletionRequestModal = require("../models/accountDeletionRequestModal")
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
        const {password,token} = req.body
        const info = jwt.verify(token,jwt_secret)
        const user  = await accountTypeModels[info.accountType].findOne({_id:info.id})
        // const user = await userModel.findOne({_id:info.id})
        const userPassword = user.password
        // Verify password
        const passwordVerificationStatus = await bcrypt.compare(password,userPassword)
        if(passwordVerificationStatus){
            const createRes = await accountDeletionRequestModelVendor.create({
                id:info.id,
                accountType:info.accountType,
                createdAt:Date.now()
            })
            // console.log("INFO",createRes)
            return res.json({msg:"Your request was made successfully, your account should be deleted in any moment."})
        }else{
            return res.json({msg:"Wrong password"})
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router