const express = require("express")
const productModel = require("../models/productModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const newArrivalsData = await productModel.find().limit(10)
        res.status(200).json({msg:newArrivalsData})
    } catch (error) {
        res.status(404).json({msg:error.message})
    }
})

module.exports = router
