const express = require("express")
const productModel = require("../../models/productModel")
const individualAccountModel = require("../../models/individualAccountModel")
const businessAccountModel = require("../../models/businessAccountModel")
const router = express.Router()

const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}

router.post("/",async(req,res)=>{
    try {
        const {vendorId,accountType,createdAt} = req.body
    } catch (error) {
        console.log("ERROR",error)
    }
})

module.exports = router
