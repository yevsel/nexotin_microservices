const mongoose = require("mongoose")

const individualAccountSchema = mongoose.Schema({
    accountType:{
        type:String, 
        default:"individual"
    },
    bannerImage:{
        type:mongoose.Schema.Types.Mixed,
    },
    profileImage:{
        type:mongoose.Schema.Types.Mixed,
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    location:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    stockCycle:{
        type:String,
        required:true
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

module.exports = mongoose.model("individualAccountModel",individualAccountSchema)