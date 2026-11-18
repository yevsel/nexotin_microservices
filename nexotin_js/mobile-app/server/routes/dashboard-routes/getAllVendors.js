const express = require("express")
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
        const {createdAt,accountType} = req.body
        // console.log("CREATEDAT",accountType)
        // const result = await accountTypeModels[accountType].find({ createdAt: { $lt: createdAt } }).sort({ createdAt: -1 }).limit(5);
        const result = await accountTypeModels[accountType].find({ createdAt: { $lt: createdAt } }).sort({ createdAt: -1 }).limit(20);
        res.json({msg:result})
    } catch (error) {
        console.log("ERROR",error)
    }
})

module.exports = router