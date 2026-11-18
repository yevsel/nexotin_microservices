
import { useEffect,useState,useMemo,useRef,useCallback, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './stacks/HomeStack';
import { Dimensions, View } from 'react-native';
import {VideoStack} from "./stacks/VideoStack"
import { AppRegistry,Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { COLORS } from '../client/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import {useFonts} from "expo-font"
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import * as Linking from "expo-linking"
import SavedProductsStack from './stacks/SavedProductsStack';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingAndSignInStack from './stacks/OnboardingAndSignInStack';
import ProfileStack from './stacks/ProfileStack';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch,useSelector } from 'react-redux';
import { addProducts,addVideos,storeUserObject } from '../client/Actions';
import { storeIntoRAM,storePushToken } from '../client/Actions';
import { MessagesStack } from './stacks/MessagesStack';
import Feather from '@expo/vector-icons/Feather';
import { supabaseClient } from '../client/utils/supabase-client';
import { ParentContext } from '../client/context/ParentContext';
// import { useSelector } from 'react-redux';
// import Octicons from '@expo/vector-icons/Octicons';
SplashScreen.preventAutoHideAsync();


const Tab = createBottomTabNavigator();


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function MainAppScreen() {

  const messagesReducer = useSelector(state=>state.messagesReducer)
  const [fontsLoaded] = useFonts({
    "Mortend":require("./assets/fonts/SpaceGrotesk.otf"),
    "Poppins":require("./assets/fonts/Poppins-Regular.ttf"),
    "PoppinsBold":require("./assets/fonts/Poppins-Bold.ttf"),
    })
    
    const dispatch = useDispatch()
    const productsReducer = useSelector(state=>state.productsReducer)
    // const videosReducer = useSelector(state=>state.videosReducer)
    

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
    
    
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    
    const [messagesCount,setMessagesCount] = useState(null)
    
    const showScreen = async()=>{
      await SplashScreen.hideAsync();
    }

    
    const getProducts =useCallback(async()=>{
      setLoadingProducts(true)
      let dateToSend = null
      if(productsReducer.length===0){
          dateToSend = Date.now()
      }else{
          dateToSend = productsReducer[productsReducer.length-1].createdAt
      }
      try {
          // const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-buyers-products",{
          //     method:"POST",
          //     headers:{"Content-Type":"application/json"},
          //     body:JSON.stringify({createdAt:dateToSend})
          // })
          // const data = await response.json()
          data=[]
            AsyncStorage.getItem("blockedProducts").then((blockedProductsData)=>{
              const blockedProducts = JSON.parse(blockedProductsData)
              
              const filtered = data.msg.filter(item=>{
                  if(!blockedProducts.includes(item._id)){
                      return item
                  }
              })
              
              dispatch(addProducts([...productsReducer,...filtered]))
            }).catch(err=>console.log(err))
            
            // dispatch(addProducts([...productsReducer,...data.msg]))
          if(data.msg.length<5){
              setFetchMoreData(false) 
          }else{
              setFetchMoreData(true)
          }
          setLoadingProducts(false)
      } catch (error) {
          console.log("GET PRODUCT ERROR",error.message)
          setLoadingProducts(false)
      }
  },[productsReducer])
  
  // Get Videos
  const getVideos =useCallback(async()=>{
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-all-videos")
      const data = await response.json()
      //   dispatch(addVideos(data.msg))
      AsyncStorage.getItem("blockedVideos").then((blockedVideosData)=>{
        const blockedVideos = JSON.parse(blockedVideosData)
        
        const filtered = data.msg.filter(item=>{
            if(!blockedVideos.includes(item._id)){
                return item
            }
        })
        
        setVideos([...videos,...filtered])
        // dispatch(addProducts([...productsReducer,...filtered]))
      }).catch(err=>console.log(err))
      // console.log("VIDEOS",data)
    } catch (error) {
      console.log("GET VIDEO ERROR",error.message)
    }
  },[videos])
  
  // Get Products by category
  const getProductsByCategory = useCallback(async(obj)=>{
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
        console.log("OBJECT TO SEND LAST",dataToSend)
        if(!Object.values(dataToSend).includes(undefined)){
        
          
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
          // setCategoriesProductsData([...categoriesProductsData,...result.msg])
          setCategoriesProductsLoading(false)
        }
        // console.log(result)
    } catch (error) {
        Alert.alert('Products fetching', 'Network error please try again', [
            {text: 'OK', onPress: () => {}},
        ]);
        setCategoriesProductsLoading(false)
    }
},[categoriesProductsData])

  useEffect(()=>{
  
    const storeTokenFree = async(pushToken)=>{
      console.log("FREE ADDITION",pushToken)
      try {
        let d = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/add-free-token",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({expoToken:pushToken,role:"mobile"})
        })
        let m = await d.json()
        console.log("RESULT FROM FREE",m)
      } catch (error) {
        console.log("ERROR",error)
      }
    }
    
    const storeTokenInServer = async(pushToken)=>{
      AsyncStorage.getItem("userToken").then(async(userToken)=>{
        console.log("USER TOKEN",userToken)
          if(userToken){
              let d = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/save-expo-token",{
            // let d = await fetch("http://127.0.0.1:4500/api/save-expo-token",{
              method:"POST",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":`Bearer ${JSON.parse(userToken)}`
              },
              body:JSON.stringify({expoToken:pushToken,role:"mobile"})
          }
        )
        let m = await d.json()
            console.log('EXPO FROM MAIN',m)
          }else{
              console.log("NO TOKEN")
              }
            })
      }
  
    AsyncStorage.getItem("cartItems").then(cartItems=>{
      if(cartItems===null){
        AsyncStorage.setItem("cartItems",JSON.stringify([]))
      }else{
        dispatch(storeIntoRAM(JSON.parse(cartItems)))
      }
      }
    ).catch(err=>console.log("er",err))
  
    // getProducts() 
    getVideos()
    showScreen()
    // getAccountObject()

    registerForPushNotificationsAsync().then(token => {
        setExpoPushToken(token)
        dispatch(storePushToken(token.data))
        storeTokenInServer(token.data)
        storeTokenFree(token.data)
        // AsyncStorage.setItem("expoPushToken",JSON.stringify(token.data))
      });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification)});
      
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    
  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  };
    
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

