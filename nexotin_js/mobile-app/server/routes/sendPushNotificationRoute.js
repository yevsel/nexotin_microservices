const express = require("express");
const { Expo } = require("expo-server-sdk");
const expoNotificationTokensModel = require("../models/expoNotificationTokensModel");
const accountDeletionModel = require("../models/accountDeletionRequestModal");
const userModel = require("../models/userModel");
const expoFreeTokens = require("../models/expoTokenFreeModel");
const productsModel = require('../models/productModel');

const router = express.Router();
const expo = new Expo();

// Constants for better maintainability
const NOTIFICATION_CONFIG = {
  sound: 'default',
  defaultTitle: 'Nexotin',
  defaultMessage: 'Discover looks that match your mood',
  imageUrl: "https://www.shutterstock.com/image-photo/delivery-concept-side-view-portrait-600nw-1271761927.jpg"
};

const MAX_CONCURRENT_NOTIFICATIONS = 100; // Batch size for concurrent processing

/**
 * Sends a single push notification with improved error handling
 * @param {string} token - Expo push token
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @returns {Promise<boolean>} - Success status
 */
const sendOnePushNotification = async (token, title = NOTIFICATION_CONFIG.defaultTitle, message = NOTIFICATION_CONFIG.defaultMessage) => {
  try {
    if (!Expo.isExpoPushToken(token)) {
      console.error(`Invalid Expo Push token: ${token}`);
      return false;
    }

    const messages = [{
      to: token,
      sound: NOTIFICATION_CONFIG.sound,
      title,
      body: message,
      data: {
        imageUrl: NOTIFICATION_CONFIG.imageUrl,
        timestamp: new Date().toISOString(),
        url: "nexotin-app-scheme://(tabs)/Home"
      }
      
    }];

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    // Send notifications
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    // Process receipts for error handling
    const receiptIds = tickets
      .filter(ticket => ticket.id)
      .map(ticket => ticket.id);

    if (receiptIds.length > 0) {
      const receiptResponse = await expo.getPushNotificationReceiptsAsync(receiptIds);
      
      // Log any receipt errors
      Object.keys(receiptResponse).forEach(receiptId => {
        const receipt = receiptResponse[receiptId];
        if (receipt.status === 'error') {
          console.error(`Push notification error for token ${token}:`, receipt.message);
          
          // Handle specific error types
          if (receipt.details && receipt.details.error === 'DeviceNotRegistered') {
            // Token is invalid, should be removed from database
            console.log(`Token ${token} should be removed - device not registered`);
          }
        }
      });
    }

    return true;
  } catch (error) {
    console.error(`Error sending push notification to ${token}:`, error.message);
    return false;
  }
};

/**
 * Sends notifications in batches to improve performance
 * @param {Array} tokens - Array of token objects
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @returns {Promise<Object>} - Results summary
 */
const sendBatchNotifications = async (tokens, title, message) => {
  let successCount = 0;
  let failureCount = 0;
  const invalidTokens = [];

  // Process tokens in batches
  for (let i = 0; i < tokens.length; i += MAX_CONCURRENT_NOTIFICATIONS) {
    const batch = tokens.slice(i, i + MAX_CONCURRENT_NOTIFICATIONS);
    
    const promises = batch.map(async (tokenObj) => {
      if (!tokenObj.expoToken) {
        failureCount++;
        return false;
      }

      const success = await sendOnePushNotification(tokenObj.expoToken, title, message);
      if (success) {
        successCount++;
        console.log(`✓ Push sent to: ${tokenObj.expoToken.substring(0, 20)}...`);
      } else {
        failureCount++;
        invalidTokens.push(tokenObj.expoToken);
      }
      return success;
    });

    // Wait for current batch to complete before processing next batch
    await Promise.all(promises);
    
    // Add small delay between batches to avoid rate limiting
    if (i + MAX_CONCURRENT_NOTIFICATIONS < tokens.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return {
    total: tokens.length,
    success: successCount,
    failure: failureCount,
    invalidTokens
  };
};

/**
 * Gets vendor tokens (tokens not associated with users)
 * @param {Array} allTokens - All tokens from database
 * @returns {Promise<Array>} - Vendor tokens
 */
const getVendorTokens = async (allTokens) => {
  try {
    if (!Array.isArray(allTokens) || allTokens.length === 0) {
      return [];
    }

    // Extract unique owner IDs for batch query
    const ownerIds = [...new Set(allTokens.map(token => token.ownerId).filter(Boolean))];
    
    if (ownerIds.length === 0) {
      return allTokens; // All tokens are vendor tokens
    }

    // Single database query instead of multiple
    const existingUsers = await userModel.find(
      { _id: { $in: ownerIds } },
      { _id: 1 } // Only fetch _id field for performance
    );

    const existingUserIds = new Set(existingUsers.map(user => user._id.toString()));
    
    // Filter tokens that don't have associated users
    const vendorTokens = allTokens.filter(token => 
      !token.ownerId || !existingUserIds.has(token.ownerId.toString())
    );

    return vendorTokens;
  } catch (error) {
    console.error('Error fetching vendor tokens:', error);
    throw new Error('Failed to fetch vendor tokens');
  }
};

// Main route handler
router.post("/", async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { title, message } = req.body;
    
    // Use provided title/message or defaults
    const notificationTitle = title || NOTIFICATION_CONFIG.defaultTitle;
    const notificationMessage = message || NOTIFICATION_CONFIG.defaultMessage;

    console.log(`Starting push notification broadcast: "${notificationTitle}" - "${notificationMessage}"`);

    // Fetch free tokens (assuming these are the target audience)
    const freeTokens = await expoFreeTokens.find({ expoToken: { $exists: true, $ne: null } });
    
    if (freeTokens.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No tokens found to send notifications to",
        stats: { total: 0, success: 0, failure: 0 }
      });
    }

    console.log(`Found ${freeTokens.length} tokens to process`);

    // Send notifications in batches
    const results = await sendBatchNotifications(freeTokens, notificationTitle, notificationMessage);
    
    const duration = Date.now() - startTime;
    console.log(`Push notification broadcast completed in ${duration}ms`);
    console.log(`Results: ${results.success} sent, ${results.failure} failed`);

    // Clean up invalid tokens (optional - uncomment if needed)
    if (results.invalidTokens.length > 0) {
      console.log(`Found ${results.invalidTokens.length} invalid tokens that should be cleaned up`);
      // await expoFreeTokens.deleteMany({ expoToken: { $in: results.invalidTokens } });
    }

    res.status(200).json({
      success: true,
      message: "Push notifications sent successfully",
      stats: {
        total: results.total,
        success: results.success,
        failure: results.failure,
        duration: `${duration}ms`,
        invalidTokens: results.invalidTokens.length
      }
    });

  } catch (error) {
    console.error('Error in push notification route:', error);
    res.status(500).json({
      success: false,
      message: "Failed to send push notifications",
      error: error.message
    });
  }
});

