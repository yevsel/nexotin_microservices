const mongoose = require("mongoose")
const random = require('mongoose-random');
const productSchema = mongoose.Schema({
    accountOwnerID:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        required:true
    },
    images:{
        type:[mongoose.Schema.Types.Mixed],
        required:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true
    },
    height:{
        type:Number,
        required:true
    },
    unisex:{
        type:Boolean,
        default:false
    },
    mainCategory:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        // required:true
    },
    productType:{
        type:String,
        // required:true
    },
    colors:{
        type:[String],
        // required:true
    },
    selectedSizes:{
        type:[String],
        // required:true
    },
    productDescription:{
        type:String,
        required:true
    },
    productQuantity:{
        type:Number,
        min: 0,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    condition:{
        type:String,
        required:true
    },
    createdAt:{
        type:Number,
        required:true
    },
    
    offerId: { type: String, unique: true, default: null }, 
    link: { type: String, default: null }, 
    imageLink: { type: String, default: null }, 
    availability: { 
        type: String, 
        enum: ["in stock", "out of stock", "preorder"], 
        default: "in stock" 
    },
    contentLanguage: { type: String, default: "en" },
    targetCountry: { type: String, default: "GH" },
    currency: { type: String, default: "GHS" },
    shortPath: {
    type: String,
    unique: true,
    sparse: true
},
})

productSchema.index({
    name: 'text',
    productDescription: 'text',
    subCategory: 'text',
    brand: 'text',
    gender: 'text'
  });
// productSchema.plugin(random,{path:"r"})
// Add multikey indexes for colors and selectedSizes
productSchema.index({ colors: 1 });
productSchema.index({ selectedSizes: 1 });
module.exports = mongoose.model("productModel",productSchema)