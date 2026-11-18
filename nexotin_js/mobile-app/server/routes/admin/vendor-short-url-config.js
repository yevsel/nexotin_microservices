const express = require("express");
const individualModel = require("../../models/individualAccountModel");
const businessModel = require("../../models/businessAccountModel")
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
    const BASE_URL = "https://www.nexotin.com/v";

    // Find accounts without a shortId
    const accounts = await businessModel.find();

    const ops = [];

    for (const account of accounts) {
      const newShortId = generateShortId(); // customize length as needed
      const shortPath = `${BASE_URL}/${newShortId}`;

      ops.push({
        updateOne: {
          filter: { _id: account._id },
          update: {
            $set: {
              shortPath: shortPath,
            },
          },
        },
      });
    }

    if (ops.length > 0) {
      const result = await businessModel.bulkWrite(ops);
      return res.status(200).json({
        message: "shortId and shortPath added to all relevant accounts",
        modifiedCount: result.modifiedCount,
      });
    }

    return res.status(200).json({ message: "All accounts already have shortId" });

  } catch (error) {
    console.error("Error adding shortIds and shortPaths:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
