const express = require("express")
const verificationDocumentUploadModel = require("../models/verificationDocumentUploadModel")
// const v = require("../models/verificationDocumentUploadModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const router = express.Router()

const accountTypeModels = 
{
    "individual":individualAccountModel, 
    "business":businessAccountModel
}
router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const secret_info = jwt.verify(token,LOGIN_SECRET)
        const {registered,images} = req.body
        
        if(!registered){
            const response = await verificationDocumentUploadModel.create({
                vendorId:secret_info.id,
                accountType:secret_info.accountType,
                createdAt:Date.now(),
                isCompanyRegistered:false,
                selfieImage1:images[0],
                selfieImage2:images[1],
                idCardImage1:images[2],
                idCardImage2:images[3]
            })
        }else{
            const response = await verificationDocumentUploadModel.create({
                vendorId:secret_info.id,
                accountType:secret_info.accountType,
                createdAt:Date.now(),
                isCompanyRegistered:true,
                selfieImage1:images[0],
                selfieImage2:images[1],
                idCardImage1:images[2],
                idCardImage2:images[3],
                certificateOfRegistrationImage:images[4],
                form3Image:images[5]
            })
        }
        // update verification status
        // const response = await accountTypeModels[secret_info.accountType].updateOne({_id:secret_info.id},
        // {verified:true})
        
        res.json({msg:true})
    } catch (error) {
        res.json({msg:false})
        // console.log(error)
    }
})

module.exports = router