const router = require("express").Router()
const businessAccountModel = require("../models/businessAccountModel")
const individualAccountModel = require("../models/individualAccountModel")


const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}
router.post("/",async(req,res)=>{
    try{
        const {details} = req.body
        console.log("Get vendor email",details)
        if(details[0].accountType==="business"){
            const data = await accountTypeModels[details[0].accountType].findOne({_id:details[0].accountOwnerID}).select("businessEmail shopName profileImage")
            res.json({msg:{
                email:data.businessEmail,
                name:data.shopName,
                profileImage:data.profileImage?data.profileImage.secure_url:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }})
        }else{
            const data = await accountTypeModels[details[0].accountType].findOne({_id:details[0].accountOwnerID}).select("email firstName lastName profileImage")
            res.json({msg:{
                email:data.email,
                name:data.firstName+" "+data.lastName,
                profileImage:data.profileImage?data.profileImage.secure_url:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }})
        }
    }catch(err){
        res.json({msg:err.message})
    }
})

module.exports = router