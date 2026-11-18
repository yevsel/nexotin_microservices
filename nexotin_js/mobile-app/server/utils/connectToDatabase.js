const mongoose = require("mongoose")
const productModel = require("../models/productModel")
require("dotenv").config()



const connectDB = async()=>{
    try {
        const DB = process.env.DB
        const response = await mongoose.connect(DB)
        const db = mongoose.connection;
        db.once('open', async () => {
            console.log("DB CONNECTION LIVE")
            try {
              const collection = db.collection('productModel');
              const changeStream = collection.watch();
              // Listen for change events
              changeStream.on('change', (next) => {
                console.log(`Detected a change: ${JSON.stringify(next)}`);
                if (next.operationType === 'insert') {
                  const newProduct = next.fullDocument;
                  console.log('New product added:', newProduct);
                  io.emit('newProduct', newProduct);
                  // You can emit a socket event here to alert clients about the new product
                }
              });
            } catch (error) {
              console.error('Error setting up change stream:', error);
            }
          });
        // console.log("Database Connection Successful",response.connection)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDB