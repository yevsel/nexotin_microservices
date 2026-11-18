// const userModel = require("../../models/userModel")
const businessModel = require("../../models/businessAccountModel")
const individualModel = require("../../models/individualAccountModel")
const router = require("express").Router()
const expoTokens = require("../../models/expoNotificationTokensModel")

const {Expo} = require("expo-server-sdk")

const expo = new Expo()

const sendOnePushNotification = async (token, message) => {
  
    if (!Expo.isExpoPushToken(token)) {
        console.error('Invalid Expo Push token');
        return;
    }

    const messages = [ 
        {
            to: token, 
            sound: 'default',
            title:"",
            body: message,
            data:{
              imageUrl:"https://www.shutterstock.com/image-photo/delivery-concept-side-view-portrait-600nw-1271761927.jpg"
            }
        },
    ];

    try {
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];
        // console.log("SENT TO",token)
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

router.post("/", async (req, res) => {
    try {
        const { vendorEmail } = req.body;

        if (!vendorEmail) {
            return res.status(400).json({ error: "Vendor email is required" });
        }

        console.log("Vendor Email:", vendorEmail);

        // Fetch both business and individual info concurrently
        const [businessInfo, individualInfo] = await Promise.all([
            businessModel.findOne({ businessEmail: vendorEmail }).select("businessEmail"),
            individualModel.findOne({ email: vendorEmail }).select("email")
        ]);
        // console.log("BUSINESS INFO",businessInfo)
        // console.log("INDIVIDUAL INFO",individualInfo)
        // return
        if (businessInfo) {
    const expoTokenModels = await expoTokens.find({ ownerId: businessInfo._id, role: "vendor" }).select("expoToken");
    // console.log("B TOKENS:", expoTokenModels);

    if (expoTokenModels && expoTokenModels.length > 0) {
        for (const tokenModel of expoTokenModels) {
            if (tokenModel.expoToken && Expo.isExpoPushToken(tokenModel.expoToken)) {
                await sendOnePushNotification(tokenModel.expoToken, "You have a new message");
            } else {
                console.warn("Invalid or missing Expo token:", tokenModel.expoToken);
            }
        }
    } else {
        console.log("No Expo tokens found for this business vendor");
    }
} else if (individualInfo) {
    const expoTokenModels = await expoTokens.find({ ownerId: individualInfo._id, role: "vendor" }).select("expoToken");
    console.log("IND TOKENS:", expoTokenModels);

    if (expoTokenModels && expoTokenModels.length > 0) {
        for (const tokenModel of expoTokenModels) {
            if (tokenModel.expoToken && Expo.isExpoPushToken(tokenModel.expoToken)) {
                await sendOnePushNotification(tokenModel.expoToken, "You have a new message");
            } else {
                console.warn("Invalid or missing Expo token:", tokenModel.expoToken);
            }
        }
    } else {
        console.log("No Expo tokens found for this individual vendor");
    }
} else {
    console.log("No matching business or individual found for the provided email.");
}


        res.status(200).json({ message: "Notification sent if applicable" });
    } catch (error) {
        // console.error("ERROR in POST / route:", error.message);
        res.status(500).json({ error: "An error occurred while processing your request" });
    }
});

module.exports = router