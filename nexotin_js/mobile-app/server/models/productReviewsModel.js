const mongoose = require("mongoose")

const productReviewSchema = mongoose.Schema({
    productId:{
        type:String,
        required:true
    },
    vendorAccountId:{
        type:String,
        required:true
    },
    vendorAccountType:{
        type:String,
        required:true
    },
    buyerInformation:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    review:{
        type:mongoose.Schema.Types.Mixed,
        required:true,
    },
    createdAt:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("productReviewModel",productReviewSchema);