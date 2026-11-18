const express = require("express")
const productModel = require("../models/productModel")
const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const { categoryName, specificCategory, gender } = req.body
    
    // Build query dynamically
    const query = {}
    
    if (categoryName) {
      query.mainCategory = categoryName
    }
    
    if (specificCategory) {
      query.subCategory = specificCategory
    }
    
    if (gender) {
      query.gender = gender
    }
    
    
    const responseFromDB = await productModel.aggregate([
      { $match: query },
      { $sample: { size: 15 } },
      { 
        $project: {
          images: 1,
          name: 1,
          price: 1,
          colors: 1,
          unisex: 1,
          height: 1,
          gender: 1,
          createdAt: 1,
          selectedSizes: 1,
          productQuantity: 1
        }
      }
    ])
    
    res.json({ msg: responseFromDB })
  } catch (error) {
    console.log("ERROR", error.message)
    res.status(500).json({ msg: [], error: "Failed to fetch products" })
  }
})

module.exports = router