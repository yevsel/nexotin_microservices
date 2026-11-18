const express = require("express")
const productModel = require("../models/productModel")

const router = express.Router()

router.get("/",async(req,res)=>{
    try {
        // const response = await productModel.aggregate([{$sample:{size:10}}])
        const men = await productModel
        .aggregate([{$match:{gender:"men"}},{$sample:{size:10}}])
        const women = await productModel
        .aggregate([{$match:{gender:"women"}},{$sample:{size:10}}])

        res.json({msg:[...men,...women]})
        
    } catch (error) {
        console.log("Error",error)
    }
})

module.exports=router