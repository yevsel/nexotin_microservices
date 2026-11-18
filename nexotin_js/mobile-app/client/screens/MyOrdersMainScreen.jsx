import { View, Text,TouchableOpacity,ScrollView,Alert,Dimensions,FlatList,Image,StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { ActivityIndicator } from 'react-native-paper';
import * as Device from 'expo-device';
import { router } from 'expo-router';
const MyOrdersMainScreen = () => {

    // const navigation = useNavigation()
    const userAccountObject = useSelector(state=>state.userObjectReducer)
    const [userToken,setUserToken] = useState()
    const [myOrders,setMyOrders] = useState([])
    const {width,height} = Dimensions.get("window")
    const [loadingOrders,setLoadingOrders] = useState(true)
    
    
    const getToken = ()=>{
        AsyncStorage.getItem("userToken").then(token=>{
            // setUserToken(JSON.parse(token))
            getMyOrders(JSON.parse(token))
        }).catch(err=>console.log(err.message))
    }
    
    const getMyOrders = async (userToken) => {
        setLoadingOrders(true)
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-orders-for-buyer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                }
            });
            const data = await response.json();
            // console.log("ORDER",data)
            setMyOrders(data.msg)
            setLoadingOrders(false)
        } catch (error) {
            console.log("error", error.message);
        }
    }
    
    
    useEffect(()=>{
        getToken()
        
    },[])
    
    const orderStatusMap = {
          1: "Processing",
          2: "In Delivery",
          3: "Completed",
          4: "Cancelled",
          5: "Refunded",
        };
        
    const orderStatusColors = {
          1: "#F39C12", // Processing - orange
          2: "#3498DB", // In Delivery - blue
          3: "#2ECC71", // Completed - green
          4: "#E74C3C", // Cancelled - red
          5: "#9B59B6", // Refunded - purple
        };

    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <View style={{width:"90%"}}>

            {/* <ScrollView style={{width:"90%"}} contentContainerStyle={{ paddingBottom: 100}} showsVerticalScrollIndicator={false}> */}
            <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                    <TouchableOpacity onPress={()=>{
                        // navigation.navigate("ProfileMainScreen")
                        router.back()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>My Orders</Text>
                </View>
            {/* </ScrollView> */}
            {/* <TouchableOpacity  onPress={()=>{
                navigation.navigate("TrackOrderMainScreen")
                }} style={{width:"100%",marginBottom:20,borderRadius:50,height:70,backgroundColor:COLORS.redOrange,alignItems:"center",justifyContent:"center"}}>
                    <Text style={{fontFamily:"Poppins",color:"white",fontSize:18}}>Track an order</Text>
              </TouchableOpacity> */}
            <FlatList
                        data={myOrders}
                        keyExtractor={item=>item._id.toString()}
                        contentContainerStyle={{paddingBottom:150}}
                        showsVerticalScrollIndicator={false}
                        // style={{maxHeight:550}}
                        // onEndReached={()=>{
                        //     if(fetchMoreOrders){
                        //         if(accountObject){
                        //             getMyOrders(accountObject.email)
                        //         }
                        //     }
                        // }}
                        // onEndReachedThreshold={0.05}
                        renderItem={({item})=>{
                            // console.log(item.orders[0].images[0].secure_url)
                            return(
                                <TouchableOpacity onPress={()=>{
                                    // console.log("SSS",item.orderStatus)
                                    router.push({
                                    pathname:"/(tabs)/Profile/viewOrderDetailsScreen",
                                    params:{
                                        ordersList:JSON.stringify(item.orders),
                                        orderNumber:item.orderNumber,
                                        orderStatus:item.orderStatus,
                                        buyerPhoneNumber:item.buyerPhoneNumber,
                                        buyerLocation:JSON.stringify(item.buyerLocation),
                                        landmark:item.buyerLandmark,
                                        buyerJWTToken:item.buyerJWTToken,
                                        orderId:item._id,
                                        totalPrice:item.totalPrice,
                                        paid:item.paid
                                    }
                                   })
                                
                                // console.log("ordersList",item.orders)
                                // console.log("number",item.paid)
                                    // navigation.navigate("ViewOrderDetailsScreen")
                                    // navigation.navigate("ViewOrderDetailsScreen",{
                                    // ordersList:item.orders,
                                    // orderNumber:item.orderNumber,
                                    // orderStatus:item.orderStatus,
                                    // buyerPhoneNumber:item.buyerPhoneNumber,
                                    // buyerLocation:item.buyerLocation,
                                    // landmark:item.buyerLandmark,
                                    // buyerJWTToken:item.buyerJWTToken,
                                    // orderId:item._id,
                                    // totalPrice:item.totalPrice,
                                    // paid:item.paid
                                    // }
                                // )
                                }} style={{marginBottom:15,flexDirection:"row",width:"100%",backgroundColor:COLORS.accent4,height:100,borderRadius:20,padding:10}}>
                                    <Image  source={{uri:item.orders[0].images[0].secure_url}} style={{width:80,height:80,backgroundColor:COLORS.secondary,borderRadius:10}}>
                                    </Image>
                                    <View style={{marginLeft:10,flex:1}}>
                                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                                            <Text style={{color:"gray",fontFamily:"Poppins",fontSize:12}}>{new Date(item.createdAt).toUTCString().split(" ").splice(0,5).join(" ")}</Text>
                                                <View style={{
                                                      backgroundColor: orderStatusColors[item.orderStatus] || "gray",
                                                      padding: 1,
                                                      borderRadius: 20,
                                                      paddingHorizontal: 5
                                                    }}
                                                >
                                                
                                            <Text style={{ fontFamily: "Poppins", fontSize: 10, color: "white" }}>
                                              {orderStatusMap[item.orderStatus] || "Unknown Status"}
                                            </Text>
                                            </View>
                                        </View>
                                        <Text style={{fontFamily:"Poppins"}}>Order #{item.orderNumber}</Text>
                                        <Text numberOfLines={2} style={{color:"gray",fontFamily:"Poppins",fontSize:11}}>{item.orders[0].name}</Text>
                                        {item.orders.length>1?<Text numberOfLines={1} style={{color:"gray",fontFamily:"Poppins",fontSize:11}}>{item.orders[1].name}</Text>:null}
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                    {loadingOrders&&<ActivityIndicator color={COLORS.primary}/>}
                    {/* Track order */}
                    
                </View>
        </SafeAreaView>
    )
}

export default MyOrdersMainScreen