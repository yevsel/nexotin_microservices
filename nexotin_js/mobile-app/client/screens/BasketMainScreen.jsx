import { View, Text,ScrollView,TouchableOpacity,Image,TextInput,StatusBar, Dimensions,Keyboard} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Entypo,Feather,Ionicons,MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector,useDispatch } from 'react-redux';
import { COLORS } from '../constants/theme';
import { useRef } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { increaseProductQuantity,decreaseProductQuantity,deleteProduct } from '../Actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import emptyCart from "../assets/empty_cart.png"
import * as Device from 'expo-device';
import { ParentContext } from '../context/ParentContext';
import { router, usePathname } from 'expo-router';
import 'react-native-get-random-values';


const BasketMainScreen = () => {
    const path = usePathname()
    const {setShowBottomNavigation} = useContext(ParentContext)
    const userObjectReducer = useSelector(state=>state.userObjectReducer)
    const isFocussed = path==="/Home/basket"?true:false
    const [selectedProductsReducer,setSelectedProductsReducer] = useState([])
    // const selectedProductsReducer = useSelector(state=>state.selectedProductsReducer)
    const [totalPrice,setTotalPrice] = useState(0)
    // const totalPrice = selectedProductsReducer.map(item=>item.price*item.quantity).reduce((total,num)=>total+num,0)
    const dispatch = useDispatch()
    const ref = useRef()
    const [location,setLocation] = useState({data:null,latitude:null,longitude:null})
    const [addressText,setAddressText] = useState("")
    const [coupon,setCoupon] = useState()
    const [landmark,setLandmark] = useState()
    const [vendorLocations,setVendorLocations] = useState([])
    const [userAccountObject,setUserAccountObject] = useState({})
    const [distances,setDistances] = useState()
    const [deliveryPrice,setDeliveryPrice] = useState(0)
    const [loadingScreen,setLoadingScreen] = useState(true)
    const [loadingDeliveryFee,setLoadingDeliveryFee] = useState(true)
    const [phoneNumber,setPhoneNumber] = useState()
    const [refresh,setRefresh] = useState()
    const [finalPrice,setFinalPrice] = useState()
    const [getAccountObjectRefresh,setGetAccountObjectRefresh] = useState(false)
    const [vendorsInformation,setVendorsInformation] = useState()
    const [deliveryLocationRefresh,setDeliveryLocationRefresh] = useState(true)
    const [refreshStorage,setRefreshStorage] = useState(true)
    
    const enableButton = (selectedProductsReducer&&selectedProductsReducer.length>0)&&landmark&&phoneNumber&&deliveryPrice&&addressText
    
    useEffect(()=>{ 
        setShowBottomNavigation(false)
        getAccountObject()
        // if(isFocussed&&userAccountObject){
        //     getVendorsOfProducts()
        // }
    },[isFocussed,refresh])
    
   
    
    
    useEffect(()=>{
        AsyncStorage.getItem("cartItems").then(data=>{
            setLoadingScreen(true)
            setSelectedProductsReducer(JSON.parse(data))
            if(JSON.parse(data) && JSON.parse(data).length>0){
                setTotalPrice(JSON.parse(data).map(item=>item.price*item.quantity).reduce((total,num)=>total+num,0))
            }
            setLoadingScreen(false)
        }).catch(err=>console.log(err+"D")) 
    },[refreshStorage])
    
    
    const getAccountObject = ()=>{
        // AsyncStorage.clear().then(data=>console.log(data)).catch(err=>console.log(err.message))
        setLoadingScreen(true)
        AsyncStorage.getItem("userAccountObject").then(data=>{
            if(data!==null){
                setUserAccountObject(JSON.parse(data))
                setLoadingScreen(false)
                return
            } 
        }).catch(error=>{
        //   console.log("Getting account Error",error.message)
            setLoadingScreen(true)
            return
        })
        return
        }
    
    const getDistanceFromArray = (vendorDistances)=>{
        return new Promise(async(resolve,reject)=>{
        try {
            if (vendorDistances.length===1){
                // console.log("YES ONE LENGTH")
                // When items have one vendor
                let origin=""
                if(location.longitude!==null && location.latitude!==null){
                    // console.log("YOU CAN USE LOCATION***")
                    origin = location.latitude+","+location.longitude
                }
                else if(userObjectReducer){
                    origin = userObjectReducer?.location?.latitude+","+userObjectReducer?.location?.longitude
                }
                const destination = vendorDistances[0]?.latitude+","+vendorDistances[0]?.longitude
                
                const result = await getDistance(origin,destination)
                if(result){
                    // console.log("TES",result)
                    resolve([result.distance.value])
                    setLoadingDeliveryFee(false)
                    return
                }
            }
            const distances = []
            for(let i=0;i<vendorDistances.length-1;i++){
                const origin = vendorDistances[i]?.latitude+","+vendorDistances[i]?.longitude
                const destination = vendorDistances[i+1]?.latitude+","+vendorDistances[i+1]?.longitude
                const result = await getDistance(origin,destination)
                distances.push(result.distance.value)
            }
            resolve(distances)
            setLoadingDeliveryFee(false)
            return
        } catch (error) {
            reject(error.message)
        }})
    }
    
    const getDistance = (origin,destination)=>{
        return new Promise(async(resolve,reject)=>{
            setLoadingDeliveryFee(true)
            try {
                // console.log("ORI",origin,"DEST",destination)
                const apiKey = 'AIzaSyBkdpeOr-6ISnArg1FGnd5IfW-jGOf7t-w';
                const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${apiKey}`;
                    
                const res = await fetch(url)
                const d = await res.json()
                // console.log("D",d)
                // console.log(d.rows[0].elements[0])
                const {duration,distance} = d.rows[0].elements[0]
                // console.log("DISTANCE",distance)
                if(duration&&distance){
                    resolve({duration,distance})
                }
            } catch (error) {
                reject("Get distance error",error)
            }
        })
    }

    const getVendorsOfProducts = async()=>{
        // console.log("LOCATION",location)
        try {
            const vendorDetails = selectedProductsReducer.map(item=>{
                return {vendorId:item.accountOwnerID,accountType:item.accountType}
            })
            // console.log("VENDOR DETAILS",vendorDetails)
            function removeDuplicateItems(arr) {
                const uniqueItems = {};
                const result = [];
            
                for (const item of arr) {
                    if (!uniqueItems[item.vendorId]) {
                        result.push(item);
                        uniqueItems[item.vendorId] = true;
                    }
                }
                return result;
            }
            const resultFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-vendor-of-products",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({details:removeDuplicateItems(vendorDetails)})
            })
            const data = await resultFromDB.json()
            setVendorsInformation(data.msg)
            
            // console.log("VEN",data.msg)
            let vendorLocations=[]
            let allDistance=[]
            if(data){
                vendorLocations = data.msg.map(item=>item.location)
                // console.log("V LOC",vendorLocations)
            }
            
            // console.log("VENDOR 1 LOCATION",vendorLocations[0])
            // console.log("MY LOCATION",location)
            
            allDistance = await getDistanceFromArray([location,...vendorLocations])
            const totalDistance = allDistance.reduce((total,one)=>total+one,0)
            
            // console.log("TOTAL DISTANCE IN KM",totalDistance/1000)
            
            const distanceInKM = totalDistance/1000
            
            setDeliveryPrice(0)
            let feeFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/calculate-delivery-price",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({distanceInKM})
            })
            
            const deliveryFee = await feeFromDB.json()
            
            setDeliveryPrice(deliveryFee.deliveryFee.toFixed(2))
           
            
        } catch (error) {
            console.log("Get vendors error",error)
        }
    }
    
    useEffect(()=>{ 
        
        if(isFocussed){
        
            getVendorsOfProducts()
        }
    },[deliveryLocationRefresh])
    
    
    if (loadingScreen){
        return null
    }
    
    const {height} = Dimensions.get("screen")
    
    return (
        <SafeAreaView style={{height,alignItems:"center",backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <ScrollView style={{width:"90%"}} keyboardShouldPersistTaps='always' contentContainerStyle={{ paddingBottom: 250}} showsVerticalScrollIndicator={false}>
                <View style={{width:"100%",backgroundColor:"",flex:1}}>
                    <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                        <TouchableOpacity onPress={()=>{
                            router.back()
                        }} style={{position:"absolute",left:0}}>
                            <Entypo name="chevron-left" size={30} color="#333" />
                        </TouchableOpacity>
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Basket</Text>
                    </View>
                </View>
                {/* Main Screen */}
                <View>
                    {selectedProductsReducer&&selectedProductsReducer.length>0?selectedProductsReducer.map((item,index)=>{
                        return(
                            <TouchableOpacity onPress={()=>{
                                router.push(`/shop/p/${item.id}`)
                                // router.push({
                                //     pathname:"/productDetails",
                                //     params:{id:item.id}
                                // })
                                // navigation.navigate("HOME",{screen:"ViewProductMainScreen",params:{id:item.id}})
                            }} key={index} style={{width:"100%",padding:10,flexDirection:"row",height:120,backgroundColor:COLORS.accent4,marginBottom:15,borderRadius:15}}>
                                <Image resizeMode="cover" source={{uri:item.images[0].secure_url}} style={{width:100,height:"100%",borderRadius:10}}></Image>
                                <View style={{flex:1,marginLeft:7,justifyContent:"space-between"}}>
                                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                        <Text numberOfLines={2} style={{fontFamily:"Poppins",width:"80%",color:COLORS.secondary,fontSize:17,lineHeight:19}}>{item.name}</Text>
                                        {/* DELETE */}
                                        <TouchableOpacity onPress={()=>{
                                            dispatch(deleteProduct(index))
                                            setRefreshStorage(!refreshStorage)
                                            // setDeliveryLocationRefresh(!deliveryLocationRefresh)
                                            setRefresh(!refresh)
                                        }}>
                                            <MaterialIcons name="cancel" size={24} color="gray" />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <View style={{flexDirection:"row",width:"100%",flex:1,justifyContent:"space-between",alignItems:"flex-end"}}>
                                        <View>
                                            <Text style={{color:"gray",fontSize:12}}>Size: <Text style={{color:"black"}}>{item.selectedSize}</Text></Text>
                                            <Text style={{color:"gray",fontSize:12}}>Color: <Text style={{color:"black"}}>{item.selectedColor}</Text></Text>
                                        </View>
                                        <View style={{alignItems:"flex-end"}}>
                                            <View style={{flexDirection:"row",alignItems:"center",}}>
                                                {/* DECREASE */}
                                                <TouchableOpacity disabled={item.quantity>=2?false:true}  onPress={()=>{
                                                        dispatch(decreaseProductQuantity(index))
                                                        setRefreshStorage(!refreshStorage)
                                                        
                                                    }} style={{padding:5,backgroundColor:COLORS.secondary,borderRadius:50}}><Feather name="minus" size={20} color="white" /></TouchableOpacity>
                                                    <Text style={{marginHorizontal:10,fontSize:20,fontFamily:"PoppinsBold",color:COLORS.secondary}}>{item.quantity}</Text>
                                                {/* INCREASE */}
                                                <TouchableOpacity onPress={()=>{
                                                        dispatch(increaseProductQuantity(index))
                                                        setRefreshStorage(!refreshStorage)
                                                        
                                                    }} style={{padding:5,backgroundColor:COLORS.secondary,borderRadius:50}}><Feather name="plus" size={20} color="white" /></TouchableOpacity>
                                            </View>
                                            <Text style={{color:"#333",fontFamily:"Mortend",fontSize:15,marginTop:5}}>GH₵ {(item.price).toFixed(2)}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    }):
                    <View style={{width:"100%",alignItems:"center"}}>
                        <Image source={emptyCart} style={{width:"100%",height:120}} resizeMode='contain'/>
                    </View>}
                </View>
                {/* Details */}
                <View style={{width:"100%",height:1,backgroundColor:"#ededed",marginTop:10,marginBottom:20}}></View>
                <View>
                    {/* Coupon */}
                    {/* <View style={{flexDirection:"row",alignItems:"center",height:60,marginBottom:20}}>
                        <TextInput placeholder='Coupon Code' style={{flex:1,backgroundColor:"white",fontSize:18,borderWidth:1,padding:15,borderColor:"#ccc",borderRadius:40}}/>
                        <TouchableOpacity style={{backgroundColor:COLORS.redOrange,width:100,borderRadius:50,marginLeft:10,height:"80%",alignItems:"center",justifyContent:"center"}}>
                            <Text style={{fontFamily:"Poppins",color:"white"}}>Apply</Text>
                        </TouchableOpacity>
                    </View> */}
                    {/* Location */}
                    <Text style={{color:"red",fontSize:10,marginLeft:10,marginBottom:10}}>*Required</Text>
                        <GooglePlacesAutocomplete
                                styles={{
                                    textInputContainer:{alignItems:"center",padding:2,borderWidth:2,paddingRight:20,borderColor:COLORS.textInputBorder,marginBottom:20,borderRadius:10},
                                    textInput:{fontSize:17}
                                }}
                                ref={ref}
                                listViewDisplayed={false}
                                cursorColor={COLORS.primary}
                                disableScroll={true}
                                fetchDetails={true}
                                renderRightButton={()=><Ionicons name="location-sharp" size={20} color="gray" />}
                                placeholder='Search delivery address'
                                query={{
                                    key: process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY,
                                    language: 'en',
                                    components:'country:GH'
                                }}
                                onPress={(data, details) => {
                                    setDeliveryLocationRefresh(!deliveryLocationRefresh)
                                    setLocation(prevData=>{
                                        let longitude = details?.geometry?.location.lng
                                        let latitude = details?.geometry?.location.lat
                                        prevData.data=data
                                        prevData.latitude=latitude
                                        prevData.longitude=longitude
                                        return prevData
                                    })
                                    setAddressText(data.description); 
                                }}
                                />
                    <View>
                    
                    
                    {/* <TextInput onChangeText={(e)=>{
                            setFirstName(e)
                        }} inputMode='text' value={firstName} cursorColor={COLORS.primary} multiline={false} placeholderTextColor={COLORS.placeholderTextColor} style={{borderWidth:2,borderColor:COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholder='Enter your first Name'/> */}
                    
                    
                    <Text style={{color:"red",fontSize:10,marginLeft:10,marginBottom:5}}>*Required</Text>
                        <TextInput onChangeText={(e)=>{
                            setPhoneNumber(e)
                        }} inputMode='tel' placeholder='Phone number' style={{borderWidth:2,borderColor:COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16,marginBottom:20}}/>
                    </View>
                    
                    <View>
                    <Text style={{color:"red",fontSize:10,marginLeft:10,marginBottom:5}}>*Required</Text>
                        <TextInput onChangeText={(e)=>{
                            setLandmark(e)
                        }} placeholder='Landmark or additional information' style={{borderWidth:2,borderColor:COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16,marginBottom:20}}/>
                    </View>
                    <View style={{width:"100%",height:1,backgroundColor:"#ededed",marginTop:0,marginBottom:20}}></View>
                </View>
                {/* MONEY */}
                <View>
                    {/* SubTotal */}
                    <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <Text style={{fontFamily:"Poppins",color:"gray",fontSize:17}}>Sub Total</Text>
                        <Text style={{fontFamily:"Mortend",color:COLORS.secondary,fontSize:17}}>GH₵ {(totalPrice).toFixed(2)}</Text>
                    </View>
                    {/* Discount */}
                    <View style={{flexDirection:"row",marginTop:15,justifyContent:"space-between",alignItems:"center"}}>
                        <Text style={{fontFamily:"Poppins",color:"gray",fontSize:17}}>Discount</Text>
                        <Text style={{fontFamily:"Mortend",color:COLORS.secondary,fontSize:17}}>GH₵ -{(0).toFixed(2)}</Text>
                    </View>
                    {/* Delivery fee */}
                    <View style={{flexDirection:"row",marginTop:15,justifyContent:"space-between",alignItems:"center"}}>
                        <Text style={{fontFamily:"Poppins",color:"gray",fontSize:17}}>Delivery fee</Text>
                        {/* <Text style={{fontFamily:"Mortend",color:COLORS.secondary,fontSize:17}}>GH₵ {deliveryPrice&&(deliveryPrice/1000).toFixed(2)}</Text> */}
                        <Text style={{fontFamily:"Mortend",color:COLORS.secondary,fontSize:17}}>GH₵ {loadingDeliveryFee?<ActivityIndicator size={12} color={COLORS.primary}/>:deliveryPrice}</Text>
                    </View>
                    {/* Total */}
                    <View style={{flexDirection:"row",marginTop:15,justifyContent:"space-between",alignItems:"center"}}>
                        <Text style={{fontFamily:"PoppinsBold",color:COLORS.secondary,fontSize:17}}>Total</Text>
                        <Text style={{fontFamily:"Mortend",color:COLORS.secondary,fontSize:17}}>GH₵ {deliveryPrice&& (Number(totalPrice)+Number(deliveryPrice)).toFixed(2)}</Text>
                    </View>
                    {/* PAYMENT */}
                    <TouchableOpacity disabled={!enableButton} onPress={()=>{
                        console.log("TotalPrice",(Number(totalPrice)+Number(deliveryPrice)).toFixed(2))
                        console.log("Location",location)
                        console.log("Landmark",landmark)
                        console.log("VendorInfo",vendorsInformation)
                        // console.log("Products",selectedProductsReducer)
                        console.log("Delivery Price",Number(deliveryPrice))
                        router.push({
                            pathname: "/(tabs)/Home/finalOrderPaymentScreen",
                            params: {
                                totalPrice: (Number(totalPrice) + Number(deliveryPrice)).toFixed(2),
                                location: JSON.stringify(location), 
                                phoneNumber,
                                landmark,
                                vendorsInformation: JSON.stringify(vendorsInformation), 
                                products: JSON.stringify(selectedProductsReducer), 
                                deliveryPrice: Number(deliveryPrice)
                            }
                        });
                        // navigation.navigate("FinalOrderPaymentScreen",)
                    }} style={{width:"100%",marginTop:40,borderRadius:50,height:70,backgroundColor:COLORS.redOrange,alignItems:"center",justifyContent:"center"}}>
                        <Text style={{fontFamily:"Poppins",color:"white",fontSize:18}}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BasketMainScreen