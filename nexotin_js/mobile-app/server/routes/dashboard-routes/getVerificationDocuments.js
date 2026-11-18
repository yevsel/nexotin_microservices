const express = require("express")
const verificationDocumentUploadModel = require("../../models/verificationDocumentUploadModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {vendorId,accountType} = req.body
        // console.log("VENDOR ID",vendorId)
        const response = await verificationDocumentUploadModel.findOne({vendorId,accountType})
        res.json({msg:response})
    } catch (error) {
        console.log("ERR",error.message)
    }
})

module.exports = router