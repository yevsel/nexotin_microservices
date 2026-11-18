const mongoose = require("mongoose")


const accountDeletionRequestSchema = mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("accountDeletionRequestModel",accountDeletionRequestSchema)