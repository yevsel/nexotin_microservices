const ordersModel = require("../../models/ordersModel")
const express = require("express")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {createdAt,fetchNew,fetchOld} = req.body
        if (fetchNew) {
            const orders = await ordersModel.find({ createdAt: { $gt: createdAt } }).sort({ createdAt: -1 }).limit(5);
            return res.json({msg:orders})
        }else if (fetchOld){
            const orders = await ordersModel.find({ createdAt: { $lt: createdAt } }).sort({ createdAt: -1 }).limit(5);
            return res.json({msg:orders})
        }else{
            const orders = await ordersModel.find().sort({createdAt:-1}).limit(5)
            return res.json({msg:orders})
        }
    } catch (error) {
        res.json({msg:error})
    }
})

module.exports = router