const express = require("express")
const mongoose= require("mongoose")
const http = require("http")
const {Server} = require("socket.io")
require("dotenv").config()
const connectToDatabase = require("./utils/connectToDatabase")
const cors = require("cors")
const morgan = require("morgan")
const createAccountRoute = require("./routes/createAccountRoute")
const loginAccountRoute = require("./routes/loginAccountRoute")
const editProfilePictureRoute = require("./routes/editProfilePictureRoute")
const editBannerPictureRoute = require("./routes/editBannerPictureRoute")
const addProductRoute = require("./routes/addProductRoute")
const getProductsRoute = require("./routes/getProductsRoute")
const postVideoRoute = require("./routes/postVideoRoute")
const getVideoRouter = require("./routes/getVideosRoute")
const getProductsForBuyers = require("./routes/getProductsForBuyers")
const getNewArrivals = require("./routes/getNewArrivals")
const getOneProduct = require("./routes/getOneProduct")
const getAllVideosRoute = require("./routes/getAllVideosRoute")
const registerUserRoute = require("./routes/registerUserRoute")
const loginUserRoute = require("./routes/loginUserRoute")
const editUserProfileImageRoute = require("./routes/editUserProfileImageRoute")
const ordersRoute = require("./routes/ordersRoute")
const searchProductsRoute = require("./routes/searchProductsRoute")
const specificCategoryProductsRoute = require("./routes/specificCategoryProductsRoute")
const getRelatedItems = require("./routes/getRelatedItems")
const getSubCategoryRecommendedItems = require("./routes/getSubCategoryRecommendedItems")
const SMSRoute = require("./routes/SMSRoute")
const searchProductForVideoRoute = require("./routes/searchProductToLinkToVideoRoute")
const getProfileForVideoRoute = require("./routes/getProfileForVideoRoute")
const getVendorPackagesDetails = require("./routes/getVendorPackageDetailsRoute")
const getVendorOfProducts = require("./routes/getVendorOfProducts")
const saveUserExpoNotificationToken = require("./routes/saveUserExpoNotificationTokenRoute")
const getAllExpoTokens = require("./routes/getAllExpoTokens")
const getVendorOrdersRoute = require("./routes/getVendorOrdersRoute")
const getOrderDetails = require("./routes/getOrderDetails")
const getVendorProductsForVideoMainScreen = require("./routes/getVendorProductsForVideoMainScreen")
const getVendorVideosForVideoMainScreen = require("./routes/getVendorVideosForVideoMainScreen")
const postProductReviewRoute = require("./routes/postProductReview")
const getProductReviewRoute = require("./routes/getProductReview")
const forgotPasswordPost = require("./routes/forgotPasswordRoute(POST)")
const updateProductRoute = require("./routes/updateProductRoute")
const subscribeToAVendor = require("./routes/subscribeToAVendorRoute")
const checkSubscriptionRoute = require("./routes/checkSubscriptionRoute")
const countSubscribers = require("./routes/countSubscribers")
const videoLikesRoute = require("./routes/videoLikesRoute")
const videoLikesCount = require("./routes/getVideoLikesCountRoute")
const unlikeVideoRoute = require("./routes/unlikeVideoRoute")
const unsubscribeToVendor = require("./routes/unsubscribeToVendor")
const deleteProduct = require("./routes/deleteProductsRoute")
const getBuyerImagesForReviews = require("./routes/getBuyersImagesForReviews")
const getBuyerInformationForOrders = require("./routes/getBuyerInformationForOrders")
const updateOrderStatus = require("./routes/updateOrderStatus")
const getOrdersForBuyer = require("./routes/getOrdersForBuyer")
const updateOrderPaymentStatus = require("./routes/updateOrderPaymentStatus")
const checkVendorVerification = require("./routes/checkVendorVerification")
const verifyVendorRoute = require("./routes/verifyVendorRoute")
const getVideoForEditingRoute = require("./routes/getVideoForEditingRoute")
const editVideoObjectRoute = require("./routes/editVideoObjectRoute")
const deleteVideo = require("./routes/deleteVideo")
const deleteAccount = require("./routes/accountDeletionRoute")
const deleteAccountVendor = require("./routes/accountDeletionRouteVendor")
const productComplainRoute = require("./routes/productComplainRoute")
const vendorEditProfileRoute = require("./routes/vendorEditProfileRoute")
const forgotPasswordConfirmAndUpdate = require("./routes/forgotPasswordRoute(CONFIRM&UPDATE)")
const searchVendorsRoute = require("./routes/searchVendorsRoute")
const sendPushNotifications = require("./routes/sendPushNotificationRoute")
const googleSignUpAndSignInRoute = require("./routes/googleSignUpAndSignInRoute")
const getHotSales = require("./routes/getHotSalesItems")
const addExpoTokenRoute = require("./routes/addExpoTokenFreeRoute")
// const getVI = require("./routes/")

