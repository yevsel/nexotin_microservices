import { View, Text,ScrollView,Dimensions,Image,StatusBar, TouchableOpacity,Alert,TextInput,Modal,StyleSheet,Share } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator } from "react-native-paper"
import { COLORS } from '../constants/theme'
import { Feather } from '@expo/vector-icons';
import { useDispatch,useSelector } from 'react-redux'
import { addToSelectedProducts,addMessage, addVendorToAllMessages,resetMessages } from '../Actions'
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import ViewProductsBottomSheet from '../components/ViewProductsBottomSheet'
import { Audio } from 'expo-av';
import Collapsible from 'react-native-collapsible';
import { RadioButton } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import { removeProductAddedToBlockedProducts,enableCanSearchVendorAccountSwitch,addSelectedVendorToChat } from '../Actions'
import * as Device from "expo-device"
import {Carousel,PageControl, Chip,Badge} from "react-native-ui-lib"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProductImageComponent from '../components/ProductImageComponent'
import uuid from 'react-native-uuid';
import LottieView from 'lottie-react-native';
import GoBack from '../components/GoBack'
import { router, useLocalSearchParams } from 'expo-router'
import { ParentContext } from '../context/ParentContext'
import useUserAccountObject from '../hooks/useUserAccountObject'
import { supabaseClient } from '../utils/supabase-client'
import ProductViewShimmerLoading from '../components/ProductViewShimmerLoading';
const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');

