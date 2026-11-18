const mongoose = require("mongoose")

const forgotPasswordSchema = mongoose.Schema({
    userEmail:{
        type:String,
        required:true
    },
    shortCode:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("forgotPasswordModel",forgotPasswordSchema)

