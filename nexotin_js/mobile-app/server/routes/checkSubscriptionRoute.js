const express = require("express")
const subscriptionModel = require("../models/subscriptionModel")

const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const {
            vendorEmail,
            buyerEmail
        } = req.body
        const findRes = await subscriptionModel.findOne({
            vendorEmail,
            buyerEmail
        })
        if (findRes) return res.json({
            msg: true
        })
        return res.json({
            msg: false
        })
    } catch (error) {
        res.json({
            msg: error.message
        })
    }
})

module.exports = router