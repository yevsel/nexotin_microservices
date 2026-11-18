const express = require("express")
const subscriptionModel = require("../models/subscriptionModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {vendorEmail} = req.body
        const count = await  subscriptionModel.countDocuments({vendorEmail})
        res.json({msg:count})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router