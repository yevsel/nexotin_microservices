const mongoose = require("mongoose")


const subscriptionSchema = mongoose.Schema({
    vendorEmail:{
        type:String,
        required:true
    },
    buyerEmail:{
        type:String,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("subscriptionModel",subscriptionSchema)

