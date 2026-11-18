const express = require("express")
const ordersModel = require("../models/ordersModel")
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {orderNumber,paymentStatus}=req.body
        const updateResponse = await ordersModel.updateMany({orderNumber},{$set:{paid:paymentStatus}})
        res.json({msg:updateResponse})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router