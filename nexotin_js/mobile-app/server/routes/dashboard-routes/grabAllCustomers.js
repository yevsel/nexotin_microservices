const express = require('express');
const userModel = require("../../models/userModel")

const router = express.Router();

router.post("/",async(req,res)=>{
    try {
        const {createdAt} = req.body
        let result
        result = await userModel.find({ createdAt: { $lt: createdAt } }).sort({ createdAt: -1 }).limit(20);
        res.json({msg:result})
    } catch (error) {
        console.log("ERROR",error)
        res.json({msg:[]})
    }
})

module.exports = router