const express = require("express");
const productModel = require("../models/productModel");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {subCategory} = req.body;
        
        const responseFromDB = await productModel.aggregate([
            { $match: { subCategory: subCategory } },
            { $sample: { size: 10 } }
        ]);

        return res.json({ msg: responseFromDB });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = router;
