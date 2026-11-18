const mongoose = require("mongoose")


const accountDeletionRequestVendorSchema = mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("accountDeletionRequestModelVendor",accountDeletionRequestVendorSchema)