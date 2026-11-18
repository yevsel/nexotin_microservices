const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const individualModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const jwt = require("jsonwebtoken")
const accountDeletionRequestModalVendor = require("../models/accountDeletionRequestModalVendor")

const LOGIN_SECRET = process.env.LOGIN_SECRET
router.post("/",async(req,res)=>{
    try{
        const {email,password}=req.body
        // Find email
        const emailFindResponseFromIndividual = await individualModel.findOne({email:email.toLowerCase().trim()})
        
        const emailFindResponseFromBusiness = await businessAccountModel.findOne({businessEmail:email.toLowerCase().trim()})
        // const emailFindResponseFromBusiness = await businessAccountModel.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') } });
        
        if(emailFindResponseFromIndividual!==null){
            
            // Check if the user has deleted their account
            const accountDeletionRes = await accountDeletionRequestModalVendor.findOne({id:emailFindResponseFromIndividual._id.toString()})
            if(accountDeletionRes) return res.json({msg:"This account has been deleted."})
            // Check if password is right
            const {password:hashedPassword} = emailFindResponseFromIndividual
            
            const confirmPassword = await bcrypt.compare(password,hashedPassword)
            
            const {_id:id,accountType} = emailFindResponseFromIndividual
            if(!confirmPassword) return res.json({msg:"Wrong password"})
            const token = jwt.sign({id,accountType},LOGIN_SECRET,{
                expiresIn:"100y"
            })
            
            const data={data:emailFindResponseFromIndividual,token}
            return res.json({msg:data})
        } else if(emailFindResponseFromBusiness!==null){
            
            // Check if account deleted
            const accountDeletionRes = await accountDeletionRequestModalVendor.findOne({id:emailFindResponseFromBusiness._id.toString()})
            if(accountDeletionRes) return res.json({msg:"This account has been deleted."})
            // Check if password is right
            // const {password:hashedPassword} = emailFindResponseFromBusiness
            
            
            const confirmPassword = await bcrypt.compare(password,emailFindResponseFromBusiness.password)
            
            const {_id:id,accountType} = emailFindResponseFromBusiness
            if(!confirmPassword) return res.json({msg:"Wrong password"})
            const token = jwt.sign({id,accountType},LOGIN_SECRET,{
                expiresIn:"100y"
            })
            
            const data={data:emailFindResponseFromBusiness,token}
            return res.json({msg:data})
        }
        else{
            return res.json({msg:"Please check credentials and remove white spaces"})
        }
    }catch(error){
        res.json({msg:`Error logging into account ${error.message}`})
    }
})

module.exports = router