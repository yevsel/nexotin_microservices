const express = require("express")
const productModel = require("../models/productModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET
const router = express.Router()
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const accountTypeModels = {
    "individual": individualAccountModel,
    "business": businessAccountModel
}

// Simple ID generator function
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
        const BASE_URL = "https://www.nexotin.com/p";
        const token = req.headers.authorization.split(" ")[1]
        const secret_info = jwt.verify(token, LOGIN_SECRET)
        const {
            images,
            name,
            price,
            gender,
            height,
            mainCategory,
            subCategory,
            productType,
            colors,
            selectedSizes,
            productDescription,
            productQuantity,
            brand,
            condition,
        } = req.body.data

        const short = generateShortId(6); // Custom function
        const shortPath = `${BASE_URL}/${short}`;
        const addProductDatabaseResponse = await productModel.create({
            accountOwnerID: secret_info.id,
            accountType: secret_info.accountType,
            images,
            name: name.trim(),
            price,
            gender,
            height,
            mainCategory,
            subCategory,
            productType,
            colors,
            selectedSizes,
            productDescription,
            productQuantity,
            brand,
            condition,
            shortPath,
            createdAt: Date.now()
        })
        
        if (addProductDatabaseResponse) return res.json({ msg: true })
    } catch (error) {
        // console.log(error.message)
        res.json({ msg: error.message })
    }
})

module.exports = router