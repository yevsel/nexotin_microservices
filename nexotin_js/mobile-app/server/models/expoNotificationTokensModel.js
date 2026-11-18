const mongoose = require("mongoose")

const expoNotificationTokenSchema = mongoose.Schema({
    ownerId:{
        type:String,
        required:true
    },
    expoToken:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("expoNotificationTokenModel",expoNotificationTokenSchema)