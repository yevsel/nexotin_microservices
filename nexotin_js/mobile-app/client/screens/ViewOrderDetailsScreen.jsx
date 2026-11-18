import { View, Text,TouchableOpacity,ScrollView,Alert,Dimensions,FlatList,Image,StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation, useRoute } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
// import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import 
import * as Device from 'expo-device';
import { router, useLocalSearchParams } from 'expo-router';

const ViewOrderDetailsScreen = () => {

    const { ordersList, orderStatus, orderNumber, buyerPhoneNumber, buyerLocation, landmark, buyerJWTToken, orderId,totalPrice,paid } = useLocalSearchParams()
    
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

    
    // console.log("OrderStatus",orderStatus)
    
    // const userAccountObject = useSelector(state=>state.userObjectReducer)
    const [userAccountObject,setUserAccountObject] = useState({})
     // console.log("USER OBJECT",userAccountObject)
    
    AsyncStorage.getItem("userAccountObject").then(data=>{
        setUserAccountObject(JSON.parse(data))
    }).catch(err=>console.log("ERROR",err))
    

    const subTotalPrice = JSON.parse(ordersList).map(item => item.price * item.quantity).reduce((total, init) => total + init, 0)

    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            {/* <ScrollView> */}
            {/* </ScrollView> */}
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}} style={{width:"90%"}}>
                <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                        <TouchableOpacity onPress={()=>{
                            router.back()
                            // navigation.goBack()
                        }} style={{position:"absolute",left:0}}>
                            <Entypo name="chevron-left" size={30} color="#333" />
                        </TouchableOpacity>
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Order details</Text>
                </View>
                
                {/* Order details */}
                <View style={{backgroundColor:COLORS.accent4,padding:15,borderRadius:15}}>
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 15 }}>Order Number</Text>
                        <Text style={{ fontFamily: "Mortend", color: COLORS.secondary, fontSize: 17 }}>#{orderNumber}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 15, justifyContent: "space-between", alignItems: "center" }}>
                      <Text style={{ fontFamily: "Poppins", fontSize: 15 }}>Status</Text>
                      <View style={{
                        backgroundColor: orderStatusColors[Number(orderStatus)] || "gray",
                        paddingVertical: 3,
                        paddingHorizontal: 15,
                        borderRadius: 20
                      }}>
                        <Text style={{
                          fontFamily: "Mortend",
                          color: "white",
                          fontSize: 14
                        }}>
                          {orderStatusMap[Number(orderStatus)] || "Unknown"}
                        </Text>
                      </View>
                    </View>
                </View>
            
            <View style={{ marginVertical: 20 }}>
                <Text style={{ fontFamily: "Poppins", fontSize: 15 }}>Items</Text>
            </View>
            
            <View  showsVerticalScrollIndicator={true}>
                    {
                        JSON.parse(ordersList).map((item, index) => {
                            // console.log(item.images[0].secure_url)
                            return (
                                <View key={index} style={{ width: "100%", flexDirection: "row", padding: 10, height: 100, backgroundColor: COLORS.accent4, marginBottom: 20, borderRadius: 20 }}>
                                    {/* <View style={{width:80,height:80,backgroundColor:COLORS.accent2,borderRadius:10,marginRight:10}}>
                                        
                                    </View> */}
                                    <Image source={{ uri: item.images[0].secure_url }} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}>

                                    </Image>
                                    <View style={{ justifyContent: "space-between", flex: 1 }}>
                                        <View>
                                            <Text numberOfLines={2} style={{ fontFamily: "Poppins", lineHeight: 15 }}>{item.name}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                                            <View >
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontFamily: "Poppins", color: "gray", fontSize: 11 }}>Size</Text>
                                                    <Text style={{ fontFamily: "Poppins", marginLeft: 10, fontSize: 11 }}>{item?.selectedSize}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontFamily: "Poppins", color: "gray", fontSize: 11 }}>Color</Text>
                                                    <Text style={{ fontFamily: "Poppins", marginLeft: 10, fontSize: 11 }}>{item?.selectedColor}</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontFamily: "Poppins", color: "gray", fontSize: 11 }}>Qty</Text>
                                                    <Text style={{ fontFamily: "Poppins", marginLeft: 10, fontSize: 11 }}>{item?.quantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: "Mortend", fontSize: 16, color: COLORS.redOrange }}>₵ {(item.price * item.quantity).toFixed(2)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                    <View>
                    <Text style={{ fontFamily: "Poppins", fontSize: 18, color: "gray" }}>Amount</Text>
                    <View style={{height:1,width:"100%",backgroundColor:"#ccc"}}></View>
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 15, color: "gray" }}>Sub total</Text>
                        <Text style={{ fontFamily: "Mortend", color: COLORS.secondary, fontSize: 17 }}>{Number(subTotalPrice).toFixed(2)}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 15, color: "gray" }}>Grand total + delivery</Text>
                        <Text style={{ fontFamily: "Mortend", color: COLORS.secondary, fontSize: 17 }}>₵ {Number(totalPrice).toFixed(2)}</Text>
                    </View>
                    {/* Payment Status */}
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 15, color: "gray" }}>Status</Text>
                        <View style={{paddingHorizontal:20,paddingVertical:3,borderRadius:10,backgroundColor:paid==="1"?"red":paid==="2"?"green":paid==="3"?COLORS.redOrange:null}}>
                            <Text style={{ fontFamily: "Mortend", color: "white", fontSize: 15, }}>{paid==="1"?"Not paid":paid==="2"?"Paid":paid==="3"?"Payment on delivery":null}</Text>
                        </View>
                    </View>
                    {/* Customer details */}
                    <Text style={{ fontFamily: "Poppins", fontSize: 18, color: "gray", marginTop: 10 }}>Delivery details</Text>
                    <View style={{height:1,width:"100%",backgroundColor:"#ccc"}}></View>
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 15, color: "gray" }}>Name</Text>
                        <Text style={{ fontFamily: "Mortend", color: COLORS.secondary, fontSize: 17 }}>{userAccountObject?.firstName + " " + userAccountObject?.lastName}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 15, color: "gray" }}>Phone number</Text>
                        <Text style={{ fontFamily: "Mortend", color: COLORS.secondary, fontSize: 17 }}>{buyerPhoneNumber}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", alignItems: "center" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 15, color: "gray" }}>Landmark</Text>
                        <Text style={{ fontFamily: "Mortend", color: COLORS.secondary, fontSize: 17 }}>{landmark}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginTop: 10, justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: 15, color: "gray" }}>Delivery address</Text>
                        <Text style={{ textAlign: "right", fontFamily: "Mortend", color: COLORS.secondary, fontSize: 14, width: "50%" }}>{JSON.parse(buyerLocation).data.description}</Text>
                    </View>
                </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewOrderDetailsScreen