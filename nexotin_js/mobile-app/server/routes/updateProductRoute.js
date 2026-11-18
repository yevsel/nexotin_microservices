const express = require("express")
const productModel = require("../models/productModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET
const router = express.Router()
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")

const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}

router.post("/",async(req,res)=>{
    try {
        // return res.json({msg:req.body})
        
        const token = req.headers.authorization.split(" ")[1]
        const secret_info = jwt.verify(token,LOGIN_SECRET)
        const {
                id,
                images,
                name,
                price,
                gender,
                mainCategory,
                subCategory,
                productType,
                colors,
                productDescription,
                productQuantity,
                selectedSizes,
                brand,
                condition,
                } = req.body.data
        
        // Fetch original product from database
        const initialProduct = await productModel.findOne({_id:id})
        
        const updateResponse = await productModel.updateOne({_id:id},{$set:{
            name: name || initialProduct.name,
            price: price || initialProduct.price,
            gender: gender || initialProduct.gender,
            mainCategory: mainCategory || initialProduct.mainCategory,
            subCategory: subCategory || initialProduct.subCategory,
            productType: productType || initialProduct.productType,
            colors: colors || initialProduct.colors,
            selectedSizes: selectedSizes,
            productDescription: productDescription || initialProduct.productDescription,
            productQuantity: productQuantity || initialProduct.productQuantity,
            brand: brand || initialProduct.brand,
            condition : condition || initialProduct.condition,
            createdAt:Date.now()
        }})
        if(updateResponse){res.json({msg:true})}

    } catch (error) {
        console.log(error.message)
        res.json({msg:error.message})
    }
})

module.exports = router