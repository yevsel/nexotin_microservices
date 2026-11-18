const mongoose = require("mongoose")

const videoSchema = mongoose.Schema({
    accountType:{
        type:String,
        required:true
    },
    vendorId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    productId:{
        type:String,
        required:true
    },
    videoObject:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("videoModel",videoSchema)