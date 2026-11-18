const individualAccountModel = require("../models/individualAccountModel")
const bcrypt = require("bcrypt")
const router = require("express").Router()
const businessAccountModel = require("../models/businessAccountModel")
router.post("/",async(req,res)=>{
    try {
        // console.log()
        // console
        
        
        
        const newPasswordHash= await bcrypt.hash("Daily1234@",13)
        const person = await businessAccountModel.updateOne(
            {businessEmail: "gilliangat240@gmail.com" },  // Find document by email
            { $set: { password: newPasswordHash } } // Use $set to update the password
          );
        bcrypt.compare("Daily1234@",newPasswordHash).then(t=>{
            console.log("COMPARE",t)
        }).catch(error=>console.log("ERROR",error))
        // console.log("NEW PASSWORD",newPasswordHash)
        
        res.json({msg:person})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports=router;
