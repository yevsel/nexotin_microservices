const express = require("express")
const productModel = require("../models/productModel")
const router = express.Router()


router.post("/",async(req,res)=>{
    try {
        const {categoryName,specificCategory,createdAt,from,to,gender} = req.body
        
        // 
        
        let responseFromDB=[]
        if(specificCategory===null){
            if (gender && from && to){
                responseFromDB = await productModel
                .find({createdAt:{$lt:createdAt},mainCategory:categoryName,gender,price:{$gt:from,$lt:to}})
                .sort({ createdAt: -1 })
                .select("images name price colors unisex height gender createdAt selectedSizes productQuantity")
                .limit(15)
            }
            else if (gender===null && from===null && to===null){
                responseFromDB = await productModel
                .find({createdAt:{$lt:createdAt},mainCategory:categoryName})
                .sort({ createdAt: -1 })
                .select("images name price colors unisex height gender createdAt selectedSizes productQuantity")
                .limit(15)
            }
            else if(gender && from===null && to===null){
                responseFromDB = await productModel
                .find({
                    createdAt: { $lt: createdAt },
                    mainCategory: categoryName,
                    gender: gender, // Replace 'specificGenderValue' with the actual value or variable
                })
                .sort({ createdAt: -1 })
                .select("images name price colors unisex height gender createdAt selectedSizes productQuantity")
                .limit(15)
            }else if(from && to){
                responseFromDB = await productModel
                .find({createdAt:{$lt:createdAt},mainCategory:categoryName,price:{$gt:from,$lt:to}})
                .sort({ createdAt: -1 })
                .select("images name price colors unisex height gender createdAt selectedSizes productQuantity")
                .limit(15)
            }
        }
        else{
            if (gender && from && to){
                responseFromDB = await productModel
                .find({createdAt:{$lt:createdAt},mainCategory:categoryName,subCategory:specificCategory,gender,price:{$gt:from,$lt:to}})
                .sort({ createdAt: -1 })
                .select("images name price colors unisex height gender createdAt selectedSizes productQuantity")
                .limit(15) 
            } 
            else if (gender===null && from===null && to===null){
                responseFromDB = await productModel
                .find({createdAt:{$lt:createdAt},mainCategory:categoryName,subCategory:specificCategory})
                .sort({ createdAt: -1 })
                .select("images name price colors unisex height gender createdAt selectedSizes productQuantity")
                .limit(15)
            }
            if(gender && from===null && to===null){
                responseFromDB = await productModel
                .find({createdAt:{$lt:createdAt},mainCategory:categoryName,subCategory:specificCategory,gender})
                .sort({ createdAt: -1 })
                .select("images name price colors unisex height gender createdAt selectedSizes productQuantity")
                .limit(15)
            }else if(from && to){
                responseFromDB = await productModel
                .find({createdAt:{$lt:createdAt},mainCategory:categoryName,subCategory:specificCategory,price:{$gt:from,$lt:to}})
                .sort({ createdAt: -1 })
                .select("images name price colors unisex height gender createdAt selectedSizes productQuantity")
                .limit(15)
            }
        }
        res.json({msg:responseFromDB})
    } catch (error) {
        console.log("ERROR",error.message)
        res.json({msg:[]})
    }
})

module.exports = router   