const express = require('express');
const userModel = require('../models/userModel');

const router = express.Router();

router.get("/",async(req,res)=>{
    try {

        const users = await userModel.countDocuments();

        
        res.json({msg:{
            customer:users
        }})
        // console.log("COUNT",orders)
    } catch (error) {
        console.log("ERROR",error)
    }
})

module.exports=router;
