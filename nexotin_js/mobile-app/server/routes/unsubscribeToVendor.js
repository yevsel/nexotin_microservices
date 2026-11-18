const subscriptionModel = require("../models/subscriptionModel")
const express = require("express")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {
            vendorEmail,
            buyerEmail
        } = req.body
        // find first
        const findRes = await subscriptionModel.deleteOne({
            vendorEmail,buyerEmail
        }) 
        res.json({msg:true})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router