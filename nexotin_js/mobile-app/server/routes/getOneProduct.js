const express = require("express")
const productModel = require("../models/productModel")
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
// const productModel = require("../models/productModel")

const router = express.Router()

const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}

router.get("/:id",async(req,res)=>{
    try {
        const id = req.params.id
        const response = await productModel.findOne({_id:id}).lean()
        if(response){ 
            const vendorResponse = await accountTypeModels[response.accountType].findOne({_id:response.accountOwnerID})
            res.status(200).json({ msg: { ...response, vendorInfo: vendorResponse } });
        }else{
            res.status(404).json({msg:null})
        }
    } catch (error) {
        console.log(error.message)
        res.status(404).json({msg:error.message})
    }
})

module.exports=router