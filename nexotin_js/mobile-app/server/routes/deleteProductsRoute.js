const express = require("express")
const productModel = require("../models/productModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {productId} = req.body
        const deleteRes = await productModel.deleteOne({_id:productId})
        res.json({msg:true})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router