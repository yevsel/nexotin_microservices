const userModel = require("../models/userModel")
const express = require("express")

const router = express.Router()

const grabImages = (emails)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let images = []
            for(let i=0;i<emails.length;i++){
                let image = await userModel.findOne({email:emails[i]}).select("profileImage")
                if(image.profileImage){
                    images.push(image)
                }else{
                    images.push(null)
                }
            }
            resolve(images)
        } catch (error) {
            reject(error)
        }
    })
}

router.post("/",async(req,res)=>{
    try {
        const {buyersEmails} = req.body
        const response = await grabImages(buyersEmails)
        res.json({msg:response})
    } catch (error) {
        res.json({msg:error.message})
    }
})

module.exports = router