module.exports = router;












// // const mongoose = require("mongoose")
// const express = require("express")
// const {Expo} = require("expo-server-sdk")
// const expoNotificationTokensModel = require("../models/expoNotificationTokensModel")
// const accountDeletionModel = require("../models/accountDeletionRequestModal")
// const userModel = require("../models/userModel")
// const expoFreeTokens = require("../models/expoTokenFreeModel")
// const productsModel = require('../models/productModel')
// const router = express.Router()
 
// const expo = new Expo()

// const sendOnePushNotification = async (token, message) => {
  
//     if (!Expo.isExpoPushToken(token)) {
//         console.error('Invalid Expo Push token');
//         return;
//     }

//     const messages = [ 
//         {
//             to: token, 
//             sound: 'default',
//             title:"",
//             body: message,
//             data:{
//               imageUrl:"https://www.shutterstock.com/image-photo/delivery-concept-side-view-portrait-600nw-1271761927.jpg"
//             }
//         },
//     ];

//     try {
//         const chunks = expo.chunkPushNotifications(messages);
//         const tickets = [];
//         // console.log("SENT TO",token)
//         for (const chunk of chunks) {
//             const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
//             tickets.push(...ticketChunk);
//         } 

//       // Process response from Expo's push notification service
//         const receiptIds = tickets.map(ticket => ticket.id);
//         const receiptResponse = await expo.getPushNotificationReceiptsAsync(receiptIds);

//       // Process receiptResponse to handle any errors or successes
//         } catch (error) {
//         console.error('Error sending push notification:', error);
//         }
// };

// const getVendorTokens = async (allTokens) => {
//     try {
//       const vendorTokens = [];
  
//       for (const token of allTokens) {
//         const foundUser = await userModel.findOne({ _id: token.ownerId });
  
//         if (!foundUser) {
//           vendorTokens.push(token);
//         }
//       }
  
//       return vendorTokens;
//     } catch (error) {
//       console.error('Error fetching vendor tokens:', error);
//       // Handle the error appropriately (e.g., throw, log, return an error message)
//     }
//   };  

// router.post("/",async(req,res)=>{
//     try {
        
//         let messages = [];
//         const allTokens = await expoNotificationTokensModel.find()
//         const freeTokens = await expoFreeTokens.find()
        
//         let count=0
        
//         for (let pushToken of freeTokens) {
//         // for (let pushToken of ["ExponentPushToken[hCmOIYJ_yd0Yk7gWJdvRfJ]"]) {
            
//             if (!Expo.isExpoPushToken(pushToken.expoToken)) {
//                 console.error(`Push token ${pushToken.expoToken} is not a valid Expo push token`);
//                 continue;
//             }
//         sendOnePushNotification(pushToken.expoToken,"Discover looks that match your mood")
        
//         console.log("PUSH SENT TO",pushToken)
//             console.log("COUNT",count)
//             count +=1
//         }
         
        
//     } catch (error) {
        
//     }
// })

// module.exports = router



// // data: {
// //   // Navigation/routing data
// //   screen: 'ChatRoom',
// //   roomId: '123',
  
// //   // Content information
// //   messageId: 'msg_456',
// //   messageType: 'comment',
// //   senderId: 'user_789',
  
// //   // Status updates
// //   orderStatus: 'shipped',
// //   orderId: 'order_123',
  
// //   // Counters/badges
// //   unreadCount: 5,
  
// //   // Timestamps
// //   createdAt: '2025-01-10T10:30:00Z',
  
// //   // Action identifiers
// //   action: 'friend_request',
// //   actionId: 'action_123',
  
// //   // Rich content references
// //   imageUrl: 'https://example.com/image.jpg',
// //   videoId: 'video_123',
  
// //   // Categories/tags
// //   category: 'promotion',
// //   priority: 'high',
  
// //   // Deep linking
// //   deepLink: 'myapp://orders/123'
// // }