if(!fontsLoaded){
  return null
}


if(!loggedIn){
  return (
      <NavigationContainer>
        <OnboardingAndSignInStack setLoggedIn={setLoggedIn}/>
      </NavigationContainer>
  )
}


const linking = {
  prefixes: [
    Linking.createURL('/'), // Expo Go prefix
    'nexotin-scheme://',    // Custom scheme
    'https://nexotin.com'   // Web links
  ],
  config: {
    screens: {
      HOME:{
        screens:{
          HomeScreen:"/",
          ViewProductMainScreen: 'product/:id'
        }
      }
    },
  },
};


  const {height} = Dimensions.get("window")
  return (
    <GestureHandlerRootView style={{flex:1}}>
        <NavigationContainer linking={linking} >
        <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: COLORS.redOrange,
              tabBarInactiveTintColor: COLORS.secondary,
              tabBarStyle: {
                backgroundColor: "white",
                
              },
              tabBarHideOnKeyboard: true
            }}>
            {/* Home Stack */}
            <Tab.Screen
              name="HOME"
              options={{
                tabBarStyle:{
                  backgroundColor:"white",
                },
                tabBarIcon: ({ focused, color, size }) => (
                  <Octicons name="home" size={24} color={color} />
                ),
              }}
              children={() => (
                <HomeStack
                  fetchMoreCategoryData={fetchMoreCategoryData}
                  categoriesProductsLoading={categoriesProductsLoading}
                  categoriesProductsData={categoriesProductsData}
                  setCategoriesProductsData={setCategoriesProductsData}
                  getProductsByCategory={getProductsByCategory}
                  getProducts={getProducts}
                  setShowBottomNavigation={setShowBottomNavigation}
                  fetchMoreData={fetchMoreData}
                  productsData={productsData}
                  loadingProducts={loadingProducts}
                  setLoggedIn={setLoggedIn}
                />
              )}
            />
            {/* Video Stack */}
            <Tab.Screen
              name="VIDEOS"
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <Octicons name="device-camera-video" size={25} color={color} />
                ),
              }}
              children={() => (
                <VideoStack setLoggedIn={setLoggedIn} setInVideoScreen={setInVideoScreen} getVideos={getVideos} videos={videos} />
              )}
            />
            {/* Messages Stack */}
            <Tab.Screen
              name="MESSAGES"
              options={{
                tabBarBadge:messagesCount===null?0:messagesCount,
                tabBarIcon: ({ focused, color, size }) => (
                  <Feather name="mail" size={24} color={color} />
                ),
              }}
              children={()=><MessagesStack loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}
            />
            {/* <Tab.Screen
              name="FAVORITE"
              options={{
                tabBarIcon: ({ focused, color, size }) => (
                  <FontAwesome name="bookmark-o" size={22} color={color} />
                ),
              }}
              component={SavedProductsStack}
            /> */}
            <Tab.Screen
              name="PROFILE"
              options={{
                // tabBarShowLabel: true,
                tabBarIcon: ({ focused, color, size }) => (
                  <MaterialIcons name="account-circle" size={27} color={color} />
                ),
              }}
              children={() => <ProfileStack setLoggedIn={setLoggedIn} setShowBottomNavigation={setShowBottomNavigation} />}
            />
          </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}


  // GET NOTIFICATION PERMISSION
  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return; 
      }
      token = await Notifications.getExpoPushTokenAsync(
        {
          projectId: "1ab7aaff-5e04-48b5-84b6-afbb2cbf7300"
        }
      );


    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token;
  }
