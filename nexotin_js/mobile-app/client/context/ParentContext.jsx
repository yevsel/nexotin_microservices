import { createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addProducts,addVideos,refreshPage,storeUserObject } from '../Actions';
import { storeIntoRAM,storePushToken,addCategoriesData } from '../Actions';
import { useDispatch,useSelector } from 'react-redux';
import React,{useEffect,useState,useRef,useCallback} from 'react'
// import ca
export const ParentContext = createContext({info:"name"})

export function ParentContextProvider ({children}){
    
    // console.log("This is the Context")
    const dispatch = useDispatch()
    const [showBottomNavigation,setShowBottomNavigation] = useState(false)
    const [productsData,setProductsData] = useState([])
    const [categoriesProductsData,setCategoriesProductsData] = useState([])
    const [loadingProducts,setLoadingProducts] = useState(true)
    const [categoriesProductsLoading,setCategoriesProductsLoading] = useState(false)
    const [fetchMoreData,setFetchMoreData] = useState(true)
    const [fetchMoreCategoryData,setFetchMoreCategoryData] = useState(true)
    const [videos,setVideos] = useState([])
    const [loadingVideos,setLoadingVideos] = useState(true)
    const [loggedIn,setLoggedIn] = useState(true)
    const [inVideoScreen,setInVideoScreen] = useState(false)
    
    const [blockedProducts,setBlockedProducts] = useState([])
    
    const [refreshPage,setRefreshPage] = useState(true)
    
    const [refreshProfile,setRefreshProfile] = useState(true)
    
    const productsReducer = useSelector(state=>state.productsReducer)
    
    const [receiverEmail,setReceiverEmail] = useState("")

    // Get Products
    const getProducts =useCallback(async()=>{
        setLoadingProducts(true)
        let dateToSend = null
        if(productsReducer.length===0){
            dateToSend = Date.now()
        }else{
            dateToSend = productsReducer[productsReducer.length-1].createdAt
        }
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-buyers-products",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({createdAt:dateToSend})
            })
            const data = await response.json()  
            
            // const data = []

              AsyncStorage.getItem("blockedProducts").then((blockedProductsData)=>{
                const blockedProducts = JSON.parse(blockedProductsData)
                
                const filtered = data.msg.filter(item=>{
                    if(!blockedProducts.includes(item._id)){
                        return item
                    }
                })
                
                dispatch(addProducts([...productsReducer,...filtered]))
              }).catch(err=>console.log(err))
              
              dispatch(addProducts([...productsReducer,...data.msg]))
            if(data.msg.length<5){
                setFetchMoreData(false) 
            }else{
                setFetchMoreData(true)
            }
            setLoadingProducts(false)
        } catch (error) {
            console.log("GET PRODUCT ERROR",error)
            setLoadingProducts(false)
        }
    },[productsReducer])

    // Get Products by category
    const getProductsByCategory = async(obj)=>{
        try {
            setCategoriesProductsLoading(true)
            let dateToSend = null
            if(categoriesProductsData.length===0){
                dateToSend = Date.now()
            }else{
                dateToSend = categoriesProductsData[categoriesProductsData.length-1].createdAt
            }
            let dataToSend = {
              categoryName:obj.categoryName,
              specificCategory:obj.specificCategory,
              from:obj.from,
              to:obj.to,
              gender:obj.gender,
              createdAt:dateToSend
            }
            if(!Object.values(dataToSend).includes(undefined)){
              
              // console.log("OTS",dataToSend)
              
              const responseFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-products-by-category",{
                  method:"POST",
                  headers:{"Content-Type":"application/json"},
                  body:JSON.stringify(dataToSend)
              })
              
              const result = await responseFromDB.json()
              AsyncStorage.getItem("blockedProducts").then((blockedProductsData)=>{
                const blockedProducts = JSON.parse(blockedProductsData)
                const filtered = result.msg.filter(item=>{
                    if(!blockedProducts.includes(item._id)){
                        return item
                    }
                })

                setCategoriesProductsData([...categoriesProductsData,...filtered])
              }).catch(err=>console.log(err))
              if(result.msg.length<5){
                  setFetchMoreCategoryData(false) 
              }else{
                  setFetchMoreCategoryData(true)
              }
              setCategoriesProductsLoading(false)
            }
            // console.log(result)
        } catch (error) {
            Alert.alert('Products fetching', 'Network error please try again', [
                {text: 'OK', onPress: () => {}},
            ]);
            setCategoriesProductsLoading(false)
        }
    }
    
    
    const getProductsByCategoryForHome = useCallback(async (obj) => {
      try {
        let dataToSend = {
          categoryName: obj.categoryName,
          specificCategory: obj.specificCategory,
          from: obj.from,
          to: obj.to,
          gender: obj.gender,
          createdAt: Date.now()
        };
    
        if (!Object.values(dataToSend).includes(undefined)) {
          const responseFromDB = await fetch(
            process.env.EXPO_PUBLIC_SERVER_ROUTE + "/api/get-products-by-category",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dataToSend)
            }
          );
          const result = await responseFromDB.json();
    
          // Await the AsyncStorage result properly
          const blockedProductsData = await AsyncStorage.getItem("blockedProducts");
          const blockedProducts = JSON.parse(blockedProductsData) || [];
    
          const filtered = result.msg.filter(item => {
            return !blockedProducts.includes(item._id);
          });
    
          return filtered; // ✅ Now we properly RETURN the filtered data
        }
      } catch (error) {
        Alert.alert('Products fetching', 'Network error please try again', [
          { text: 'OK', onPress: () => {} },
        ]);
      }
    }, []);
    
    
    useEffect(()=>{
        getProducts()
    },[])
    
    
    
    useEffect(()=>{
        try {
          AsyncStorage.getItem("userAccountObject").then(userData=>{
            if(userData!==null){
              dispatch(storeUserObject(JSON.parse(userData)))
            }
          }).catch(err=>console.log("STORING USER ERROR",err)) 
          
          // Create object to store blocked products
          AsyncStorage.getItem("blockedProducts").then(blockedProducts=>{
            if(blockedProducts===null){
              AsyncStorage.setItem("blockedProducts",JSON.stringify([]))
            }
            
            }).catch(err=>console.log("ERR",err))
            
          // Create object to store blocked videos
          AsyncStorage.getItem("blockedVideos").then(blockedVideos=>{
            if(blockedVideos===null){
              AsyncStorage.setItem("blockedVideos",JSON.stringify([]))
            }
            
            }).catch(err=>console.log("ERR",err))
        } catch (error) {
          console.log("ERR",error)
        }
      },[])
    
    
    const [allMessages,setAllMessages] = useState([])
    const [dialogue,setDialogue] = useState([])
  
  
    const [messageParameters,setMessageParameters] = useState()
    const parentContextObject={
      setLoggedIn,
      loggedIn,
      loadingProducts,
      fetchMoreData,
      getProducts,
      setShowBottomNavigation,
      setCategoriesProductsData,
      categoriesProductsData,
      fetchMoreCategoryData,
      categoriesProductsLoading,
      categoriesProductsData,
      getProductsByCategory,
      refreshPage,
      setRefreshPage,
      refreshProfile,
      setRefreshProfile,
      setInVideoScreen,
      // getVideos,
      videos,
      getProductsByCategoryForHome,
      receiverEmail,
      setReceiverEmail,
      messageParameters,
      setMessageParameters,
      
      allMessages,
      setAllMessages,
      dialogue,
      setDialogue
    }
    

    return(
        <ParentContext.Provider value={parentContextObject}>
            {children}
        </ParentContext.Provider>
    )
}