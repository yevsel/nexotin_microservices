const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const userModel = require("../models/userModel")
const accountDeletionRequestModal = require("../models/accountDeletionRequestModal")
const jwt = require("jsonwebtoken")
const LOGIN_SECRET = process.env.LOGIN_SECRET


router.post("/",async(req,res)=>{
    try{
        const {email,password}=req.body
        // Find email
        const emailFindResponse = await userModel.findOne({email})
        // console.log("EMA",emailFindResponse)
        // Check if account deleted
        let accountDeletionRes;
        if(emailFindResponse!==null){
            accountDeletionRes = await accountDeletionRequestModal.findOne({id:emailFindResponse._id.toString()})
        }
        if(accountDeletionRes) return res.json({msg:"This account has been deleted."})
        // const emailFindResponseFromBusiness = await businessAccountModel.findOne({email})
        if(!emailFindResponse) return res.json({msg:"Wrong email"})
        // Check if password is right
        const {password:hashedPassword} = emailFindResponse
        // console.log(hashedPassword)
        const confirmPassword = await bcrypt.compare(password,hashedPassword)
        const {_id:id} = emailFindResponse
        if(!confirmPassword) return res.json({msg:"Wrong password"})
        const token = jwt.sign({id},LOGIN_SECRET,{
            expiresIn:"100y"
        })
        // console.log("TOKEN",token)
        const data={data:emailFindResponse,token}
        
        
        res.json({msg:data})
    }catch(error){
        res.json({msg:error.message})
    }
})

module.exports = router