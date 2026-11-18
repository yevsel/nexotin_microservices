const express = require("express")
const forgotPasswordModel = require("../models/forgotPasswordModel")
const bcrypt = require("bcrypt")
const userModel = require("../models/userModel")

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {userEmail,shortCode,newPassword} = req.body
        const dbResponse = await forgotPasswordModel.findOne({userEmail,shortCode})
        if(!dbResponse) return res.json({msg:"Wrong code. Try again"})
        // console.log("FIND",dbResponse)
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword,13)
        // console.log("HASHED PASSWORD",hashedPassword)
        // Update account
        const updateResponse = await userModel.findOneAndUpdate(
            { email: userEmail }, // Find by userEmail
            { $set: { password: hashedPassword } }, // Set new hashed password
            { new: true } // Return updated document
        );
        // console.log("updateRepsone",updateResponse)
        res.json({msg:"Done"})
    } catch (error) {
        // console.log("")
        res.json({msg:error.message})
    }
})

module.exports = router