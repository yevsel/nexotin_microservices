const express = require("express")
const forgotPasswordModel = require("../models/forgotPasswordModel")

const router = express.Router()
const emailSender = require("../utils/emailSender")

router.post("/",async(req,res)=>{
    try { 
        const {
            userEmail,
        } = req.body
        function generateRandomNumbers() {
            return Math.floor(Math.random() * 90000) + 10000;
        }
        
        const shortCode = generateRandomNumbers()
        emailSender.sendForgotPassword(userEmail,shortCode)
        
        const dbResponse = await forgotPasswordModel.findOneAndUpdate(
            { userEmail: userEmail }, // Search query
            { userEmail: userEmail, shortCode: shortCode }, // Update or insert data
            { upsert: true, new: true } // Options: upsert (true) and return the new document (true)
        );
        res.json({msg:dbResponse})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router