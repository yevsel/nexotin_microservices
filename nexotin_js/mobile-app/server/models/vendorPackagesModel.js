const mongoose = require("mongoose")
// const express = require("express")

const vendorPackageSchema = mongoose.Schema({
    createdAt:{
        type:Number,
        required:true
    },
    expiresAt:{
        type:Number,
        required:true
    },
    vendorId:{
        type:String,
        required:true
    },
    vendorAccountType:{
        type:String,
        required:true
    },
    packageType:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    }
})

module.exports = mongoose.model("vendorPackagesModel",vendorPackageSchema)