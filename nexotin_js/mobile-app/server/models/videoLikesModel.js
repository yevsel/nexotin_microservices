const mongoose = require("mongoose")

const videoLikesSchema = mongoose.Schema({
    buyerEmail:{
        type:String,
        required:true
    },
    videoId:{
        type:String,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model("videoLikesModel",videoLikesSchema)