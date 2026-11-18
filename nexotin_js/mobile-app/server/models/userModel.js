const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    profileImage:{
        type:mongoose.Schema.Types.Mixed,
        // required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
    gender:{
        type:String,
        // require:true
    },
    username:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        required:true
    },
    location:{
        type:mongoose.Schema.Types.Mixed,
        // required:true
    },
    createdAt:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("userModel",userSchema)