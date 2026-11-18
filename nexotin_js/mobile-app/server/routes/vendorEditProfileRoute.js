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

    const token = req.headers.authorization.split(" ")[1].trim()
    const info = jwt.verify(token,jwt_secret)

    const {accountType} = req.body

    try {
        if(accountType==="individual"){
            
            const{
                firstName,
                lastName,
                phoneNumber,
                email,
                location,
                stockCycle}=req.body
            
            const createdIndividualAccountResponse = await individualAccountModel.updateOne({_id:info.id},{
                $set:{
                firstName:firstName.trim(),
                lastName:lastName.trim(),
                phoneNumber:phoneNumber.trim(),
                location:location,
                stockCycle:stockCycle
                }
            })
            
            return res.json({msg:createdIndividualAccountResponse}) 
        }else if(accountType==="business"){
            const {
                shopName,
                whatDoYouSell,
                phoneNumber,
                businessEmail,
                stockCycle,
                momoAccountNumber,
                location} = req.body
            
            const createBusinessAccountResponse = await businessAccountModel.updateOne({_id:info.id},{
                $set:{
                shopName:shopName.trim(),
                whatDoYouSell:whatDoYouSell.trim(),
                location,
                businessPhoneNumber:phoneNumber.trim(),
                stockCycle:stockCycle.trim()
                }
            })
            return res.json({msg:createBusinessAccountResponse})
        }
    } catch (error) {
        return res.json({msg:error.message})
        
    }
})

module.exports = router