const express = require("express")
const ordersModel = require("../models/ordersModel")
const router = express.Router()


router.post("/",async(req,res)=>{
    try {
        const {vendorEmail,createdAt} = req.body
        const response = await ordersModel.
        find({vendorEmail,createdAt:{$lt:createdAt}}).
        sort({ createdAt: -1 }).
        limit(7)
        res.json({msg:response})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router