const dashboardGetOrders = require("./routes/dashboard-routes/getAllOrders")
const dashboardGetOrdersOne = require("./routes/dashboard-routes/getOneOrder")
const dashboardSearchOrders = require("./routes/dashboard-routes/searchOrderRoute")
const dashboardGetAllVendors = require("./routes/dashboard-routes/getAllVendors")
const dashboardGetVendorDocuments = require("./routes/dashboard-routes/getVerificationDocuments")
const dashboardVerifyOrUnverifyVendor = require("./routes/dashboard-routes/verifyOrUnverifyVendor")
const dashboardGetAnalytics = require("./routes/analyticsOverview")
const getAllCustomers = require("./routes/getAllCustomers")
// const grabAllCustomers = require("./route/g")
const grabAllCustomers = require("./routes/dashboard-routes/grabAllCustomers")


const app = express()

// Socket IO instances
const server = http.createServer(app)
const io = new Server(server);
const db = mongoose.connection


// Middle wares
app.use(cors({origin:"*"}))
app.use(express.json({limit:"15mb"}))
app.use(morgan("dev"))


// Routes
// Create Vendor Account Route
app.use("/api/create-account",createAccountRoute)
// Login Vendor Account Route
app.use("/api/login-account",loginAccountRoute)
// Edit Profile Picture Route
app.use("/api/edit-profile-picture",editProfilePictureRoute)
// Edit Banner Picture Route
app.use("/api/edit-banner-picture",editBannerPictureRoute)
// Post product Route
app.use("/api/post-product",addProductRoute)
// Get products Route
app.use("/api/get-products",getProductsRoute)
// Post Video
app.use("/api/post-video",postVideoRoute)
// Get Videos
app.use("/api/get-videos",getVideoRouter)
// Get Product for Buyers
app.use("/api/get-buyers-products",getProductsForBuyers)
// Get New Arrivals for Buyers
app.use("/api/get-new-arrivals",getNewArrivals)
// Get One Product
app.use("/api/get-one-product",getOneProduct)
// Get All Videos Route
app.use("/api/get-all-videos",getAllVideosRoute)
// Register User
app.use("/api/register-user",registerUserRoute)
// Login User
app.use("/api/login-user",loginUserRoute)
// Edit User Profile Image
app.use("/api/edit-user-profile-image",editUserProfileImageRoute)
// Orders route
app.use("/api/make-order",ordersRoute)

// Search Products Route 
// app.use("/api/search-products",searchProductsRoute)
app.use("/api/search-products",require("./routes/fullTextSearchRoute"))
//Full Text algorithm
// app.use("/api/full-text-search",require("./routes/fullTextSearchRoute"))

// Get Products by categoryName
app.use("/api/get-products-by-category",specificCategoryProductsRoute)
// Get Random 15 category elements
app.use("/api/get-random-category-elements",require("./routes/getRandomCategoryElements"))
// Get Related Products
app.use("/api/get-related-items",getRelatedItems)
// Get Sub Related Products (Specific)
app.use("/api/get-sub-category-related-items",getSubCategoryRecommendedItems)
// Send SMS
app.use("/api/send-sms",SMSRoute)
// Search Product for Video
app.use("/api/search-product-for-video",searchProductForVideoRoute)
// Get Profile for video
app.use("/api/get-profile-for-video",getProfileForVideoRoute)
// Get vendor Packages info
app.use("/api/get-vendor-packages-details",getVendorPackagesDetails)
// Get Vendor of Products
app.use("/api/get-vendor-of-products",getVendorOfProducts)
// Get Vendor Info from Token
app.use("/api/get-vendor-info-from-token",require("./routes/getVendorInfoFromToken"))
// Save Token
app.use("/api/save-expo-token",saveUserExpoNotificationToken)
// Get all expo tokens
app.use("/api/get-all-expo-tokens",getAllExpoTokens)
// Get vendor orders
app.use("/api/get-vendor-orders",getVendorOrdersRoute)
// Get order details
app.use("/api/get-order-details",getOrderDetails)
// Get vendor products for video main screen
app.use("/api/get-vendor-products-for-video-main-screen",getVendorProductsForVideoMainScreen)
// Count Vendor Products And Videos
app.use("/app/count-vendor-product-and-video",require("./routes/countVendorProductsAndVideos"))
// Get vendor videos for video main screen
app.use("/api/get-vendor-video-for-videos-main-screen",getVendorVideosForVideoMainScreen)
// Post product review
app.use("/api/post-product-review",postProductReviewRoute)
// Get product review
app.use("/api/get-product-review",getProductReviewRoute)
// Forgot password (POST)
app.use("/api/forgot-password-post",forgotPasswordPost)
// Forgot password (ConfirmAndUpdate)
app.use("/api/forgot-password-confirm-and-update",forgotPasswordConfirmAndUpdate)
// Update Product
app.use("/api/update-product",updateProductRoute)
// Subscribe
app.use("/api/subscribe-to-vendor",subscribeToAVendor)
// Check subscription route
app.use("/api/check-subscription-route",checkSubscriptionRoute)
// Count subscribers 
app.use("/api/count-subscribers",countSubscribers)
// Post video likes
app.use("/api/post-video-likes",videoLikesRoute)
// Count video Likes
app.use("/api/count-video-likes",videoLikesCount)
// Unlike a video
app.use("/api/unlike-video-route",unlikeVideoRoute)
// Unsubscribe to a vendor
app.use("/api/unsubscribe-vendor",unsubscribeToVendor)
// Delete product
app.use("/api/delete-product",deleteProduct)
// Grab images for reviews
app.use("/api/get-buyer-images-for-reviews",getBuyerImagesForReviews)
// Get buyer information for vendor orders page
app.use("/api/get-buyer-information-for-orders",getBuyerInformationForOrders)
// Update order status
app.use("/api/update-order-status",updateOrderStatus)
// Get orders for buyer
app.use("/api/get-orders-for-buyer",getOrdersForBuyer)
// Update order payment status
app.use("/api/update-order-payment-status",updateOrderPaymentStatus)
// Check vendor verification
app.use("/api/check-vendor-verification",checkVendorVerification)
// Verify vendor
app.use("/api/verify-vendor",verifyVendorRoute)
// Get video for editing
app.use("/api/get-video-for-editing",getVideoForEditingRoute)
// Edit video Route
app.use("/api/edit-video-object-route",editVideoObjectRoute)
// Delete video Route
app.use("/api/delete-video",deleteVideo)
// Delete account route (mobile)
app.use("/api/account-deletion",deleteAccount)
// Delete account route (vendor)
app.use("/api/account-deletion-vendor",deleteAccountVendor)
// Complain about product
app.use("/api/complain-about-product",productComplainRoute)
// Vendor edit Profile
app.use("/api/vendor-edit-profile",vendorEditProfileRoute)
// Search vendors
app.use("/api/search-vendors",searchVendorsRoute)
// Google Sign And Signup page
app.use("/api/google-sign-up-sign-in-route",googleSignUpAndSignInRoute)

