import { View, Text,ScrollView,TouchableOpacity,Image,TextInput,StatusBar, Alert} from 'react-native'
import React, { useState,useEffect } from 'react'
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import momo from "../assets/momo.png"
import vodafone from "../assets/vodafone.png"
import airteltigo from "../assets/airteltigo.png"
import mastercard from "../assets/mastercard.png"
import visa from "../assets/visa.png"
import { emptyBasket } from '../Actions';
import { useDispatch ,useSelector} from 'react-redux';
import * as Device from 'expo-device';
import { saveOrderDetails } from '../Actions';
// import { useDispatch } from 'react-redux';
import { Audio } from 'expo-av';
import { router, useLocalSearchParams } from 'expo-router';

const FinalOrderPaymentScreen = () => {

  const dispatch = useDispatch()
  
  const [sound, setSound] = useState();

  const allowAppAccessReducer = useSelector(state => state.allowAppAccessReducer);
  
  // console.log("ALLOW APP ACCESS EE",allowAppAccessReducer)
  
  // useEffect(()=>{
  //   console.log("ALLOW APP ACCESS AA",allowAppAccessReducer)
  // })


  async function playSuccess() {
  //   console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require("../assets/sounds/success.mp3"))
    ;
    setSound(sound);

  //   console.log('Playing Sound');
    await sound.playAsync();
  }
  

  const makeOrder = async(dataToSend)=>{
    try {
        setSendingOrder(true)
        const responseFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/make-order",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(dataToSend)
        })  
        const result = await responseFromDB.json()
        dispatch(emptyBasket())
        Alert.alert("Order",result.msg,[
          {
            text:"OK",
            onPress:()=>{}
          }
        ])
        setSendingOrder(false)
        return result
    } catch (error) {
        console.log(error.message)
        setSendingOrder(false)
    }
  }

  const paymentMode = [
    {
      id:1,
      name:"visa",
      image:visa
    },
    {
      id:2,
      name:"mastercard",
      image:mastercard
    },
    {
      id:3,
      name:"momo",
      image:momo
    },
    {
      id:4,
      name:"vodafone",
      image:vodafone
    },
    {
      id:5,
      name:"airteltigo",
      image:airteltigo
    }
  ]
  
  // const [sendingOrder,setSendingOrder] = useState(true)
  // const enableButton = sendingOrder

  function generateRandomOrderNumber() {
    // Get the current timestamp
    const timestamp = new Date().getTime();
  
    // Generate a random number between 1000 and 9999 (you can adjust this range as needed)
    const randomPart = Math.floor(Math.random() * 9000) + 1000;
  
    // Combine the timestamp and random number to create the order number
    const orderNumber = `${timestamp}${randomPart}`;
  
    return orderNumber;
  }
  
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }



  const getUserJWTToken = ()=>{
    setLoadingScreen(true)
    AsyncStorage.getItem("userToken").then(token=>{
      if(token!=null){
        setUserToken(JSON.parse(token))
        setLoadingScreen(false)
      }
    }
    ).catch(
      setLoadingScreen(false)
    )
  }


  const {
    totalPrice,
    location,
    phoneNumber,
    landmark,
    vendorsInformation,
    products,
    deliveryPrice
} = useLocalSearchParams();

  
  const vendorsEmail = JSON.parse(vendorsInformation).map(item=>{
    if(item.email){
      return item.email
    }
    return item.businessEmail
  })
  const [orderNumber,setOrderNumber] = useState()
  const [userToken,setUserToken] = useState()
  const [loadingScreen,setLoadingScreen] = useState(true)
  const [sendingOrder,setSendingOrder] = useState(false)
  const [makePayment,setMakePayment] = useState(false)
  
  
  const dataToSend = {
    vendorsEmail,
    buyerLocation:JSON.parse(location),
    totalPrice,
    landmark:landmark,
    orderNumber:orderNumber,
    phoneNumber:phoneNumber,
    products:JSON.parse(products),
    buyerJWTToken:userToken,
  }
  
  const updatePaymentStatus = async(orderNumber,paymentStatus)=>{
    try {
        const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/update-order-payment-status",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({orderNumber,paymentStatus})
        })
        const data = await response.json()
        return data
        // console.log("PAYMENT STATUS DATA",data)
    } catch (error) {
        console.log("ERROR",error.message)
    }
}

