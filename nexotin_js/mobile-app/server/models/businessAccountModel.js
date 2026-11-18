const mongoose = require("mongoose")

const businessAccountSchema = mongoose.Schema({
    accountType:{
        type:String,
        default:"business"
    },
    bannerImage:{
        type:mongoose.Schema.Types.Mixed,
    },
    profileImage:{
        type:mongoose.Schema.Types.Mixed,
    },
    password:{
        type:String,
        required:true
    },
    shopName:{
        type:String,
        required:true
    },
    whatDoYouSell:{
        type:String,
        required:true,
    },
    location:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    businessPhoneNumber:{
        type:String,
        required:true
    },
    businessEmail:{
        type:String,
        required:true
    },
    momoAccountNumber:{
        type:String,
        required:true
    },
    stockCycle:{
        type:String,
        required:true
    },    
    verified:{
        type:Boolean,
        default:false
    },
    shortPath: {
    type: String,
    unique: true,
    sparse: true
    },
    createdAt:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("businessAccountModel",businessAccountSchema)