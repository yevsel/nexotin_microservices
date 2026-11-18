import { View,Alert } from 'react-native'
import React,{useState}from 'react'
// import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context"
import  { Paystack }  from 'react-native-paystack-webview';
import { emptyBasket } from '../Actions';
import { useDispatch,useSelector } from 'react-redux';
// import { useSelector } from 'react-redux';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
const PaymentMainScreen = () => { 

    const dispatch = useDispatch()
    // const navigation = useNavigation() 
    // const router = useRoute()
    const {amount,orderNumber} = useLocalSearchParams()
    const dataToSend = useSelector(state=>state.orderDetailsToSendReducer)
    
      
  const [sound, setSound] = useState();

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
            const responseFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/make-order",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(dataToSend)
            })  
            const result = await responseFromDB.json()
            // dispatch(emptyBasket())
            Alert.alert("Order",result.msg,[
                {
                    text:"Ok",
                    onPress:()=>{}
                }
            ])
            return result
        } catch (error) {
            // makeOrder(dataToSend)
            Alert.alert("Order","There was a network error, please place your order again",[
                {
                    text:"Ok",
                    style:"cancel",
                    onPress:()=>{
                        makeOrder(dataToSend).then(data=>{
                            updatePaymentStatus(orderNumber,2).then(data=>{
                                playSuccess()
                                // AsyncStorage.setItem("cartItems",JSON.stringify([]))
                                navigation.goBack()
                            }).catch(err=>{})
                        }).catch(err=>{})
                    }
                }
            ])
        }
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
        } catch (error) {
            console.log("ERROR",error.message)
        }
    }
    
    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            <View style={{ flex: 1 }}>
                <Paystack  
                    paystackSecretKey={process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY ?? ""}
                    paystackKey={process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? ""}
                    channels={["mobile_money","card","bank","ussd"]}
                    billingName='Nexotin Company Limited'
                    billingMobile="11111111"
                    currency="GHS"
                    amount={amount}
                    // amount={0.1}
                    billingEmail="nexotincom@gmail.com"
                    activityIndicatorColor="green"
                    onCancel={(e) => {
                        router.back()
                    }}
                    onSuccess={(res) => {
                        makeOrder(dataToSend).then(data=>{
                            updatePaymentStatus(orderNumber,2).then(data=>{
                                router.push({
                                    pathname:"/(tabs)/Profile/myOrdersMainScreen"
                                  })
                                // navigation.navigate("PROFILE",{screen:"MyOrdersMainScreen"})
                                // AsyncStorage.setItem("cartItems",JSON.stringify([]))
                            }).catch(err=>{})
                        }).catch(err=>{})
                    }}
                    autoStart={true}
                />
            </View>
            {/* <ScrollView style={{width:"90%"}} contentContainerStyle={{ paddingBottom: 150}} showsVerticalScrollIndicator={false}>
                <View style={{width:"100%",backgroundColor:"",flex:1}}>
                    <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                        <TouchableOpacity onPress={()=>{
                            navigation.navigate("VerificationMainScreen")
                        }} style={{position:"absolute",left:0}}>
                            <Entypo name="chevron-left" size={30} color="#333" />
                        </TouchableOpacity>
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Payment</Text>
                    </View>
                </View>
                <View style={{marginTop:20}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{flex:1,fontFamily:"Poppins",fontSize:18,color:"gray"}}>Order Number</Text>
                        <Text style={{flex:1,textAlign:"left",fontFamily:"Mortend",fontSize:18}}>VERIFICATION</Text>
                    </View>
                    <View style={{flexDirection:"row",alignItems:"center",marginTop:10}}>
                        <Text style={{flex:1,fontFamily:"Poppins",fontSize:18,color:"gray"}}>Total</Text>
                        <Text style={{flex:1,textAlign:"left",fontFamily:"Mortend",fontSize:18,color:COLORS.primary}}>GHC{(200).toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView> */}
        </SafeAreaView>
    )
}

export default PaymentMainScreen