const express = require("express")
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")

const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {accountType,vendorId} = req.body
        const result = await accountTypeModels[accountType].findOne({_id:vendorId})
        res.json({msg:result})
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router