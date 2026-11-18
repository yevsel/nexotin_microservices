const express = require("express")
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {firstName,lastName,phoneNumber,password,email} = req.body
        
        // Check username
        // const usernameCheckResponse = await userModel.findOne({username})
        // if(usernameCheckResponse){
        //     return res.json({msg:"Username already exist"})
        // }
        // Check email
        const emailCheckResponse = await userModel.findOne({email})
        if(emailCheckResponse){
            return res.json({msg:"Email already exist"})
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password,13)
        
        const response = await userModel.create({
            firstName:firstName.trim(), 
            lastName:lastName.trim(),
            phoneNumber:phoneNumber.trim(),
            // gender,
            // username,
            password:hashedPassword,
            email:email.toLowerCase().trim(),
            // location, 
            createdAt:Date.now()
        })
        if(response){
            res.json({msg:true})
        }
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router