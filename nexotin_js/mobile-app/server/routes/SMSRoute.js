const twillio = require("twilio")
const express = require("express")
require("dotenv").config()


const twillio_client = twillio(process.env.YEVSEL_TWILLIO_SID,process.env.YEVSEL_TWILLIO_AUTH_TOKEN)
const router = express.Router()

router.post("/",async(req,res)=>{
    try {
        const sms_res = await twillio_client.messages
            .create({
                body: 'Hello from Node',
                to: '+233245026682',
                from: '+233249523573',})
            console.log("SMS RES",sms_res)
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = router