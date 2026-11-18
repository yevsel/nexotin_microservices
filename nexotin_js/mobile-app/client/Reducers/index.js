import { combineReducers } from "redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import NetInfo from '@react-native-community/netinfo';


const favoritesArray = []
const productsArray=[]
const newArrivals=[]
const selectedProducts=[]
const videos=[]
const userObject = {}
const orderDetailsToSend = []
const acceptTermsAndConditions = false
const refreshPage = false
const expoPushToken = ""
const messages =[

    {
        _id: 2,
        text: 'Messages will be deleted in 1 week time',
        createdAt: new Date(),
        system: true,
    }
  ]

const allMessages = [
    
]

const allowAppAccess = false

const enableCanSearchVendorAccount = false


const categoriesData = []


const enableCanSearchVendorAccountReducer = (state=enableCanSearchVendorAccount,action)=>{
    switch(action.type){
        case "ENABLE_CAN_SEARCH":
            return true
        case "DISABLE_CAN_SEARCH":
            return false
        default:
            return state
    }
}


const selectedVendorToChat = {}

const selectedVendorToChatReducer = (state=selectedVendorToChat,action)=>{
    switch(action.type){
        case "ADD_SELECTED_VENDOR_TO_CHAT":
            return action.payLoad
        default:
            return state
    }
}


const allVendorMessagesReducer = (state = allMessages, action) => {
    switch (action.type) {
        case "EMPTY_VENDOR_MESSAGES":
            return []
        case "ADD_BULK_VENDOR_DETAILS":
            return [...action.payLoad]
      case "ADD_VENDOR_MESSAGE_TO_MESSAGES":
        // Assuming each message has a unique 'id'
        const exists = state.some(message => message.id === action.payLoad.id);
        
        // If the message doesn't exist, add it to the state
        if (!exists) {
          return [action.payLoad, ...state];
        }
        return state;
  
      default:
        return state;
    }
  };
  

const messagesReducer = (state=messages,action)=>{
    switch(action.type){
        case "ADD_BULK_MESSAGES":
            // console.log("BULK",action)
            return [...action.payLoad,...state]
        case "ADD_MESSAGE":
            return [action.payLoad,...state]
        case "RESET_MESSAGES":
            console.log("RESET")
            return [
                {
                    _id: 2,
                    text: 'Messages will be deleted in 1 week time',
                    createdAt: new Date(),
                    system: true,
                }
            ]
        default:
            return state
    }
}

const allowAppAccessReducer = (state=allowAppAccess,action)=>{
    switch(action.type){
        case "ALLOW_APP_ACCESS":
            return true
        default:
            return state
    }
}

const expoPushTokenReducer = (state=expoPushToken,action)=>{
    switch(action.type){
        case "SAVE_PUSH_TOKEN":
            console.log("PUSH TOKEN RECEIVED REDUCER",action.payLoad)
            return action.payLoad
        default:
            return state
    }
}

const refreshPageReducer = (state=refreshPage,action)=>{
    switch(action.type){
        case "REFRESH_PAGE":
            return !state
        default:
            return state
    }
}


const acceptTermsAndConditionsReducer = (state=acceptTermsAndConditions,action)=>{
    switch(action.type){
        case "ACCEPT_TERMS_AND_CONDITIONS":
            return action.payLoad
        default:
            return state
    }
}

const orderDetailsToSendReducer = (state=orderDetailsToSend,action)=>{
    switch(action.type){
        case "SAVE_ORDER_DETAILS":
            return action.payLoad
        default:
            return state
    }
}

const userObjectReducer = (state=userObject,action)=>{
    switch(action.type){
        case "REMOVE_USER_OBJECT":
            return{}
        case "STORE_USER_OBJECT":
            // console.log("STORING USER OBJECT",action.payLoad)
            return action.payLoad
        default:
            return state
    }
}

const favoriteReducer = (state=favoritesArray,action)=>{
    switch (action.type) {
        case "ADD_TO_FAVORITE":
            return [...state,action.payLoad]
        default:
            return state
    }
}

const videosReducer = (state=videos,action)=>{
    switch(action.type){
        case "ADD_VIDEOS":
            return [...action.payLoad]
        case "REMOVE_VIDEO_ADDED_TO_BLOCKED_VIDEOS":
            // console.log("PAYLOAD",action.payLoad)
            const filtered = state.filter(item=>item._id!==action.payLoad)
            return [...filtered]
        default:
            return state
    }
}
const productsReducer = (state=productsArray,action)=>{
    switch(action.type){
        case "ADD_TO_PRODUCT":
            return [...action.payLoad]
        case "REMOVE_PRODUCT_ADDED_TO_BLOCKED_PRODUCTS":
            const filtered = state.filter(item=>item._id!==action.payLoad)
            return [...filtered]
        default:
            return state        
    }
}


const selectedProductsReducer = (state=selectedProducts,action)=>{
    switch(action.type){
        case "ADD_TO_SELECTED_PRODUCTS":
            // console.log("PAYLOAD",Object.keys(action.payLoad))
            AsyncStorage.setItem("cartItems",JSON.stringify([action.payLoad,...state]))
            return [action.payLoad,...state]
        case "REMOVE_PRODUCT":
            const oldData=[...state]
            oldData[action.payLoad] = null
            const newData = oldData.filter(item=>item!==null)
            AsyncStorage.setItem("cartItems",JSON.stringify([...newData]))
            return [...newData]
        case "INCREASE_PRODUCT_QUANTITY":
            const prevData = [...state]
            const specificData = {...prevData[action.payLoad],quantity:prevData[action.payLoad].quantity+1}
            prevData[action.payLoad]=specificData
            AsyncStorage.setItem("cartItems",JSON.stringify([...prevData]))
            return [...prevData]
        case "DECREASE_PRODUCT_QUANTITY":
            const prevDataToDecrease = [...state]
            const specificDataToDecrease = {...prevDataToDecrease[action.payLoad],quantity:prevDataToDecrease[action.payLoad].quantity-1}
            prevDataToDecrease[action.payLoad]=specificDataToDecrease
            AsyncStorage.setItem("cartItems",JSON.stringify([...prevDataToDecrease]))
            return [...prevDataToDecrease]
        case "EMPTY_BASKET":
            AsyncStorage.setItem("cartItems",JSON.stringify([]))
            return []
        case "STORE_INTO_RAM":
            return [...action.payLoad]
        default:
            return state
    }

}


const categoriesDataReducer = (state = categoriesData, action) => {
    switch (action.type) {
      case "STORE_CATEGORIES_DATA":
        console.log("Total",state.length)
        return [...action.payload];  // ✅ must RETURN something
  
      case "REMOVE_CATEGORIES_DATA":
        console.log("Clearing",state.length)
        return [];  // ✅ clearing to empty array
  
      default:
        return state;  // ✅ always return previous state if action is unknown
    }
  };
  
const allReducers = combineReducers({categoriesDataReducer,expoPushTokenReducer,refreshPageReducer,acceptTermsAndConditionsReducer,favoriteReducer,productsReducer,selectedProductsReducer,videosReducer,userObjectReducer,orderDetailsToSendReducer,allowAppAccessReducer,messagesReducer,allVendorMessagesReducer,enableCanSearchVendorAccountReducer,selectedVendorToChatReducer})

export default allReducers

