const express = require("express")
const expoTokenFreeModel = require("../models/expoTokenFreeModel")


const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const {expoToken,role} = req.body
        // Check existence
        const response = await expoTokenFreeModel.findOne({expoToken})
        if(response){
            return res.json({msg:"Already"})
        }
        else{
            const DBres = await expoTokenFreeModel.create({
                expoToken,
                role
            })
            return res.json({msg:"Done"})
        }
    } catch (error) {
        return res.json({msg:error.message})
    }
})

module.exports = router