// Get Vendor Email
app.use("/api/get-vendor-email",require("./routes/getVendorEmail"))

// Get vendor info on message screen
app.use("/api/getVI",require("./routes/getVendorInfoInMessageScreen"))
// Get Cus info on message screen
app.use("/api/getCI",require("./routes/getCustomerInfoInMessageScreen"))
// Add expo token without checking
app.use("/api/add-free-token",addExpoTokenRoute)


// EXPO PUSH NOTIFICATION
app.use("/api/expo-push-notification",sendPushNotifications)

// Get hot sales
app.use("/api/get-hot-sales",getHotSales)



// DASHBOARD routes
// Get all orders
app.use("/api/dashboard-get-all-orders",dashboardGetOrders)
// Get one order
app.use("/api/dashboard-get-one-order",dashboardGetOrdersOne)
// Search orders
app.use("/api/dashboard-search-orders",dashboardSearchOrders)
// Get all vendors
app.use("/api/get-all-vendors",dashboardGetAllVendors)
// Get Documents info
app.use("/api/get-vendor-documents",dashboardGetVendorDocuments)
// Verify or unverify vendor
app.use("/api/verify-or-unverify-vendor",dashboardVerifyOrUnverifyVendor)
// Analytics
app.use("/api/analytics",dashboardGetAnalytics)
// Get all customers
app.use("/api/get-all-customers", getAllCustomers) 
// Grab all customers
app.use("/api/grab-all-customers",grabAllCustomers)
// Out of stock
app.use("/api/out-of-stock",require("./routes/outOfStockRoute"))


// MESSAGES ALERT SYSTEM
app.use("/api/message/alert-user",require("./routes/messages/alertUser"))
app.use("/api/message/alert-vendor",require("./routes/messages/alertVendor"))




//Full Text algorithm
app.use("/api/full-text-search",require("./routes/fullTextSearchRoute"))


// ADMIN RESET
app.use("/api/admin-reset-password",require("./routes/adminResetPassword"))
app.use("/api/admin/short-url-config",require("./routes/admin/short-url-config"))
app.use("/api/admin/vendor-short-url-config",require("./routes/admin/vendor-short-url-config"))

// Product short URL resolve
app.use("/api/resolve-product-short-path",require("./routes/resolve-product-short-path"))

// Resolve Vendor shortURL
app.use("/api/resolve-vendor-short-path",require("./routes/resolve-vendor-short-url"))


// Google Merchant DB update
app.use("/api/admin-google-merchant",require("./routes/google-merchant/update-models"))

// Google Feed
app.use("/api/google-feed",require("./routes/googleFeed"))

 
// Calculate Delivery Price
app.use("/api/calculate-delivery-price",require("./routes/calculateDeliveryPrice"))


// Report vendor
app.use("/api/report-vendor",require("./routes/messages/vendorReportRoute"))

// Connect To Database 
connectToDatabase()

const PORT = process.env.PORT
server.listen(PORT,()=>{
    console.log(`Server Running....`)
})
