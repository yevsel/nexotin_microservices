const express = require("express")
const expoNotificationTokenModel = require("../models/expoNotificationTokensModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET

const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        // console.log("SAVE ROUTE HIT")
        const {expoToken,role}= req.body
        // console.log("EXP",expoToken,role)
        const token = req.headers.authorization.split(" ")[1]
        const secret_info = jwt.verify(token,LOGIN_SECRET)
        // Check if token is already in
        const responseFromDB = await expoNotificationTokenModel.findOne({ownerId:secret_info.id,role})
        // console.log("RESPONSE",responseFromDB)
        if(responseFromDB) return res.json({msg:"Owner id here ++"})
        // return
        // Else create
        const creationResult = await expoNotificationTokenModel.create({
            expoToken:expoToken,
            ownerId:secret_info.id,
            role
        })
        res.json({msg:"Expo token added"})
    } catch (error) {
        console.log(error)
        res.json({msg:error.message})
    }
})

module.exports = router