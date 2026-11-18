const express = require("express")
const productModel = require("../models/productModel")
const router = express.Router()

router.post("/", async (req, res) => {
    try {
        const { id } = req.body
        
        // Find and update the product quantity to 0
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            { 
                productQuantity: 0
            },
            { new: true } // Return the updated document
        )
        
        if (!updatedProduct) {
            return res.status(404).json({ msg: "Product not found" })
        }
        
        res.status(200).json({ 
            msg: "Product quantity updated successfully",
            product: updatedProduct 
        })
        
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

module.exports = router