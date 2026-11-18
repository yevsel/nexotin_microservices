const express = require("express")
const ordersModel = require("../models/ordersModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {id,stage} = req.body
        const response = await ordersModel.updateOne({_id:id},{$set:{
            orderStatus:stage==="processing"?2:3
        }})
        res.json({msg:true})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router