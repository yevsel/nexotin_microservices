const express = require("express");
const individualModel = require("../models/individualAccountModel");
const businessModel = require("../models/businessAccountModel");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { shortPath } = req.body;


    if (!shortPath) {
      return res.status(400).json({ error: "shortPath is required" });
    }

    // Try individual
    const individual = await individualModel.findOne({ shortPath });

    if (individual) {
      return res.json({
        redirectTo:`https://www.nexotin.com/vendor/${individual._id}`,
        // redirectTo: `https://www.nexotin.com/vendorProfile?vendorId=${individual._id}&accountType=individual&vendorEmail=${individual.email}`,
        name:individual.firstName + " " + individual.lastName,
        avatar: individual.profileImage?individual.profileImage.secure_url:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
      });
    }

    // Try business
    const business = await businessModel.findOne({ shortPath });

    if (business) {
      return res.json({
        redirectTo:`https://www.nexotin.com/vendor/${business._id}`,
        // redirectTo: `https://www.nexotin.com/vendorProfile?vendorId=${business._id}&accountType=business&vendorEmail=${business.businessEmail}`,
        name:business.shopName,
        avatar: business.profileImage?business.profileImage.secure_url:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
      });
    }

    return res.status(404).json({ error: "Account not found" });

  } catch (error) {
    console.error("Resolve account error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
