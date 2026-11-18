import { View, Text, StatusBar,ScrollView,TouchableOpacity,Image,ImageBackground,FlatList,Alert,Dimensions,Share } from 'react-native'
import React, { useState,useEffect, useContext } from 'react'
import { COLORS } from '../constants/theme';
import styles from '../styles/ProfileMainScreenStyle';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import EachItem from '../components/EachVendorItem';
// import { useNavigation,useRoute,useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import EachVendorVideo from '../components/EachVendorVideo';
import { MasonryFlashList } from "@shopify/flash-list";
import { Audio } from 'expo-av';
import { useSelector,useDispatch } from 'react-redux';
import moment from 'moment';
import { removeProductAddedToBlockedProducts,enableCanSearchVendorAccountSwitch,addSelectedVendorToChat } from '../Actions'
import { addToSelectedProducts,addMessage, addVendorToAllMessages,resetMessages } from '../Actions'
import uuid from 'react-native-uuid';
import LottieView from 'lottie-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ParentContext } from '../context/ParentContext';
import useUserAccountObject from '../hooks/useUserAccountObject';
import { supabaseClient } from '../utils/supabase-client';
const VendorProfileScreenForHomeStack = ({setLoggedIn,refreshPage,setRefreshPage}) => {
    
    const [sound, setSound] = useState();
    const [searchingVendor,setSearchingVendor] = useState(false)
    
    const userObjectReducer = useSelector(state=>state.userObjectReducer)
    
    const {setMessageParameters} = useContext(ParentContext)
    // const navigator = useNavigation()
    
    const dispatch = useDispatch()
    
    async function playSuccess() {

      const { sound } = await Audio.Sound.createAsync( require("../assets/sounds/success.mp3"))
      ;
      setSound(sound);

      await sound.playAsync();
    }

  
    
    const enableButton = sendingOrder
    // const route = useRoute()
    
    
    const {vendorId,accountType,vendorEmail,vendorInfo} = useLocalSearchParams()
    
    
    


    const [itemsOrVideosSelected,setItemsOrVideosSelected] = useState("items")
    const [products,setProducts]=useState([])
    const [videos,setVideos]  = useState([])
    const [accountObject,setAccountObject] = useState({})
    const [loading,setLoading] = useState(true)
    const [sendingOrder,setSendingOrder] = useState(true)
    const [fetchMoreData,setFetchMoreData] = useState(false)
    const [fetchMoreVideos,setFetchMoreVideos] = useState(false)

    const [productsLoading,setProductsLoading] = useState(true)
    const [videosLoading,setVideosLoading] = useState(true)
    const [subscribed,setSubscribed] = useState(false)

    const [subsCount,setSubsCount] = useState()
    
    
    const [vendorProductAndVideoCount,setVendorProductAndVideoCount]=useState({
        productCount:0,
        videoCount:0
    })
    
    function formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(2) + 'K';
        } else {
            return number.toString();
        }
    }

    
    const subscribeToAVendor = async(vendorEmail,buyerEmail)=>{
        try {
            
            const responseFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/subscribe-to-vendor",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({vendorEmail:vendorEmail,buyerEmail:buyerEmail})
            })
            const data = await responseFromDB.json()
            if(data.msg){
                Alert.alert('Subscription', 'You would be notified when the vendor post a new product.', [
                    {
                        text: 'Ok',
                        onPress: () => {
                            setSubscribed(true)
                            playSuccess()
                        },
                    },
                ]);
            }
        } catch (error) {
            console.log("ERROR",error)
        }
    }
    
    
    const unsubscribeToAVendor = async(vendorEmail,buyerEmail)=>{
        // console.log("VV")
        try {
            
            const responseFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/unsubscribe-vendor",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({vendorEmail:vendorEmail,buyerEmail:buyerEmail})
            })
            const data = await responseFromDB.json()
            // console.log("DA",data)
            if(data.msg){
                Alert.alert('Subscription', 'You have successfully unsubscribed to this vendor.', [
                    {
                        text: 'Ok',
                        onPress: () => {
                            setSubscribed(false)
                            playSuccess()
                        },
                        // onPress: () => setSubscribed(true),
                    },
                ]);
            }
        } catch (error) {
            console.log("ERROR",error)
        }
    }
    
    const checkSubscription = async(vendorEmail,buyerEmail)=>{
        try {
            const responseFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/check-subscription-route",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({vendorEmail:vendorEmail,buyerEmail:buyerEmail})
            })
            const data= await responseFromDB.json()
            if(data.msg){
                setSubscribed(true)
            }else{
                setSubscribed(false)
            }
            // if(data.msg){}
        } catch (error) {
            console.log(error.message)
        }
    }
    const getSubsCount = async(vendorEmail)=>{
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/count-subscribers",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({vendorEmail:vendorEmail})
            })
            const data = await response.json()
            setSubsCount(data.msg)
            // console.log("COUNT",typeof(data.msg))
        } catch (error) {
            console.log("ERR",error.message)
        }
    }
    

    const countVendorTotalProductsAndVideos = async(vendorId)=>{
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/app/count-vendor-product-and-video",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({vendorId})
            })
            const data = await response.json()
            setVendorProductAndVideoCount(data.msg)
            console.log("COUNT DATA",data)
        } catch (error) {
            console.log("ERROR COUNTING",error.msg)
        }
    }

    const getProducts = async(vendorId)=>{
        
        let dateToSend = null
        if(products.length===0){
                dateToSend = Date.now()
        }else{
                dateToSend = products[products.length-1].createdAt
                
        }
        try {
            setProductsLoading(true)
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-vendor-products-for-video-main-screen",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({vendorId,createdAt:dateToSend})
            })
            const data = await response.json()
            
            // console.log("DATA",data)
            setProducts([...products,...data.msg])
            if(data.msg.length<8){
                setFetchMoreData(false) 
            }else{
                setFetchMoreData(true)
            }
            setProductsLoading(false)
        } catch (error) {
            console.log(error.message)
            setProductsLoading(false)
        }
    }
    
    useEffect(()=>{
        getProducts(vendorId)    
        countVendorTotalProductsAndVideos(vendorId)
    },[])
    
    const getVendorProfile = async(vendorId,accountType)=>{
        // console.log(vendorId,accountType)
        setLoading(true)
        try {
            const res = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-vendor-of-products",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({details:[{vendorId,accountType}]})
            })
            const data = await res.json()
            console.log("PROFILE",data.msg)
            setAccountObject(data.msg[0])
            setLoading(false)
            // console.log("DETAILS",data)
        } catch (error) {
            console.log(error.message)
        }
    }
    
    
    useEffect(()=>{

        getVendorProfile(vendorId,accountType)
        getSubsCount(vendorEmail)
        AsyncStorage.getItem("userAccountObject").then(data=>{
            
            const dataToSend = {
                vendorEmail:vendorEmail,
                buyerEmail:JSON.parse(data).email,
            }
            // console.log("DATA TO SEND",dataToSend)
            checkSubscription(dataToSend.vendorEmail,dataToSend.buyerEmail)
            // console.log("DATA",dataToSend)
        }).catch(err=>console.log("ERROR",err.message))
    },[])

    const getVideos = async(vendorId)=>{
        let dateToSend = null
        if(videos.length===0){
                dateToSend = Date.now()
        }else{
                // console.log(videos[videos.length-1])
                dateToSend = videos[videos.length-1].createdAt
        }
        // console.log("DATATOSEND",dateToSend)
        try {
            setVideosLoading(true)
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-vendor-video-for-videos-main-screen",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({vendorId,createdAt:dateToSend})
            })
            const data = await response.json()
            // setProducts([...products,...data.msg])
            setVideos([...videos,...data.msg])
            if(data.msg.length<4){
                setFetchMoreVideos(false) 
            }else{
                setFetchMoreVideos(true)
            }
            // console.log("VIDEOS",data.msg)
            setVideosLoading(false)
        } catch (error) {
            console.log(error.message)
            setVideosLoading(false)
        }
    }
    useEffect(()=>{

        getVideos(vendorId)
    },[])


    const height = Dimensions.get("window").height

    const handleLoginRequired = () => {
        Alert.alert('Login to continue', '', [
            {
                text: 'Later',
                style: "destructive",
                onPress: () => {
                    setSearchingVendor(false);
                }
            },
            {
                text: 'Login',
                style: "cancel",
                onPress: () => {
                    setLoggedIn(false);
                    setSearchingVendor(false);
                }
            },
        ]);
    };

    const fetchVendorInfo = async (vendorId, accountType) => {
        try {
            const result = await fetch(`${process.env.EXPO_PUBLIC_SERVER_ROUTE}/api/get-vendor-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    details: [{ accountOwnerID: vendorId, accountType: accountType }]
                }),
            });
            const data = await result.json();
            return data.msg;
        } catch (error) {
            console.log("ERROR while fetching vendor info:", error);
            throw error;
        }
    };

    const initializeChat = (vendorInfo) => {
        const idGenerated = uuid.v4();
        const initialMessage = {
            _id: idGenerated,
            text: 'Hello 👋',
            createdAt: new Date(),
            user: {
                _id: userObjectReducer.email,
                name: userObjectReducer.firstName + " " + userObjectReducer.lastName,
                avatar: userObjectReducer.profileImage || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            },
        };

        dispatch(resetMessages());
        dispatch(addMessage(initialMessage));
        dispatch(enableCanSearchVendorAccountSwitch());
        dispatch(addSelectedVendorToChat({
            accountOwnerID: vendorId,
            accountType: accountType,
        }));

        setMessageParameters({
            email: vendorInfo.email,
            vendor_name: vendorInfo.name,
            vendor_image: vendorInfo.profileImage,
            addMessageByImages: 1,
            dataToSend: JSON.stringify(initialMessage),
        });

        router.push("/(tabs)/Messages/messageScreen");
    };

    const handleMessageVendor = async () => {
        setSearchingVendor(true);
        
        try {
            const userData = await AsyncStorage.getItem("userAccountObject");
            
            if (!userData) {
                handleLoginRequired();
                return;
            }

            const vendorInfo = await fetchVendorInfo(vendorId, accountType);
            initializeChat(vendorInfo);
        } catch (error) {
            console.log("Failed to contact vendor:", error);
            Alert.alert("Oops!", "Couldn't connect to the vendor. Please try again.");
        } finally {
            setSearchingVendor(false);
        }
    };
    
   const handleShare = async (shortPath) => {
      try {
        
        const url = shortPath
    
        await Share.share({
          message: `${url}`,
          title: 'Nexotin Vendor Profile',
        });
      } catch (error) {
        console.error('Error sharing:', error.message);
      }
    };
    
    const {user} = useUserAccountObject()
    
    const getAllVendorInfoFromServer = async(details)=>{
        try {
            const result = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-vendor-email",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({details:[{accountOwnerID:details.accountOwnerID,accountType:details.accountType}]})
            })
            const d = await result.json()
            return d.msg
        } catch (error) {
            console.log("ERROR",error)
        }
    }

    if(loading){
        return(
            <View style={[{ alignItems:"center",backgroundColor:"white"},{height}]}>
                <StatusBar translucent backgroundColor="transparent" />
                <View style={{height:400,width:"100%",justifyContent:"center",alignItems:"center"}}>
                    <LottieView style={{width:100,height:350}} autoPlay source={require("../lottieAnimations/loading.json")}/>
                </View>
            </View>
        )
    }
    
    

    return (
        <View style={{flex:1,alignItems:"center"}}>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={{width:"100%",justifyContent:"center",alignItems:"center",flex:1,backgroundColor:"white"}}>
                {/* Banner picture */}
                
                <ImageBackground source={accountObject.bannerImage?{uri:accountObject.bannerImage.secure_url}:{uri:"https://i.pinimg.com/1200x/1e/d2/ac/1ed2ac411a36cfb14c3d95b110379f7c.jpg"}} resizeMode='cover' style={styles.bannerContainer}> 
                </ImageBackground> 
                
                {/* Profile information */} 
                <View style={styles.profileInformationContainer}>
                    <View style={styles.profileInformationLeft}>
                        <Image style={{width:50,height:50,borderRadius:50}} source={accountObject.profileImage?{uri:accountObject.profileImage.secure_url}:{uri:"https://cdn-icons-png.flaticon.com/512/149/149071.png"}}/>
                    </View>
                    {/* Center */}
                    <View style={styles.profileInformationCenter}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={{fontFamily:"Poppins",fontSize:16}}>{accountObject.accountType!=="business"?accountObject.firstName:accountObject.shopName} </Text>
                            {accountObject.accountType==="individual"?
                            <Octicons name="person" style={{marginHorizontal:10}} size={20} color={COLORS.primary} />:<MaterialIcons name="storefront" size={20} color={COLORS.primary} />
                            }
                            {/* {accountObject.verified===true?<Octicons name="verified" size={24} color={COLORS.primary} />:null} */}
                        </View>
                        <View>
                            <Text style={{color:"gray",fontFamily:"Poppins",fontSize:11}}>Joined {moment(accountObject.createdAt).fromNow()}</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                        </View>
                    </View>
                    {/* Last */}
                    <View style={{justifyContent:"center",marginRight:10}}>
                        <Text style={{textAlign:"center",fontFamily:"Mortend"}}>{subsCount&&formatNumber(subsCount)}</Text>
                        <View style={{marginBottom:5,flexDirection:"row",alignItems:"center",gap:2}}>
                            <Text style={{fontSize:10,textAlign:"center",fontFamily:"Poppins",color:"gray"}}>Subscribers</Text>
                        </View>
                    </View>
                </View>
                {/* Message */}
                <View style={{alignItems:"center",width:"95%",flexDirection:"row",marginVertical:10,gap:10}}>
                <TouchableOpacity 
                    onPress={async () => {
                        if (!user || !accountObject) return;
                        // setSearchingVendor(true);
                    
                        try {
                          const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    
                          // Determine vendor email and name based on account type
                          const isBusiness = accountType === "business";
                    
                          const vendorEmail = isBusiness
                            ? accountObject.businessEmail
                            : accountObject.email;
                    
                          const vendorName = isBusiness
                            ? accountObject.shopName
                            : `${accountObject.firstName} ${accountObject.lastName}`;
                          const vendorImage = accountObject.profileImage?accountObject.profileImage.secure_url : defaultAvatar;
                    
                          const userName = `${user.firstName} ${user.lastName}`;
                          const userAvatar = user.profileImage || defaultAvatar;
                          const textMessage = "Hello 👋";
                          const createdAt = new Date();
                    
                          const messageId = uuid.v4();
                    
                          // Set message parameters for UI
                          setMessageParameters({
                            email: vendorEmail,
                            vendor_name: vendorName,
                            vendor_image: vendorImage,
                            addMessageByImages: false,
                            dataToSend: JSON.stringify({
                              _id: messageId,
                              text: textMessage,
                              createdAt,
                              user: {
                                _id: user.email,
                                name: userName,
                                avatar: userAvatar,
                              },
                            }),
                          });
                    
                          // Prepare and insert chat message into Supabase
                          const chatData = {
                            sender_email: user.email,
                            receiver_email: vendorEmail,
                            text: textMessage,
                            metadata: {
                              _id: user.email,
                              avatar: userAvatar,
                            },
                            accepted_format: {
                              _id: uuid.v4(),
                              createdAt: createdAt.toISOString(),
                              text: textMessage,
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
                    
                          const { data, error } = await supabaseClient
                            .from("chat_table")
                            .insert(chatData);
                    
                          if (error) {
                            Alert.alert("Supabase Error", error.msg);
                            return;
                          }
                    
                         
                          router.push("/(tabs)/Messages/messageScreen");
                        } catch (err) {
                          console.error("Unexpected Error:", err);
                          Alert.alert("Unexpected Error", err.msg);
                          
                        }
                      }}
                    style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                    <View style={{flexDirection:"row",justifyContent:"center"}}>
                        <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>
                            {searchingVendor ? <ActivityIndicator size={14} style={{paddingTop:4}} color={COLORS.redOrange}/> : "Message"}
                        </Text>
                    </View>
                </TouchableOpacity>
                
                {/* Subscribe */}
                <TouchableOpacity onPress={()=>{
                        
                        AsyncStorage.getItem("userAccountObject").then(data=>{
                            if(data===null){
                                Alert.alert('Login to continue', '', [
                                    {text: 'Later', style:"destructive",onPress: () => {
                                    }},
                                    {text: 'Login', style:"cancel",onPress: () => {
                                        setLoggedIn(false)
                                    }},
                                ]);
                            }else{
                                if(subscribed){
                                    // console.log("REMOVE SUBSCRIPTION")
                                    AsyncStorage.getItem("userAccountObject").then(data=>{
                                        // console.log("ACCOUNT",data)
                                        const dataToSend = {
                                            vendorEmail:accountObject.email,
                                            buyerEmail:JSON.parse(data).email,
                                            
                                        }
                                        // console.log("DA",dataToSend)
                                        unsubscribeToAVendor(vendorEmail,dataToSend.buyerEmail)
                                        setSubsCount(prev=>prev-=1)
                                        setSubscribed(false)
                                    }).catch(err=>console.log("ERROR",err.message))
                                    
                                    return
                                }else{
                                    AsyncStorage.getItem("userAccountObject").then(data=>{
                                        const dataToSend = {
                                            vendorEmail:accountObject.email,
                                            buyerEmail:JSON.parse(data).email,
                                            
                                        }
                                        subscribeToAVendor(vendorEmail,dataToSend.buyerEmail)
                                        setSubsCount(prev=>prev+=1)
                                    }).catch(err=>console.log("ERROR",err.message))
                                }
                            }})
            
                }} style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                    <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>Subscribe</Text>
                </TouchableOpacity>
                
                {/* Share Profile */}
                <TouchableOpacity onPress={()=>{
                        handleShare(accountObject.shortPath)
                }}>
                    <Image source={require("../assets/share_product.png")} style={{width:32,height:32}}/>
                    {/* <MaterialCommunityIcons name="share-outline" size={35}  color={COLORS.secondary} /> */}
                </TouchableOpacity>
                </View>
                {/* Videos or Items */}
                <View style={styles.profileVideosAndItemsContainer}>
                    <View style={styles.profileVideosAndItemsSelectionContainer}>
                        <TouchableOpacity onPress={()=>{
                            setItemsOrVideosSelected("items")
                        }} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",flex:1}}>
                            <FontAwesome5 name="border-all" size={24} color={itemsOrVideosSelected==="items"?COLORS.redOrange:"gray"} />
                            <Text style={{margin:5,fontFamily:"Mortend",fontSize:16}}>{vendorProductAndVideoCount.productCount}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            setItemsOrVideosSelected("videos")
                        }} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",flex:1}}>
                            <MaterialIcons name="video-collection" size={24} color={itemsOrVideosSelected==="videos"?COLORS.redOrange:"gray"} />
                            <Text style={{margin:5,fontFamily:"Mortend",fontSize:16}}>{vendorProductAndVideoCount.videoCount}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Border bottom */}
                    <View style={styles.profileVideosAndItemsBorderBottomContainer}>
                        <View style={{backgroundColor:itemsOrVideosSelected==="items"?COLORS.primary:"gray",height:3,flex:1}}>
                        </View>
                        <View style={{backgroundColor:itemsOrVideosSelected==="videos"?COLORS.primary:"gray",height:3,flex:1}}>
                        </View>
                    </View>
                    {/* All videos and Items */}
                    {productsLoading&&videosLoading===true?<View style={{height:400,width:"100%",justifyContent:"center",alignItems:"center"}}>
                    <LottieView style={{width:100,height:350}} autoPlay source={require("../lottieAnimations/loading.json")}/>
                </View>:
                    <View style={styles.profileMainVideosAndItemsContainer}>
                        {itemsOrVideosSelected==="items"?
                                <MasonryFlashList
                                data={products}
                                // keyExtractor={(item) =>  item.id}
                                numColumns={2}
                                
                                onEndReached={()=>{
                                    if(fetchMoreData){
                                        getProducts(vendorId)
                                    }
                                }}
                                onEndReachedThreshold={0.05}
                                // columnWrapperStyle={{ justifyContent: "space-around"}}
                                // contentContainerStyle={{ paddingBottom: 100,paddingHorizontal:5}}
                                // showsVerticalScrollIndicator={false} 
                                renderItem={({item})=><EachItem refreshPage={refreshPage} setRefreshPage={setRefreshPage} item={item}/>
                                }
                            />
                        :
                            <MasonryFlashList
                                data={videos}
                                keyExtractor={(item) =>  item._id}
                                numColumns={2}
                                onEndReached={()=>{
                                    if(fetchMoreVideos){
                                        getVideos(vendorId)
                                    }
                                }}
                                onEndReachedThreshold={0.05}
                                columnWrapperStyle={{ justifyContent: "space-around"}}
                                contentContainerStyle={{ paddingBottom: 100,paddingHorizontal:5}}
                                showsVerticalScrollIndicator={false} 
                                renderItem={({item})=><EachVendorVideo item={item}/>
                                }
                            />
                        }
                        
                    </View>}
                </View>
            </View>
        </View>
    )
}

export default VendorProfileScreenForHomeStack