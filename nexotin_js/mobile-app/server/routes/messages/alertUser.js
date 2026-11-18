const userModel = require("../../models/userModel")
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
            title:"Nexotin",
            body: message,
            data:{
                url: "nexotin-app-scheme://(tabs)/Messages"
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

router.post("/",async(req,res)=>{
    try {
        const {userEmail} = req.body
        // console.log("USER EMAIL",userEmail)
        const userInfo = await userModel.findOne({email:userEmail}).select("_id")
        const expoTokenModel = await expoTokens.findOne({ownerId:userInfo._id}).select("expoToken")
        // console.log("EXPO TOKEN",expoToken)
        sendOnePushNotification(expoTokenModel.expoToken,"You have a new message")
    } catch (error) {
        console.log("ERROR",error.message)
    }
})

module.exports = router