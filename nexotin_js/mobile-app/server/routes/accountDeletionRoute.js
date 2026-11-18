const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_secret = process.env.LOGIN_SECRET
const bcrypt = require("bcrypt")
const userModel = require("../models/userModel")
const accountDeletionRequestModal = require("../models/accountDeletionRequestModal")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {password,token} = req.body
        const info = jwt.verify(token,jwt_secret)
        const user = await userModel.findOne({_id:info.id})
        const userPassword = user.password
        // Verify password
        const passwordVerificationStatus = await bcrypt.compare(password,userPassword)
        if(passwordVerificationStatus){
            const createRes = await accountDeletionRequestModal.create({
                id:info.id,
                createdAt:Date.now()
            })
            // console.log("INFO",createRes)
            return res.json({msg:"Your request was made successfully, your account should be deleted in any moment."})
        }else{
            return res.json({msg:"Wrong password"})
        }
    } catch (error) {
        
    }
})

module.exports = router