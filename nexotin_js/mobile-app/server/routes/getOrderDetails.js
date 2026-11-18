const express = require("express")

const router = express.Router()


router.post("/",async(req,res)=>{
    try {
        const{
            buyerJWTToken,
            
        } = req.body
    } catch (error) {
        
    }
})

module.exports=router