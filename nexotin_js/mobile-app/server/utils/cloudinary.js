const cloudinary = require("cloudinary").v2
require("dotenv").config()

cloudinary.config({
    cloud_name:"deaijqucs",
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})
// cloudinary.uploader.upload()

module.exports=cloudinary