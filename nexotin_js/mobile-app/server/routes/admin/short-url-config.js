const express = require("express");
const productModel = require("../../models/productModel");

const router = express.Router();

function generateShortId(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

router.post("/", async (req, res) => {
  try {

    // Fetch all products regardless of existing shortPath
    const products = await productModel.find();

    const BASE_URL = "https://www.nexotin.com/p";

    const ops = [];
    const generatedLinks = [];

    for (const product of products) {
      const short = generateShortId();
      const fullUrl = `${BASE_URL}/${short}`;

      ops.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { shortPath: fullUrl } }, // Store full URL
        },
      });

      generatedLinks.push({
        productId: product._id,
        shortUrl: fullUrl,
      });
    }

    if (ops.length > 0) {
      const result = await productModel.bulkWrite(ops);
      return res.status(200).json({
        message: "Full short URLs generated and updated",
        modifiedCount: result.modifiedCount,
        links: generatedLinks,
      });
    }

    res.status(200).json({ message: "No products found to update" });

  } catch (error) {
    console.error("Short URL config error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

module.exports = router;
