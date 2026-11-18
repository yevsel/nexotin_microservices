const express = require("express");
const router = express.Router();
const businessAccountModel = require("../models/businessAccountModel");
const individualAccountModel = require("../models/individualAccountModel");

const accountTypeModels = {
  individual: individualAccountModel,
  business: businessAccountModel,
};

router.post("/", async (req, res) => {
  try {
    const { details } = req.body;

    if (!Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ msg: "Invalid or empty details array" });
    }

    const fetchAll = await Promise.all(
      details.map(({ vendorId, accountType }) =>
        accountTypeModels[accountType]?.findOne({ _id: vendorId }).lean()
      )
    );

    res.status(200).json({ msg: fetchAll });
  } catch (error) {
    console.error("Error in /get-vendor-of-products:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
