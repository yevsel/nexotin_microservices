const express = require("express")
const userModel = require("../models/userModel")
const accountDeletionRequestModal = require("../models/accountDeletionRequestModal")
const jwt = require("jsonwebtoken")
const LOGIN_SECRET = process.env.LOGIN_SECRET


const router = express.Router()


router.post("/",async(req,res)=>{
    try {
        const {email,given_name,family_name,picture} = req.body
        
        // Check if email is already in Database
        const checkResponse = await userModel.findOne({email})
        if(checkResponse) return res.json({msg:"Account already exist"})
        
        console.log(email,given_name,family_name,picture)
        const response = await userModel.create({
            firstName:given_name.trim(), 
            lastName:family_name.trim(),
            profileImage:{
                secure_url:picture
            },
            email:email.toLowerCase().trim(),
            createdAt:Date.now()
        })
        
        // Send token
        const token = jwt.sign({id},LOGIN_SECRET,{
            expiresIn:"100y"
        })
        
        const data={data:response,token}
        
        return res.json({msg:data})
        
    } catch (error) {
        res.json({msg:"Error"})
    }
})

module.exports = router