const express = require("express")
const individualAccountModel = require("../../models/individualAccountModel")
const businessAccountModel = require("../../models/businessAccountModel")

const accountTypeModels = {
    "individual":individualAccountModel,
    "business":businessAccountModel
}

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {vendorId,accountType,state}  = req.body
        const response = await accountTypeModels[accountType].updateOne({_id:vendorId},{verified:state})
        res.json({msg:response})
    } catch (error) {
        console.log("ERROR",error)
    }
})

module.exports = router