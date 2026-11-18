const express = require('express');
const ordersModel = require('../models/ordersModel');
const userModel = require('../models/userModel');
const productsModel = require("../models/productModel");
const individualModel = require("../models/individualAccountModel")
const businessModel = require("../models/businessAccountModel")

const router = express.Router();

router.get("/",async(req,res)=>{
    try {
        const orders = await ordersModel.countDocuments();
        const users = await userModel.countDocuments();
        const products = await productsModel.countDocuments();
        const processing = await ordersModel.countDocuments({orderStatus:2})
        const pending = await ordersModel.countDocuments({orderStatus:1})
        const completed = await ordersModel.countDocuments({orderStatus:3})
        const individual = await individualModel.countDocuments();
        const business = await businessModel.countDocuments();
        
        res.json({msg:{
            sales:orders,
            activeUsers:users + individual + business,
            products:products,
            totalOrders:orders,
            totalProcessingOrders:processing,
            totalPendingOrders:pending,
            totalCompletedOrders:completed
        }})
        // console.log("COUNT",orders)
    } catch (error) {
        console.log("ERROR",error)
    }
})

module.exports=router;
