const express = require("express")
const router = express.Router()
const ordersModel = require("../../models/ordersModel")
const individualAccountModel = require("../../models/individualAccountModel")
const businessAccountModel = require("../../models/businessAccountModel")
const userModel = require("../../models/userModel")

const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}


router.get("/:id", async(req,res)=>{
    try {
        let dataToSend = {}
        const {id} = req.params
        const response = await ordersModel.findOne({_id:id})
        // Extract vendorId
        const vendorId = response.orders[0].accountOwnerID
        const accountType = response.orders[0].accountType
        const vendor = await accountTypeModels[accountType].findOne({_id:vendorId})
        // Extract buyerId
        const {buyerId} = response
        // Extract buyer information
        const buyer = await userModel.findOne({_id:buyerId})
        dataToSend.buyerInfo = buyer
        dataToSend.orderInfo = response
        dataToSend.vendorInfo = vendor
        res.json({msg:dataToSend})
    } catch (error) {
        res.json({msg:error})
    }
})

module.exports = router