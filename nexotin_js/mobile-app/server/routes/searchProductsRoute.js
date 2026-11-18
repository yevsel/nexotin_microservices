const express = require("express")
const productModel = require("../models/productModel")
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        let {name} = req.body
        let responseFromDB = await productModel.find(
        {
            $or: [
                { 'name': new RegExp(name, 'i') },
                { 'productDescription': new RegExp(name, 'i') },
                { 'subCategory': new RegExp(name, 'i') },
                { 'brand': new RegExp(name,'i')}
            ]
        }
        ).sort({createdAt:-1}).select("images name colors price height").limit(30)
        res.json({msg:responseFromDB})
    } catch (error) {
        res.json({msg:null})
    }
})

module.exports = router