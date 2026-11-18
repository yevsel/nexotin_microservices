const mongoose = require("mongoose")

const ordersSchema = mongoose.Schema({
    orderNumber:{
        type:String,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true,
    },
    orderStatus:{
        type:Number,
        default:1,
    },
    vendorEmail:{
        type:String,
        required:true,
    },
    vendorId:{
        type:String,
        required:true,
    },
    buyerId:{
        type:String,
        required:true
    },
    buyerJWTToken:{
        type:String,
        required:true
    },
    buyerLandmark:{
        type:String,
        required:true
    },
    buyerLocation:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    buyerPhoneNumber:{
        type:String,
        required:true
    },
    vendorAccountType:{
        type:String,
        required:true
    },
    orders:{
        type:[mongoose.Schema.Types.Mixed],
        required:true
    },    
    paid:{
        type:Number,
        default:1
    },
    updatedAt:{
        type:Number
    },
    createdAt:{
        type:Number,
        required:true
    }
})
module.exports = mongoose.model("ordersModel",ordersSchema)

// Paid : {1: not paid, 2: paid, 3: pay on delivery}