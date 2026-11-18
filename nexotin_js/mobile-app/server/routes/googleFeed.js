const express = require("express");
const router = express.Router();
// const productModel = require("../../models/productModel");
const productModel = require("../models/productModel")

router.get("/", async (req, res) => {
    try {
        const products = await productModel.find({});
        const feed = generateXMLFeed(products);
        res.set("Content-Type", "application/xml");
        res.send(feed);
    } catch (error) {
        console.error("Error generating feed:", error);
        res.status(500).send("❌ Error generating feed");
    }
});

function escapeXml(unsafeText) {
    if (!unsafeText) return ""; 
    
    return unsafeText
      .replace(/&/g, "&amp;")   
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

function generateXMLFeed(products) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>Nexotin Products</title>
        <link>https://nexotin.com</link>
        <description>Product feed for Nexotin</description>`;

    products.forEach((product) => {
        xml += `
        <item>
            <g:id>${product._id}</g:id>
            <g:title>${escapeXml(product.name)}</g:title>
            <g:description>${escapeXml(product.productDescription)}</g:description>
            <g:link>https://nexotin.com/shop/products/${product._id}</g:link>
            <g:image_link>${product.imageLink || product.images[0].secure_url}</g:image_link>
            <g:availability>${product.availability}</g:availability>
            <g:price>${product.price} GHS</g:price>
            <g:condition>${product.condition}</g:condition>
            <g:brand>${escapeXml(product.brand)}</g:brand>
            <g:currency>${product.currency}</g:currency>
            <g:target_country>${product.targetCountry}</g:target_country>
        </item>`;
    });

    xml += `
    </channel>
</rss>`;
    return xml;
}

module.exports = router;
