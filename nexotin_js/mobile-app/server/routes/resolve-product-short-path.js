const express = require("express");
const productModel = require("../models/productModel");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { shortPath } = req.body;

    if (!shortPath) {
      return res.status(400).json({ error: "shortPath is required" });
    }

    const dbResult = await productModel.findOne({ shortPath });

    if (!dbResult) {
      return res.status(404).json({ error: "Short path not found" });
    }

    // Return detailed product information
    return res.json({
      redirectTo: `https://www.nexotin.com/shop/products/${dbResult._id}`,
      name: dbResult.name || '',
      productDescription: dbResult.description || '',
      imageUrl: dbResult.images[0].secure_url || [],
      brand: dbResult.brand || '',
      price: dbResult.price || 0,
      currency: dbResult.currency || 'GHS',
      availability: dbResult.availability || 'in stock',
      condition: dbResult.condition || 'new',
    });

  } catch (error) {
    console.error("Error resolving short path:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;