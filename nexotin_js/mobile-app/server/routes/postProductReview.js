const express = require("express")
const productReviewModel = require("../models/productReviewsModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {
            productId,
            vendorAccountId,
            vendorAccountType,
            buyerInformation,
            review,
        } = req.body
        const response = await productReviewModel.create({
            productId,
            vendorAccountId,
            vendorAccountType,
            buyerInformation,
            review,
            createdAt:Date.now()
        })
        res.json({msg:"Successful"})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router
