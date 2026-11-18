const express = require("express")
const emailSender = require("../utils/emailSender")
const individualAccountModel = require("../models/individualAccountModel")
const businessAccountModel = require("../models/businessAccountModel")
const {Expo} = require("expo-server-sdk")
const getAllTokens = require("../routes/getAllExpoTokens")
const expoNotificationTokensModel = require("../models/expoNotificationTokensModel")
const ordersModel = require("../models/ordersModel")
const router = express.Router() 
const jwt = require("jsonwebtoken")
require("dotenv").config()
const LOGIN_SECRET = process.env.LOGIN_SECRET

const accountTypeModels = 
{
    "individual":individualAccountModel,
    "business":businessAccountModel
}

const expo = new Expo()

const sendPushNotification = async (token, message) => {
    if (!Expo.isExpoPushToken(token)) {
        console.error('Invalid Expo Push token');
        return;
    }

    const messages = [
        {
            to: token,
            sound: 'default',
            title:"NEXOTIN VENDOR",
            body: message,
            data:{
                screenToNavigate: 'OrdersMainScreen'
            },
            android:{
                icon:"http://www.nexotin.com/wp-content/uploads/2022/04/logo-Nexotin-white-transparent.png"
            },
            ios: {
                sound: 'default',
                badge: 1, // You can set the badge number here
                _displayInForeground: true,
            }
        },
    ];

    try {
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        for (const chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } 

      // Process response from Expo's push notification service
        const receiptIds = tickets.map(ticket => ticket.id);
        const receiptResponse = await expo.getPushNotificationReceiptsAsync(receiptIds);

      // Process receiptResponse to handle any errors or successes
        } catch (error) {
        console.error('Error sending push notification:', error);
        }
};

const getAllEmails = async (uniqueIDs) => {
    try {
        const emailPromises = uniqueIDs.map(async (ID) => {
            const responseFromDB = await individualAccountModel.findById(ID).select("email");
            return responseFromDB.email; // Extract the email from the response
        });

        const emails = await Promise.all(emailPromises);
        return emails;
    } catch (error) {
        throw error.message; // Throw the error message instead of using reject
    }
};


const getVendorAllTokens = (uniqueIDs)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let allTokens = []
            for(id of uniqueIDs){
                let token = await expoNotificationTokensModel.find({ownerId:id})
                allTokens.push(...token)
            }
            resolve(allTokens)
        } catch (error) {
            reject("Get vendor token error",error)
        }
    })
}

const getAllVendorsWhoHaveOrder = (products)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let vendors = []
            for(let i=0;i<products.length;i++){
                let vendor = await accountTypeModels[products[i].accountType].findOne({_id:products[i].accountOwnerID})
                let isVendorInside = false;
                for (let j = 0; j < vendors.length; j++) {
                    if (vendors[j]._id.toString() === vendor._id.toString()) {
                        isVendorInside = true;
                        break;
                    }
                }
        
                if (!isVendorInside) {
                    vendors.push(vendor);
                }
            }
            resolve(vendors)
        } catch (error) {
            reject("Get vendor who have orders error",error)
        }
    })
}

