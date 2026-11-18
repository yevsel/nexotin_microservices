const express = require("express")
const productModel = require("../models/productModel")
// const random = require('mongoose-random');
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {mainCategory} = req.body
        const responseFromDB = await productModel
        .aggregate([{$match:{mainCategory:mainCategory}},{$sample:{size:6}}])
        res.json({msg:responseFromDB})
    } catch (error) {
        // console.log(error.message)
        res.json({msg:error.message})
    }
})

module.exports = router