useEffect(()=>{
  setOrderNumber(generateRandomString(7))
  getUserJWTToken()
},[])


  if(loadingScreen){
    return null
  }

  return (
    <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
       <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
         <ScrollView style={{width:"90%"}} keyboardShouldPersistTaps='always' contentContainerStyle={{ paddingBottom: 150}} showsVerticalScrollIndicator={false}>
         <View style={{width:"100%",backgroundColor:"",flex:1}}>
                    <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                        <TouchableOpacity onPress={()=>{
                            // navigation.goBack()
                            router.back()
                        }} style={{position:"absolute",left:0}}>
                            <Entypo name="chevron-left" size={30} color="#333" />
                        </TouchableOpacity>
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Payment</Text>
                    </View>
                </View>
                
          <View style={{marginTop:15}}>
            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
              <Text style={{fontFamily:"Poppins",color:"gray",fontSize:17}}>Order Number</Text>
              <Text style={{fontFamily:"Mortend",color:COLORS.redOrange,fontSize:17}}>#{orderNumber}</Text>
              </View>
            <View style={{marginTop:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
              <Text style={{fontFamily:"Poppins",color:"gray",fontSize:17}}>Total</Text>
              <Text style={{fontFamily:"Mortend",color:COLORS.secondary,fontSize:17}}>₵ {totalPrice}</Text>
              </View>
          </View>
          
          <View style={{marginTop:40}}>
            <Text style={{fontFamily:"Poppins",fontSize:17,color:COLORS.redOrange}}>We accept</Text>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{width:"100%",height:70}}>
                {
                  paymentMode.map(item=>{
                    return(
                      <Image key={item.id} source={item.image} style={{width:60,height:60,marginVertical:10,marginRight:10}}/>
                    )
                    // <View style={{width:100,height:100,backgroundColor:"red"}}></View>
                  })
                }
            </ScrollView>
          </View>
          
          {/* <View style={{marginTop:40}}>
            <Text style={{fontFamily:"Poppins",fontSize:17,color:COLORS.redOrange}}>Pay via</Text>
            
          </View> */}
          
          <View style={{marginTop:40}}>
            <TouchableOpacity disabled={sendingOrder} onPress={()=>{
              router.push({
                pathname:"/(tabs)/Home/paymentMainScreen",
                params:{amount:totalPrice,orderNumber:orderNumber}
              })
              // navigation.navigate("PaymentMainScreen",{amount:route.params.totalPrice,orderNumber:orderNumber})
              dispatch(saveOrderDetails(dataToSend))
                }} style={{width:"100%",marginTop:20,borderRadius:50,height:70,backgroundColor:COLORS.accent4,alignItems:"center",justifyContent:"center"}}>
                    <Text style={{fontFamily:"Mortend",color:"black",fontSize:20}}>{"Continue to payment"}</Text>
              </TouchableOpacity>
              
            {/* Pay on delivery */}
            {
              deliveryPrice<60?
            
            <TouchableOpacity disabled={sendingOrder} onPress={()=>{
              
              // return
              Alert.alert('Order placing', 
              'Press ok to place your order.', 
              [
                {text: 'Ok',style:"cancel", onPress: () => {
                  makeOrder(dataToSend).then(data=>{
                    updatePaymentStatus(orderNumber,3).then(data=>{
                      playSuccess()
                      // AsyncStorage.setItem("cartItems",JSON.stringify([]))
                      // navigation.navigate("PROFILE",{screen:"MyOrdersMainScreen"})
                      router.push({
                        pathname:"/(tabs)/Profile/myOrdersMainScreen"
                      })
                    }).catch(err=>{})
                  }).catch(error=>console.log("error",error))
                  
                }},
                {text: 'Cancel',style:"destructive",onPress:()=>{}}
              ]);
              }} style={{width:"100%",marginTop:20,borderRadius:50,height:70,backgroundColor:COLORS.accent4,alignItems:"center",justifyContent:"center"}}>
                    <Text style={{fontFamily:"Mortend",color:"black",fontSize:20}}>{sendingOrder?<ActivityIndicator color={COLORS.primary}/>:"Pay on delivery"}</Text>
              </TouchableOpacity>:null}
          </View>
          {/* Delivery info */}
          <View style={{marginTop:30}}>
            <View style={{marginBottom:15,backgroundColor:COLORS.secondary,padding:10}}>
              <Text style={{fontFamily:"Poppins",fontSize:20,color:"white",textAlign:"center"}}>Delivery information</Text>
            </View>
            <View style={{padding:10}}>
              <Text style={{marginBottom:15,fontFamily:"Poppins",color:"#333"}}>1. Pay on delivery for addresses within Greater Accra.</Text>
              <Text style={{marginBottom:15,fontFamily:"Poppins",color:"#333"}}>2. Orders within Greater Accra are delivered on the same day, the next day, or within a maximum of 48 hours.</Text>
              <Text style={{marginBottom:15,fontFamily:"Poppins",color:"#333"}}>3. Orders from all other regions in Ghana are delivered within 24 to 72 hrs excluding Sundays.</Text>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>

  )
}

export default FinalOrderPaymentScreen