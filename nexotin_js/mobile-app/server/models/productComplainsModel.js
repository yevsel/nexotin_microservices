const mongoose = require("mongoose")

const productComplainsSchema = new mongoose.Schema({
    product_id: {
        type: String,
        required: true
    },
    complain_text: {
        type: String,
        required: true
    },
    complain_by: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    complain_to: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Number,
        default: Date.now
    }
})

module.exports = mongoose.model("productComplainsModel",productComplainsSchema)