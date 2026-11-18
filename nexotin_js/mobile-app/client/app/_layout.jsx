import 'react-native-url-polyfill'
import { Linking } from 'react-native';
import React,{useEffect,useState,useRef} from 'react'
import { router, Stack } from 'expo-router'
import { ParentContextProvider } from '../context/ParentContext'
import {useFonts} from "expo-font"
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch,useSelector } from 'react-redux';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducers from '../Reducers';
import TopBasket from '../components/TopBasket'
import GoBack from '../components/GoBack'
import GoBackp from '../components/GoBackp';
// import InternetStatus from '../components/InternetStatus';
// ExponentPushToken[hCmOIYJ_yd0Yk7gWJdvRfJ]
// import * as Network from 'expo-network';


const store = createStore(allReducers)

SplashScreen.preventAutoHideAsync();




Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  
  function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }
  
  async function registerForPushNotificationsAsync() {

    if (Device.isDevice) {
      console.log("Checking")
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId = "1ab7aaff-5e04-48b5-84b6-afbb2cbf7300"
      // console.log("REGISTRATION ID")
      if (!projectId) {
        handleRegistrationError('Project ID not found');
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log("STRING",pushTokenString);
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError('Must use physical device for push notifications');
    }
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
      
      
    
  }
  

const RootLayout = () => {

  // useEffect(() => {
  //   const handleDeepLink = (event) => {
  //     const { url } = event;
  //     const params = new URL(url).searchParams;
  //     const id = params.get('id');
  //     console.log('Received deep link with id:', id);
  //   };
  
  //   // Listen for deep links
  //   Linking.addEventListener('url', handleDeepLink);
  
  //   return () => {
  //     Linking.removeEventListener('url', handleDeepLink);
  //   };
  // }, []);
  
  
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(undefined);
    const notificationListener = useRef()
    const responseListener = useRef()
    const [fontsLoaded] = useFonts({
        "Mortend":require("../assets/fonts/SpaceGrotesk.otf"),
        "Poppins":require("../assets/fonts/Poppins-Regular.ttf"),
        "PoppinsBold":require("../assets/fonts/Poppins-Bold.ttf"),
        })
    useEffect(() => {
      registerForPushNotificationsAsync()
      .then(token => {
        // console.log("TOKEN",token)
        // sendPushNotification(token)
        setExpoPushToken(token ?? '')}
      )
      .catch((error) => setExpoPushToken(`${error}`));
      
      
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          console.log("NOTIFICATION",response.notification.request.trigger.payload.body)
          router.push(response.notification.request.trigger.payload.body.url)
        });
    
        return () => {
          notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
          responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
      }, []);


    const showScreen = async()=>{
        await SplashScreen.hideAsync();
    }

    useEffect(()=>{
        showScreen()
    },[])
    
    
    
    
if(!fontsLoaded){
    return null
  }
  
    

  return (
    <GestureHandlerRootView style={{flex:1}}>
      <Provider store={store}>
        <ParentContextProvider>
            <Stack screenOptions={{headerShown:false}}>
                <Stack.Screen name='(tabs)'/>
                <Stack.Screen name='shop/p/[id]' options={{
                  headerShown: true, 
                  headerBackTitleVisible: false,
                  headerTitle:"",
                  headerBackVisible:false,
                  headerTransparent:true,
                  headerRight: () => <TopBasket />,
                  headerLeft: () => <GoBack />,
                  }} />
                <Stack.Screen name='shop/products/[id]' options={{
                  headerShown: true, 
                  headerBackTitleVisible: false,
                  headerTitle:"",
                  headerBackVisible:false,
                  headerTransparent:true,
                  headerRight: () => <TopBasket />,
                  headerLeft: () => <GoBackp/>,
                  }} />
                <Stack.Screen name='vendorProfile' options={{
                  headerShown:true,
                  headerBackTitleVisible: false,
                  headerTitle:"",
                  headerTransparent:true,
                  headerLeft:()=>(<GoBack/>)
                }}/>
                <Stack.Screen name='(onboarding)'/>
                <Stack.Screen name='specificProductCategoryScreen' options={{
                  headerShown: true, 
                  headerBackTitleVisible: false,
                  headerTitle:"",
                  headerBackVisible:false,
                  headerTransparent:true,
                  headerRight: () => <TopBasket />,
                  headerLeft: () => <GoBack />,
                  }} />
            </Stack>
            
        </ParentContextProvider>
      </Provider>
    </GestureHandlerRootView>
  )
}

export default RootLayout

