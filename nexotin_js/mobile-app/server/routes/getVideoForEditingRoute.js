const express = require("express")
const videoModel = require("../models/videoModel")
// const productModel = require("../models/productModel")
const router = express.Router()

router.post("/",async(req,res)=>{
    try{
        const {id} = req.body
        // res.json({msg:id})
        const response = await videoModel.findOne({_id:id})
        res.json({msg:response})
    }catch(err){
        res.json({msg:null})
    }
})


module.exports = router