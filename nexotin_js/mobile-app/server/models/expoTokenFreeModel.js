const mongoose = require("mongoose")

const expoFreeToken = mongoose.Schema({
    expoToken:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model("expoFreeToken",expoFreeToken)