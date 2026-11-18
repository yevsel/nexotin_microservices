const router = require("express").Router(); 
const videoModel = require("../models/videoModel");
// const jwt = require("jsonwebtoken")
// require("dotenv").config()
// const jwt_secret = process.env.LOGIN_SECRET

router.post("/", async (req, res) =>{
    try {
        const {videoId} = req.body
        const response = await videoModel.deleteOne({_id:videoId})
        res.json({msg:response})
    } catch (error) {
        console.log("error",error)
    }
})

module.exports = router