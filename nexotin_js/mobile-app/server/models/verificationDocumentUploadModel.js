const mongoose = require("mongoose")

const verificationDocumentUploadSchema = mongoose.Schema({
    vendorId:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        required:true
    },
    selfieImage1:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    selfieImage2:{
        type:mongoose.Schema.Types.Mixed,
        // required:true
    },
    idCardImage1:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    idCardImage2:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
    isCompanyRegistered:{
        type:Boolean,
        default:false
    },
    certificateOfRegistrationImage:{
        type:mongoose.Schema.Types.Mixed
    },
    form3Image:{
        type:mongoose.Schema.Types.Mixed
    },
    createdAt:{
        type:Number,
        required:true
    },
})

module.exports  =  mongoose.model("verificationDocumentUploadModel",verificationDocumentUploadSchema)