const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { distanceInKM } = req.body;
    console.log("Distance",distanceInKM)
    let price = 0;
 
    if (distanceInKM < 13) {
      price = 37;
    } else if (distanceInKM >= 13 && distanceInKM < 18) {
      price = 47;
    } else if (distanceInKM >= 18 && distanceInKM < 26) {
      price = 58;
    } else if (distanceInKM >= 26 && distanceInKM < 36) {
      price = 68;
    } else if (distanceInKM >= 36 && distanceInKM < 46) {
      price = 78;
    } else if (distanceInKM >= 46 && distanceInKM < 50) {
      price = 88;
    } else if (distanceInKM >= 50 && distanceInKM < 100) {
      price = 70;
    } else if (distanceInKM >= 100 && distanceInKM < 400) {
      price = 80;
    } else if (distanceInKM >= 400) {
      price = 120;
    }
    console.log("Price",price)
    return res.json({ deliveryFee:price });
  } catch (error) {
    console.log("Delivery price error", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
