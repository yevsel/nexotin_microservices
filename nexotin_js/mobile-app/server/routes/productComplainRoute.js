const express = require("express")
const productComplainsModel = require("../models/productComplainsModel")

const router = express.Router()

router.post("/", async (req, res) =>{ 
    try {
        const {product_id,complain_text,complain_by,complain_to} = req.body
        const createRes = await productComplainsModel.create({
            product_id,
            complain_text,
            complain_by,
            complain_to,
            createdAt:Date.now()
        })
        res.json({msg:"Your complain was made successfully."})
    } catch (error) {
        res.json({msg:"Error"})
    }
})

module.exports = router