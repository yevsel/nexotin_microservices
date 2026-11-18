const express = require("express")
const bcrypt = require("bcrypt")
const router = express.Router()
const individualModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const {vendorWelcomeTemplate} = require("../htmlTemplates/index")
const emailSender = require("../utils/emailSender")
const vendorPackagesModel = require("../models/vendorPackagesModel")
const moment = require("moment")

function generateShortId(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

router.post("/",async(req,res)=>{
    try {
        const {accountType} = req.body
        if(accountType==="individual"){
            
            const{firstName,lastName,password,phoneNumber,email,location,stockCycle}=req.body
            // Search if account does not exist
            const account = await individualModel.findOne({email,phoneNumber})
            if(account) return res.json({msg:"Account already exist"})
            // Send Email to verify
            const emailSenderResponse = await emailSender.sendWelcomeEmail(email,vendorWelcomeTemplate(lastName+" "+firstName),"Welcome Vendor🎊🎊")
            // console.log(emailSenderResponse)
            // if(!emailSenderResponse) return res.json({msg:"Please provide a valid email address"})
            // Hash password
            const salt = 13
            const hashedPassword = await bcrypt.hash(password.trim(),salt)
            const shortId = generateShortId(); // 6-character ID
            const shortPath = `https://www.nexotin.com/v/${shortId}`;
            
            const createdIndividualAccountResponse = await individualModel.create({
                firstName:firstName.trim(),
                lastName:lastName.trim(),
                password:hashedPassword,
                phoneNumber:phoneNumber.trim(),
                email:email.trim().toLowerCase(),
                location:location,
                stockCycle:stockCycle,
                shortPath,
                createdAt:Date.now()
            })
            if(createdIndividualAccountResponse) {
                const vendorPackageInsertResponse = await vendorPackagesModel.create({
                    createdAt:Date.now(),
                    expiresAt:new Date(moment().add(3,"M").toISOString()).getTime(),
                    vendorId:createdIndividualAccountResponse._id,
                    vendorAccountType:"individual",
                    packageType:{
                        id:1,
                        title:"Starter",
                        price:0,
                        period:"First 3 months",
                        description1:"Unlimited products",
                        description2:"unlimited videos",
                        paymentOptions:["3 Months"],
                    }
                })
                res.json({msg:"Account created successfully",data:{createdIndividualAccountResponse,accountType}})
            } 
            return res.json({msg:"Error creating account"})
        }else if(accountType==="business"){

            const {shopName,whatDoYouSell,businessPhoneNumber,businessEmail,stockCycle,momoAccountNumber,location,password} = req.body
            // Search if account exist
            const account = await businessAccountModel.findOne({businessEmail,businessPhoneNumber})
            // console.log(account)
            if(account) return res.json({msg:"Account already exist"})
            // Verify Email
            const emailSenderResponse = await emailSender.sendWelcomeEmail(businessEmail,vendorWelcomeTemplate(shopName),"Welcome Vendor🎊🎊")
            // if(!emailSenderResponse) return res.json({msg:"Please provide a valid email address"})
            // Password salt
            const salt = 13
            const hashedPassword = await bcrypt.hash(password.trim(),salt)
            const shortId = generateShortId(); // 6-character ID
            const shortPath = `https://www.nexotin.com/v/${shortId}`;
            const createBusinessAccountResponse = await businessAccountModel.create({
                shopName:shopName.trim(),
                whatDoYouSell:whatDoYouSell.trim(),
                password:hashedPassword,
                location,
                businessPhoneNumber:businessPhoneNumber.trim(),
                momoAccountNumber:momoAccountNumber.trim(),
                businessEmail:businessEmail.toLowerCase().trim(),
                stockCycle:stockCycle.trim(),
                shortPath,
                createdAt:Date.now()
            })
            if(createBusinessAccountResponse) {
                const vendorPackageInsertResponse = await vendorPackagesModel.create({
                    createdAt:Date.now(),
                    expiresAt:new Date(moment().add(3,"M").toISOString()).getTime(),
                    vendorId:createBusinessAccountResponse._id,
                    vendorAccountType:"business",
                    packageType:{
                        id:1,
                        title:"Starter",
                        price:0,
                        period:"First 3 months",
                        description1:"Unlimited products",
                        description2:"unlimited videos",
                        paymentOptions:["3 Months"],
                    }
                })
                res.json({msg:"Account created successfully",data:{createBusinessAccountResponse,accountType}})
            }
            return res.json({msg:"Error creating account"})
        }
    } catch (error) {
        return res.json({msg:error.message})
    }
})

module.exports = router