const ViewProductMainScreen = ({route,setLoggedIn,setShowBottomNavigation}) => {

    const {setDialogue,dialogue} = useContext(ParentContext)
    const userObjectReducer = useSelector(state=>state.userObjectReducer)
    const [onPageRelatedItems,setOnPageRelatedItems] = useState([])
    
    const [searchingVendor,setSearchingVendor] = useState(false)
    
    
    const {setMessageParameters} = useContext(ParentContext)
    
    
    const handleShare = async (shortPath) => {
          try {
            await Share.share({
              message: `${shortPath}`,
              title: "Product on Nexotin",
            });
          } catch (error) {
            console.error("Error sharing", error);
          }
        };

    
    const getOnePageRelatedItems = async(dataToSend)=>{
        try {
            const resultFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-sub-category-related-items",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(dataToSend)
            })
            const data = await resultFromDB.json()
            // console.log("DATA RETURNED",data)/
            setOnPageRelatedItems(data.msg)
        } catch (error) {
            console.log("ERROR",error)
        }
    }
    



    const [dimensions, setDimensions] = useState({
        window: windowDimensions,
        screen: screenDimensions,
      });
      
    //   console.log("DIMENSION",dimensions)
      
      useEffect(() => {
        const subscription = Dimensions.addEventListener(
          'change',
          ({window, screen}) => {
            setDimensions({window, screen});
          },
        );
        return () => subscription?.remove();
      });
    
    const bottomSheetRef = useRef()
    
    const [refreshPage,setRefreshPage] = useState(false)
    
    // const {height,width} = 
    
    const [currentImage,setCurrentImage] = useState(0)

    const {id} = useLocalSearchParams()
    const [loading,setLoading] = useState(true)
    const [productData,setProductData] = useState({})
    const width = Dimensions.get('window').width;

    const refreshPageReducer = useSelector(state=>state.refreshPageReducer)


    const [inFavorites,setInFavorites] = useState(false)

    
    
    const [selectedSize,setSelectedSize] = useState()
    const [selectedColor,setSelectedColor] = useState()
    const [quantity,setQuantity] = useState(1)
    const [notFound,setNotFound] = useState(false)
    
    const selectedProductsReducer = useSelector(state=>state.selectedProductsReducer)
    
    const [buyerImages,setBuyerImages]=useState([])
    
    const [showReport,setShowReport] = useState(false)
    
    const [bottomSheetInitialHeight,setBottomSheetInitialHeight] = useState(0)
    
    const dispatch = useDispatch()
    
    const {user} = useUserAccountObject()
    
    const checkIfInFavorites = async()=>{
        try {
            const favorites = JSON.parse(await AsyncStorage.getItem("favorites"))
            if(favorites.length!==0){
                favorites.forEach((item)=>{
                    if(id===item.id){
                        setInFavorites(true)
                    }
                })
            }
        } catch (error) {
            console.log(error.message)
        }
        
    }
    const storeData = async(id,name,image,height,price)=>{
        try {
            let favoritesArray = JSON.parse(await AsyncStorage.getItem("favorites"))
            const data = {  id,image,name,height,price}
            let indexOfItem = favoritesArray.findIndex(item=>item.id===data.id)
            if(indexOfItem===-1){
                favoritesArray = [data,...favoritesArray]
                await AsyncStorage.setItem("favorites",JSON.stringify(favoritesArray))
                playSuccess()
                Alert.alert('Saved to your profile', '', [
                    {
                        text: 'Ok',
                        style:"cancel"
                    },
                    {
                        text:"View",
                        style:"default",
                        onPress:()=>{
                            router.push("(tabs)/Profile/savedProductsScreen")
                        }
                    }
                ]);
            }
        } catch (error) {
            console.log("Store data error",error.message)
        }
    }

    
    useEffect(()=>{
        setCurrentImage(0)
        async function getOneProduct(){
            try {
                setLoading(true)
                // const response = await fetch(`https://nexotin-mobile-server.onrender.com/api/get-one-product/${id}`)
                const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_ROUTE}/api/get-one-product/${id}`)
                const data = await response.json()
                if(data.msg===null){
                    setLoading(true)
                    return setNotFound(true)
                }
                // console.log("VENDOR INFO",Object.keys(data.msg.vendorInfo))
                setProductData(data.msg)
                getOnePageRelatedItems({subCategory:data.msg.subCategory})
                
                setSelectedSize(data.msg.selectedSizes[0])
                setSelectedColor(data.msg.colors[0])
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
        getOneProduct()
        
    },[refreshPageReducer,refreshPage])

    useEffect(()=>{
        checkIfInFavorites()
        // setShowBottomNavigation(false)
    },[refreshPage])
    
    const [reviews,setReviews] = useState([])
    const [reviewsLoading,setReviewsLoading] = useState(true)
    const [buyerImagesLoading,setBuyerImagesLoading] = useState(true)
    const [fetchProductReview,setFetchProductReview] = useState(true)
    
    const [reportCollapsed,setReportCollapsed] = useState(true) 
    
    const [reportReason,setReportReason] = useState("misleading")
    const [reportText,setReportText] = useState("")
    const [sendingReport,setSendingReport] = useState(false)
    
    const [modalVisible, setModalVisible] = useState(false);


    const fetchReviews = async(dataToSend)=>{
        // console.log("DATA TO SEND",dataToSend)
        try {
            setReviewsLoading(true)
            const res = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-product-review",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({data:dataToSend.productId})
            })
            const data = await res.json()
            // console.log("REVIEWS",data)
            const buyersEmails = data.msg.map(item=>item.buyerInformation.email)
            grabBuyersImages(buyersEmails)
            setReviews(data.msg)
            setReviewsLoading(false)
        } catch (error) {
            setReviewsLoading(false)
        }
    }
    
    const grabBuyersImages = (buyersEmails)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                setBuyerImagesLoading(true)
                const res = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-buyer-images-for-reviews",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({buyersEmails})
                })
                const data = await res.json()
                setBuyerImages(data.msg)
                resolve(data)
                setBuyerImagesLoading(false)
            } catch (error) {
                reject(error.message)
            }
        })
    }
    useEffect(()=>{
        fetchReviews({productId:productData._id})
    },[fetchProductReview,productData])
    
    const [sound, setSound] = useState();
    
    const getAllVendorInfoFromServer = async(details) => {
                                        try {
                                          const result = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE + "/api/get-vendor-email", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                              details: [
                                                {
                                                  accountOwnerID: details.accountOwnerID,
                                                  accountType: details.accountType,
                                                },
                                              ],
                                            }),
                                          });
                                          const d = await result.json();
                                          return d.msg;
                                        } catch (error) {
                                          console.log("ERROR", error);
                                          throw error;
                                        }
                                      };

    async function playSuccess() {
    //   console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync( require("../assets/sounds/tap.mp3"))
      ;
      setSound(sound);
  
    //   console.log('Playing Sound');
      await sound.playAsync();
    }
    
    if(notFound){
        return <View style={[{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"white"},{height:dimensions.window.height}]}>
        <StatusBar translucent backgroundColor="transparent" />
        <View>
            <Text style={{fontFamily:"PoppinsBold",fontSize:23,textAlign:"center",color:"gray"}}>Product not found 🥲.</Text>
        </View>
        </View>
    }

    if(loading){
        return(
            <ProductViewShimmerLoading/>
        )
    //     return <View style={[{ alignItems:"center",backgroundColor:"white"},{height:dimensions.window.height}]}>
    //     <StatusBar translucent backgroundColor="transparent" />
    //     <View style={{height:400,width:"100%",justifyContent:"center",alignItems:"center"}}>
    //         <LottieView style={{width:100,height:350}} autoPlay source={require("../lottieAnimations/loading.json")}/>
    //     </View>
    // </View>
        
    }
    
    

    return ( 
        <>
        <StatusBar translucent backgroundColor="transparent" />
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                //   Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}>
                <View style={{width:"100%",height:Device.brand==='google'?dimensions.screen.height:dimensions.window.height,alignSelf:"center",backgroundColor:Device.brand==='google'?"transparent":"black"}}>
                    <TouchableOpacity onPress={()=>setModalVisible(false)}>
                        <Image  resizeMode='contain' source={{uri:productData.images[currentImage].secure_url}} style={{width:"100%",height:"100%"}}/>
                    </TouchableOpacity>
                </View>
              </Modal>
              
            <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50}} style={{backgroundColor:"white",height:Device.brand==='google'?dimensions.screen.height:dimensions.window.height,position:"absolute",top:0,bottom:0,left:0,right:0}}>
                {/* Product Image Carousel */}
                <View >
                {productData.productQuantity===0 && (
                                    <View style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 10,
                                        zIndex: 5
                                    }}>
                                        <Text style={{
                                            color: "white",
                                            fontSize: 16,
                                            textAlign: "center",
                                            backgroundColor:"#FF5757",
                                            padding:10,
                                            paddingHorizontal:20
                                        }}>Sold out</Text>
                                    </View>
                                )}
                    <Carousel pagingEnabled onChangePage={(pageIndex, oldPageIndex, info)=>{
                        // console.log("PAGE INDEX",pageIndex)
                        setCurrentImage(pageIndex)
                    }} style={{width:width,height:450}} showsHorizontalScrollIndicator={false}>
                        {productData.images.map((item,index)=>{
                            return <Image key={index} resizeMode='cover' source={{uri:item.secure_url}} style={{width:width,height:"100%",borderBottomLeftRadius:30,borderBottomRightRadius:30}}/>
                        })}
                    </Carousel>
                    {/* <GoBack /> */}
                    <View style={{position:"absolute",bottom:15,right:15,left:15}}> 
                        <PageControl  spacing={10} size={8} enlargeActive numOfPages={productData?.images?.length} inactiveColor='#ccc' color={COLORS.primary} currentPage={currentImage} />
                    </View>
                    {/* Expand */}
                    <TouchableOpacity onPress={()=>{
                        setModalVisible(true)
                    }} style={{position:"absolute",bottom:10,right:5,paddingHorizontal:10,borderRadius:50}}>
                        <MaterialCommunityIcons name="arrow-expand-all" size={24} color={COLORS.secondary} />
                    </TouchableOpacity>
                    {/* Report options */}
                    <TouchableOpacity onPress={()=>setShowReport(!showReport)} style={{position:"absolute",bottom:10,left:5,paddingHorizontal:10,borderRadius:50}}>
                        <FontAwesome5 name="exclamation-circle" size={24} color={COLORS.secondary} />
                    </TouchableOpacity>
                    {/* Report selection */}
                    {showReport&&<View style={{position:"absolute",bottom:35,left:40,borderRadius:10,width:250,overflow:"hidden",minHeight:50,borderWidth:1,borderColor:"white",backgroundColor:"rgba(255,255,255,0.9)",}}>
                        <TouchableOpacity onPress={()=>{
                            Alert.alert('Hiding product', 'Are you sure you want to hide this product?', [
                                {text: 'Yes', style:"destructive",onPress: () => {
                                    // console.log("ID",productData._id)
                                    AsyncStorage.getItem("blockedProducts").then(data=>{
                                        const blockedProducts = JSON.parse(data)
                                        blockedProducts.push(productData._id)
                                        AsyncStorage.setItem("blockedProducts",JSON.stringify(blockedProducts)).then(res=>{
                                        {
                                            dispatch(removeProductAddedToBlockedProducts(productData._id))
                                            setTimeout(()=>{
                                                setShowReport(false)
                                                // navigator.navigate("HomeScreen")
                                                router.push("(tabs)/Home")
                                            },100)
                                        }})
                                    }).catch(err=>console.log(err))
                                }},
                                {text: 'No', style:"cancel",onPress: () => {
                                    setShowReport(false)
                                }},
                            ]);
                        }} style={{width:"100%",paddingVertical:10,backgroundColor:COLORS.newBlue,borderBottomWidth:1,borderBottomColor:"white",paddingHorizontal:15}}>
                            <Text style={{textAlign:"left",color:"white",fontFamily:"Poppins",fontSize:17}}>Hide this product</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setReportCollapsed(!reportCollapsed)} style={{width:"100%",paddingVertical:10,backgroundColor:COLORS.newBlue,paddingHorizontal:15,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                            <Text style={{textAlign:"left",color:"white",fontFamily:"Poppins",fontSize:17}}>Flag this product</Text>
                            {<Feather name={reportCollapsed?"plus":"minus"} size={20} color="#fff" style={{paddingRight:10}} />}
                        </TouchableOpacity>
                        <Collapsible collapsed={reportCollapsed}>
                        <RadioButton.Item style={{paddingVertical:0}} position='trailing' label='Misleading post' color={COLORS.secondary} labelStyle={{fontFamily:"Poppins"}} value="misleading" onPress={()=>{setReportReason("misleading")}} status={reportReason==="misleading"?"checked":"unchecked"}/>
                        <RadioButton.Item style={{paddingVertical:0}} position='trailing' label='Inappropriate' color={COLORS.secondary} labelStyle={{fontFamily:"Poppins"}} value="inappropriate" onPress={()=>{setReportReason("inappropriate")}} status={reportReason==="inappropriate"?"checked":"unchecked"}/>
                        <RadioButton.Item style={{paddingVertical:0}} position='trailing' label='Other' color={COLORS.secondary} labelStyle={{fontFamily:"Poppins"}} value="other" onPress={()=>{setReportReason("other")}} status={reportReason==="other"?"checked":"unchecked"}/>
                            
                        {/* Report Text input */}
                        <TextInput style={{width:"100%",paddingVertical:10,backgroundColor:"white",paddingHorizontal:15,borderWidth:1,borderColor:"#ccc"}} numberOfLines={2} multiline={true} placeholder="Write your reason" placeholderTextColor="#ccc" onChangeText={(text)=>{setReportText(text)}} maxLength={50} value={reportText}/>
                        
                        {/* Send report button */}
                        <TouchableOpacity disabled={sendingReport} style={{width:"100%",paddingVertical:10,backgroundColor:COLORS.secondary,paddingHorizontal:15,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                            <Text style={{fontFamily:"Poppins",textAlign:"center",color:"white"}}>Send report</Text>
                            {sendingReport?<ActivityIndicator size={16} color="white"/>:<Feather name="send" size={20} color="white" />}
                        </TouchableOpacity>
                        {/* </TextInput> */}
                        </Collapsible>
                    </View>}
                </View>
                {/* <Image source={{uri:productData.images[0].secure_url}}/> */}
                <View style={{margin:10}}>
                    
                    {/* Product Name */}
                    <View style={{flexDirection:"row",alignItems:"flex-start"}}>
                        <View style={{flex:1}}>
                            <Text style={{fontFamily:"Poppins",fontSize:20,color:COLORS.secondary}}>{productData.name}</Text>
                        </View>
                        {/* Favorites indicator */}
                        <View style={{alignItems:"flex-end"}}>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <TouchableOpacity style={{marginRight:8}} onPress={()=>{
                                    storeData(id,productData.name,productData.images[0],productData.height,productData.height)
                                    setInFavorites(true)
                                }}>
                                    {/* {inFavorites===true?<FontAwesome name="bookmark" size={24} color={COLORS.secondary} />:<FontAwesome name="bookmark-o" size={28} color={COLORS.secondary} />} */}
                                    <Image source={require("../assets/save_product.png")} style={{width:40,height:40}}/>
                                </TouchableOpacity>
                                {/* Share product */} 
                                <TouchableOpacity onPress={()=>{
                                        handleShare(productData.shortPath)
                                }}>
                                    <Image source={require("../assets/share_product.png")} style={{width:40,height:40}}/>
                                    {/* <MaterialCommunityIcons name="share-outline" size={35}  color={COLORS.secondary} /> */}
                                </TouchableOpacity>
                            </View>
                            {/* Product condition */}
                            {/* <View style={{marginVertical:10,backgroundColor:"gray",paddingHorizontal:15,paddingVertical:5,borderRadius:3}}>
                                <Text style={{color:"white",fontFamily:"Poppins",fontSize:12}}>{productData.condition}!</Text>
                            </View> */}
                        </View>
                    </View>
                    
                    <View style={{marginTop:20,flexDirection:"row",gap:10}}>
                        {/* Description */}
                        <TouchableOpacity 
                            onPress={()=> {
                                bottomSheetRef.current?.setBottomSheetOption("Description")
                                bottomSheetRef.current?.scrollTo(-500)
                            }}
                            style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                            <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>Description</Text>
                        </TouchableOpacity>
                        {/* Reviews */}
                        <TouchableOpacity
                            onPress={()=> {
                                bottomSheetRef.current?.setBottomSheetOption("Reviews")
                                bottomSheetRef.current?.scrollTo(bottomSheetRef.current?.MAX_TRANSLATE_Y )
                            }}
                            style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                                <View style={{flexDirection:"row",justifyContent:"center"}}>
                                    <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>Reviews</Text>
                                    {reviews?.length>0&&<Badge backgroundColor={COLORS.secondary} containerStyle={{paddingHorizontal:5}} labelStyle={{fontSize:15}} label={reviewsLoading?<ActivityIndicator size={15} color='white'/>:reviews?.length} size={20}/>}
                                </View>
                        </TouchableOpacity>
                        {/* Related items */}
                        <TouchableOpacity
                            onPress={()=>{
                                bottomSheetRef.current?.setBottomSheetOption("RelatedItems")
                                bottomSheetRef.current?.scrollTo(-500)
                            }}
                            style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                            <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>Related Items</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Delivery info and Chat seller */}
                    <View style={{marginTop:10,flexDirection:"row",gap:10}}>
                        {/* Delivery info */}
                        <TouchableOpacity 
                                onPress={()=> {
                                    Alert.alert("Delivery Info","1. Pay on delivery for addresses within Greater Accra.\n\n2. Orders within Greater Accra are delivered on the same day, the next day, or within a maximum of 48 hours.\n\n3. Orders from all other regions in Ghana are delivered within 24 to 72 hrs excluding Sundays.",[
                                        {text: 'Ok', style:"cancel",onPress: () => {
                                        }},
                                    ])
                                }}
                            style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                                <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>Delivery Info</Text>
                        </TouchableOpacity>
                        {/* Chat Seller */}
                        <TouchableOpacity 
                            onPress={async () => {
                                  if (!user) return;
                                
                                  try {
                                    // Generate message ID
                                    const messageId = uuid.v4();
                                
                                    // Extract vendor info
                                    const vendorInfo = productData.vendorInfo;
                                    const isBusiness = vendorInfo.accountType === "business";
                                    const vendorEmail = isBusiness ? vendorInfo.businessEmail : vendorInfo.email;
                                    const vendorName = isBusiness
                                      ? vendorInfo.shopName
                                      : `${vendorInfo.firstName} ${vendorInfo.lastName}`;
                                    const vendorImage = vendorInfo.profileImage?vendorInfo.profileImage.secure_url : "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                
                                    // Extract user info
                                    const userName = `${user.firstName} ${user.lastName}`;
                                    const userAvatar = user.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                
                                    // Create accepted format message
                                    const imageUrl = productData.images[0].secure_url;
                                    const messageText = "📷 Hello is this product available";
                                    const createdAt = new Date().toISOString();
                                
                                    // Set message parameters
                                    setMessageParameters({
                                      email: vendorEmail,
                                      vendor_name: vendorName,
                                      vendor_image: vendorImage,
                                      addMessageByImages: true,
                                      dataToSend: JSON.stringify({
                                        _id: messageId,
                                        text: messageText,
                                        createdAt: new Date(),
                                        user: {
                                          _id: user.email,
                                          name: userName,
                                          avatar: userAvatar,
                                        },
                                        image: imageUrl,
                                      }),
                                    });
                                
                                    // Prepare data for Supabase
                                    const chatData = {
                                      sender_email: user.email,
                                      receiver_email: vendorEmail,
                                      text: messageText,
                                      metadata: {
                                        _id: user.email,
                                        avatar: userAvatar,
                                      },
                                      accepted_format: {
                                        _id: uuid.v4(),
                                        createdAt,
                                        text: messageText,
                                        image: imageUrl,
                                        user: {
                                          _id: user.email,
                                          avatar: userAvatar,
                                          name: userName,
                                        },
                                      },
                                      cus_name: userName,
                                      cus_image: userAvatar,
                                      vendor_name: vendorName,
                                      vendor_image: vendorImage,
                                    };
                                
                                    // Insert into Supabase
                                    const { data, error } = await supabaseClient
                                      .from("chat_table")
                                      .insert(chatData);
                                
                                    // console.log("DATA:", data, "ERROR:", error);
                                
                                    if (error) {
                                      Alert.alert("Supabase Error", error.message || "Unknown error");
                                      return;
                                    }
                                
                                    // Navigate to messages screen
                                    router.push("/(tabs)/Messages/messageScreen");
                                  } catch (error) {
                                    console.log("ERROR:", error);
                                    Alert.alert("Unexpected Error", error.message || "Something went wrong");
                                  }
                                }}

                            style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                            <View style={{flexDirection:"row",justifyContent:"center"}}>
                                <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>
                                    {searchingVendor ? <ActivityIndicator size={14} style={{paddingTop:4}} color={COLORS.redOrange}/> : "Chat "}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        
                        {/* Related items */}
                        <TouchableOpacity
                        onPress={()=>{
                             const vendorInfo = productData.vendorInfo;
                            const isBusiness = vendorInfo.accountType === "business";
                            const vendorEmail = isBusiness ? vendorInfo.businessEmail : vendorInfo.email;

                            const obj = {
                                vendorId:productData.accountOwnerID,
                                accountType:productData.accountType,
                                vendorEmail,
                              }
                              // console.log("INFO TO SEND",obj)
                              router.push({
                                pathname:"/vendorProfile",
                                params:obj
                              })
                        }}
                        style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                            <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>Vendor Profile</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* Sizes */}
                    {productData.selectedSizes.length!==0&&<View style={{marginTop:15}}>
                        <Text style={{fontFamily:"Poppins",fontSize:16}}>Sizes</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {productData.selectedSizes.map((item,index)=>{
                                // console.log(item)
                                return(
                                    <TouchableOpacity onPress={()=>{
                                        setSelectedSize(productData.selectedSizes[index])
                                    }} key={index} style={item===selectedSize?{marginRight:10,paddingVertical:8,paddingHorizontal:10,backgroundColor:"#ededed",borderRadius:10,borderWidth:2,borderColor:COLORS.redOrange}:{marginRight:10,paddingVertical:8,paddingHorizontal:10,backgroundColor:"#ededed",borderRadius:10,borderWidth:2,borderColor:"#ccc"}}>
                                        <Text style={{fontFamily:"Poppins",color:COLORS.secondary,fontSize:13}}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>}
                    {/* Colors */}
                    {productData.colors.length!==0&&<View style={{marginTop:15}}>
                        <Text style={{fontFamily:"Poppins",fontSize:16}}>Colors</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {productData.colors.map((item,index)=>{
                                return(
                                    <TouchableOpacity onPress={()=>{
                                        setSelectedColor(productData.colors[index])
                                    }} key={index} style={item===selectedColor?{marginRight:10,paddingVertical:18,paddingHorizontal:18,backgroundColor:item.trim(),borderRadius:10,borderWidth:2,borderColor:COLORS.redOrange}:{marginRight:10,paddingVertical:18,paddingHorizontal:18,backgroundColor:item.trim(),borderRadius:10,borderWidth:2,borderColor:"gray"}}>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>}
                    <View style={{marginTop:20,marginBottom:20}}>
                        <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <View>
                                <Text style={{color:COLORS.secondary,fontFamily:"PoppinsBold",fontSize:23}}>GH₵ {(productData.price).toFixed(2)}</Text>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <TouchableOpacity disabled={quantity>=2?false:true} onPress={()=>{
                                    setQuantity(prev=>prev-1)
                                }} style={{padding:5,backgroundColor:COLORS.gray,borderRadius:50}}><Feather name="minus" size={20} color="white" /></TouchableOpacity>
                                <Text style={{marginHorizontal:10,fontSize:20,fontFamily:"PoppinsBold",color:COLORS.secondary}}>{quantity}</Text>
                                <TouchableOpacity onPress={()=>{
                                    setQuantity(prev=>prev+1)
                                }} style={{padding:5,backgroundColor:COLORS.gray,borderRadius:50}}><Feather name="plus" size={20} color="white" /></TouchableOpacity>
                            </View>
                        </View>
                        
                        <View style={{marginTop:10}}>
                        
                        <TouchableOpacity onPress={()=>{
                            
                            const data={accountOwnerID:productData.accountOwnerID,accountType:productData.accountType,id:productData._id,name:productData.name,images:productData.images,selectedColor,selectedSize,price:productData.price,quantity}
                            
                            // Checking existence in cart
                            const checkExistence = ()=>{
                                let state=false
                                selectedProductsReducer.forEach(item=>{
                                    if(item.id===data.id && item.selectedSize===data.selectedSize && item.selectedColor===data.selectedColor){
                                        state=true
                                        Alert.alert('Product already selected', '', [
                                            {
                                                text: 'Ok',
                                                style:"cancel"
                                            }
                                        ]);
                                    }
                                })
                                return state
                            }
                            if(!checkExistence()){
                                dispatch(addToSelectedProducts(data))
                                playSuccess()
                            }
                        }} style={{backgroundColor:COLORS.redOrange,marginTop:8,paddingVertical:20,borderRadius:20}}>
                            <Text style={{textAlign:"center",fontFamily:"Poppins",color:"white",fontSize:20}}>Add to cart</Text>
                        </TouchableOpacity>
                        </View>
                        
                    </View>
                    
                    {/* On page related Items */}
                    <View>
                        <Text style={{fontFamily:"Poppins",fontSize:15,color:COLORS.secondary}}>Related Items</Text>
                        <View>
                        
                        <ScrollView showsHorizontalScrollIndicator={false}   horizontal={true}>
                        
                        {
                            
                            onPageRelatedItems.map((item,index)=>{
                                
                                return(
                                        <TouchableOpacity key={index} onPress={()=>{
                                            router.push(`shop/products/${item._id}`)
                                            // navigator.navigate("HOME",{screen:"ViewProductMainScreen",params:{id:item._id}})
                                            setRefreshPage(!refreshPage)
                                            // dispatch()
                                        }}>
                                            <View style={{marginHorizontal:5,borderRadius:100}} key={index}>
                                            <ProductImageComponent source={item.images[0].secure_url} style={{width:95,height:128,borderRadius:10}}/>
                                                <Text style={{fontFamily:"Mortend",marginVertical:5,color:"gray"}}>₵ {item.price.toFixed(2)}</Text>
                                            </View>
                                        </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                        </View>
                    </View>
                </View>
            </ScrollView>
            {/* BOTTOM SHEET  */}

            <ViewProductsBottomSheet buyerImagesLoading={buyerImagesLoading} buyerImages={buyerImages} fetchProductReview={fetchProductReview} reviewsLoading={reviewsLoading} reviews={reviews} setFetchProductReview={setFetchProductReview} refreshPage={refreshPage} setRefreshPage={setRefreshPage} ref={bottomSheetRef} productData={productData} initialHeight={bottomSheetInitialHeight}/>
        {/* </SafeAreaView> */}
        </>
    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

export default ViewProductMainScreen