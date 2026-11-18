const express = require("express")
const ordersModel = require("../../models/ordersModel")
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        let {orderNumber} = req.body
        // let responseFromDB = await productModel.find({'orderNumber' : new RegExp(orderNumber, 'i')}).sort({createdAt:-1}).select("images orderNumber price").limit(10)
        let responseFromDB = await ordersModel.find({'orderNumber' : new RegExp(orderNumber, 'i')}).sort({createdAt:-1}).limit(10)
        res.json({msg:responseFromDB})
    } catch (error) {
        res.json({msg:null})
    }
})

module.exports = router
