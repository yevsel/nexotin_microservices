const express = require("express")
const vendorPackagesModel = require("../models/vendorPackagesModel")
const jwt = require("jsonwebtoken")

require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const secret_info = jwt.verify(token,LOGIN_SECRET)
        const response = await vendorPackagesModel
            .findOne({vendorId:secret_info.id,
            vendorAccountType:secret_info.accountType})
        res.json({msg:response})
    } catch (error) {
        res.json({msg:error.message})
    } 
})

module.exports = router