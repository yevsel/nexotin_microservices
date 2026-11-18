const express = require("express")
// const io = require("../server")
const productModel = require("../models/productModel")
const router = express.Router()

router.post("/",async(req,res)=>{
    
    try {
        const {createdAt} = req.body
        if(Object.keys(req.body).includes("platform")){
            const response = await productModel.find({createdAt:{$lt:createdAt}}).sort({ createdAt: -1 }).limit(20)
            return res.json({msg:response})
        }
        const response = await productModel.find({createdAt:{$lt:createdAt}}).sort({ createdAt: -1 }).limit(10)
        return res.json({msg:response})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router