export const saveOrderDetails = (data)=>{
    return{
        type:"SAVE_ORDER_DETAILS",
        payLoad:data
    }
}
export const emptyBasket = ()=>{
    return{
        type:"EMPTY_BASKET"
    }
}
export const storeUserObject = (data)=>{
    return{
        type:"STORE_USER_OBJECT",
        payLoad:data
    }
}

export const addItemToFavorite = (data)=>{
    return{
        type:"ADD_TO_FAVORITE",
        payLoad:data
    }
}
export const addProducts = (data)=>{
    return{
        type:"ADD_TO_PRODUCT",
        payLoad:data
    }
}
export const addVideos = (data)=>{
    // console.log("DATA",data)
    return{
        type:"ADD_VIDEOS",
        payLoad:data
    }
}
export const addToSelectedProducts = (data)=>{
    return{
        type:"ADD_TO_SELECTED_PRODUCTS",
        payLoad: data,
    }
}

export const decreaseProductQuantity = (index)=>{
    return{
        type:"DECREASE_PRODUCT_QUANTITY",
        payLoad:index
    }
}

export const increaseProductQuantity = (index)=>{
    return{
        type:"INCREASE_PRODUCT_QUANTITY",
        payLoad:index
    }
}

export const deleteProduct = (index)=>{
    return{
        type:"REMOVE_PRODUCT",
        payLoad:index
    }
}

export const storeIntoRAM = (payLoad)=>{
    return{
        type:"STORE_INTO_RAM",
        payLoad:payLoad
    }
}

export const removeProductAddedToBlockedProducts = (id)=>{
    return{
        type:"REMOVE_PRODUCT_ADDED_TO_BLOCKED_PRODUCTS",
        payLoad:id
    }
}

export const removeVideoAddedToBlockedVideos = (id)=>{
    return{
        type:"REMOVE_VIDEO_ADDED_TO_BLOCKED_VIDEOS",
        payLoad:id
    }
}

export const acceptTermsAndConditions = (data)=>{
    return{
        type:"ACCEPT_TERMS_AND_CONDITIONS",
        payLoad:data
    }
}

export const refreshPage = ()=>{
    return{
        type:"REFRESH_PAGE"
    }
}

export const storePushToken = (token)=>{
    return {
        type:"SAVE_PUSH_TOKEN",
        payLoad:token
    }
}

export const setAllowAppAccess=()=>{
    return {
        type:"ALLOW_APP_ACCESS"
    }
}

export const addMessage=(message)=>{
    return{
        type:"ADD_MESSAGE",
        payLoad:message
    }
}

export const addVendorToAllMessages=(vendorInfo)=>{
    return{
        type:"ADD_VENDOR_TO_ALL_MESSAGES",
        payLoad:vendorInfo
    }
}

export const enableCanSearchVendorAccountSwitch=()=>{
    return{
        type:"ENABLE_CAN_SEARCH",
        payLoad:true
    }
}
export const disableCanSearchVendorAccountSwitch=()=>{
    return{
        type:"DISABLE_CAN_SEARCH",
        payLoad:false
    }
}

export const addSelectedVendorToChat=(state)=>{
    return{
        type:"ADD_SELECTED_VENDOR_TO_CHAT",
        payLoad:state
    }
}

export const addVendorMessageToMessages=(state)=>{
    return{
        type:"ADD_VENDOR_MESSAGE_TO_MESSAGES",
        payLoad:state
    }
}

export const addBulkMessages=(state)=>{
    return{
        type:"ADD_BULK_MESSAGES",
        payLoad:state
    }
}
export const resetMessages = ()=>{
    return{
        type:"RESET_MESSAGES"
    }
}

export const addBulkVendorDetails=(state)=>{
    return{
        type:"ADD_BULK_VENDOR_DETAILS",
        payLoad:state
    }
}

export const emptyVendorMessages = ()=>{
    return{
        type:"EMPTY_VENDOR_MESSAGES"
    }
}

export const removeUserObject= ()=>{
    return{
        type:"REMOVE_USER_OBJECT"
    }
}

export const addCategoriesData=(data)=>{
    return{
        type:"STORE_CATEGORIES_DATA",
        payload:data
    }
}

export const removeCategoriesData=()=>{
    return{
        type:"REMOVE_CATEGORIES_DATA"
    }
}