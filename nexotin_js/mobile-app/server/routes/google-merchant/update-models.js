const productModel = require("../../models/productModel");
const router = require("express").Router();

router.post("/", async (req, res) => {
    try {
        const update = await productModel.updateMany(
            {}, // Empty filter means update all products
            {
                $set: {
                    offerId: null, 
                    link: null, 
                    imageLink: null, 
                    availability: "in stock",
                    contentLanguage: "en",
                    targetCountry: "GH",  // ✅ Ghana
                    currency: "GHS"       // ✅ Ghanaian Cedis
                }
            }
        );
        console.log("Update",update)
        res.json({ message: `✅ Updated ${update.modifiedCount} products successfully!` });
    } catch (error) {
        console.error("Error updating products:", error);
        res.status(500).json({ message: "❌ Failed to update products", error });
    }
});

module.exports = router;
