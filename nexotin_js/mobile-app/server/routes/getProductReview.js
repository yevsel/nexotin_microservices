const express = require("express")
const productReviewModel = require("../models/productReviewsModel")
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {data:productId}=req.body
        console.log("PR ID",productId)
        const response = await productReviewModel.find({productId}).sort({createdAt:-1})
        res.json({msg:response})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router