router.post("/",async(req,res)=>{
    try {
        const{
            products,
            totalPrice,
            orderNumber,
            buyerLocation,
            buyerJWTToken,
            landmark,
            vendorsEmail,
            phoneNumber
            } = req.body
            // console.log("PRODUCTS",products)
        // Get all unique accountOwnerID
        
        // console.log("BuyerJWTToken",buyerJWTToken)
        // console.log("BuyerLocation",buyerLocation)
        // console.log("LAndmark",landmark)
        // console.log("Order number",orderNumber)
        // console.log("Phone Number",phoneNumber)
        // console.log("PRODUCTS",products)
        // console.log("TotalPrice",totalPrice)
        // console.log("vendorsEmail",vendorsEmail)
        // return
        const accountOwnerIDs = products.map(item=>item.accountOwnerID)
        const uniqueAccountOwnerIDs = [...new Set(accountOwnerIDs)]
        // console.log("UIQ",uniqueAccountOwnerIDs)
        // Get all Vendor tokens
       getVendorAllTokens(uniqueAccountOwnerIDs).then(expoTokens=>{
            for(let i=0;i<expoTokens.length;i++){
                if(expoTokens[i]!==null){
                    // console.log("TOKEN",expoTokens[i])
                    sendPushNotification(expoTokens[i].expoToken,"New order alert! Check your orders for the latest request.")
                }
            }
            // emailSender.sendBulkEmail(vendorsEmail)
       }).catch(err=>console.log("ERR",err))
        
        // Fetch all vendors whose products have been ordered
        const allVendorsWhoHaveOrders = await getAllVendorsWhoHaveOrder(products)
        // console.log(allVendorsWhoHaveOrders[0]._id.toString())
        
        

        let finalObj = []
        // res.json({msg:finalObj}) 
        // return
        // console.log()
        for (let i=0;i<products.length;i++){
            let obj={}
            for (let j=0;j<allVendorsWhoHaveOrders.length;j++){
                if(products[i].accountOwnerID===allVendorsWhoHaveOrders[j]._id.toString()){
                    if(allVendorsWhoHaveOrders[j].accountType==="individual"){
                        obj={
                            email:allVendorsWhoHaveOrders[j].email,
                            order:products[i]
                        }
                        finalObj.push(obj)
                    }else{
                        obj={
                            email:allVendorsWhoHaveOrders[j].businessEmail,
                            order:products[i]
                        }
                        finalObj.push(obj)
                    }
                }
            }
            obj={}
        }

        let vendorEmailAndOrder = []
        
        for (let i=0;i<vendorsEmail.length;i++){
            let vendorsOrder=[]
            for (let j=0;j<finalObj.length;j++){
                if(vendorsEmail[i]===finalObj[j].email){
                    vendorsOrder.push(finalObj[j].order)
                }
            }
            let info = {
                vendorsEmail:vendorsEmail[i],
                orderNumber,
                buyerLocation:buyerLocation.data.description,
                vendorsOrder
                }
            vendorEmailAndOrder.push(info)
            vendorsOrder=[]
        }
        
        // Send emails to respective vendors and the orders they have
        for (let i=0;i<vendorEmailAndOrder.length;i++){
            emailSender.sendEmail(vendorEmailAndOrder[i].vendorsEmail,vendorEmailAndOrder[i].vendorsOrder,buyerLocation,orderNumber)
        }
        // console.log(vendorEmailAndOrder[0].vendorsOrder[0].accountOwnerID)
        
        // Get buyer information
        // const token = req.headers.authorization.split(" ")[1]
        const secret_info = jwt.verify(buyerJWTToken,LOGIN_SECRET)
        
        
        // Store the orders in the database
        for (let i=0;i<vendorEmailAndOrder.length;i++){
            let storeOrderResponse = await ordersModel.create({
                orderNumber:vendorEmailAndOrder[i].orderNumber,
                totalPrice:totalPrice,
                vendorEmail:vendorEmailAndOrder[i].vendorsEmail,
                vendorId:vendorEmailAndOrder[i].vendorsOrder[0].accountOwnerID,
                buyerJWTToken:buyerJWTToken,
                buyerId:secret_info.id,
                buyerLandmark:landmark,
                buyerLocation:buyerLocation,
                buyerPhoneNumber:phoneNumber,
                vendorAccountType:vendorEmailAndOrder[i].vendorsOrder[0].accountType,
                orders:vendorEmailAndOrder[i].vendorsOrder,
                createdAt:Date.now()
            })
        }
        
        res.json({msg:"Order made successfully, you will be notified if any update."}) 
        // res.json({msg:vendorEmailAndOrder}) 
    } catch (error) {
        res.json({msg:error.message}) 
    }
})

module.exports = router