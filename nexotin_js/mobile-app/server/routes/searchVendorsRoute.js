const express = require("express")
const productModel = require("../models/productModel")
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")

const router = express.Router()


router.post("/",async(req,res)=>{
    try {
        let {name} = req.body
        let responseFromDB1 = await individualAccountModel.find(
        // {
        // 'name' : new RegExp(name, 'i')
        // }
        {
            $or: [
                { 'firstName': new RegExp(name, 'i') },
                { 'lastName': new RegExp(name, 'i') }
            ]
        }
        ).sort({createdAt:-1}).select("accountType firstName lastName profileImage").limit(10)
        
        let responseFromDB2 = await businessAccountModel.find(
        // {
        // 'name' : new RegExp(name, 'i')
        // }
        {
            $or: [
                { 'shopName': new RegExp(name, 'i') },
                // { 'lastName': new RegExp(name, 'i') }
            ]
        }
        ).sort({createdAt:-1}).select("accountType shopName profileImage").limit(10)
        res.json({msg:[...responseFromDB1,...responseFromDB2]})
    } catch (error) {
        res.json({msg:null})
    }
})

module.exports = router