import { View, Text, StatusBar,ScrollView,TouchableOpacity,Image,ImageBackground,FlatList,Alert,Dimensions } from 'react-native'
import React, { useState,useEffect } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from '../constants/theme';
import styles from '../styles/ProfileMainScreenStyle';
// import styles from '../styles/ProfileMainScreenStyle';
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
// import MasonryList from '@react-native-seoul/masonry-list';
import EachItem from '../components/EachVendorItem';
// import { useNavigation,useRoute,useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import EachVendorVideo from '../components/EachVendorVideo';
import { MasonryFlashList } from "@shopify/flash-list";
import { Audio } from 'expo-av';
import moment from "moment";
import { removeProductAddedToBlockedProducts,enableCanSearchVendorAccountSwitch,addSelectedVendorToChat } from '../Actions'
import { addToSelectedProducts,addMessage, addVendorToAllMessages,resetMessages } from '../Actions'
import { useSelector,useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';
import uuid from "react-native-uuid"


const VendorProfileScreen = ({setLoggedIn,setInVideoScreen}) => {
    
    const [sound, setSound] = useState();
    const [searchingVendor,setSearchingVendor] = useState(false)
    
    const dispatch = useDispatch()
    const userObjectReducer = useSelector(state=>state.userObjectReducer)
    
    
    async function playSuccess() {
        const { sound } = await Audio.Sound.createAsync( require("../assets/sounds/success.mp3"));
        setSound(sound);
        await sound.playAsync();
    }
    
    
    const enableButton = sendingOrder
    const route = useRoute()
    const {vendorId,accountType,vendorEmail} = route.params
    
    const [itemsOrVideosSelected,setItemsOrVideosSelected] = useState("items")
    const [products,setProducts]=useState([])
    const [videos,setVideos]  = useState([])
    // const navigator = useNavigation()
    const isFocussed = useIsFocused()
    const [accountObject,setAccountObject] = useState({})
    const [loading,setLoading] = useState(true)
    const [sendingOrder,setSendingOrder] = useState(true)
    const [fetchMoreData,setFetchMoreData] = useState(false)
    const [fetchMoreVideos,setFetchMoreVideos] = useState(false)

    const [productsLoading,setProductsLoading] = useState(true)
    const [videosLoading,setVideosLoading] = useState(true)
    const [subscribed,setSubscribed] = useState(false)
    const [userAccountObject,setUserAccountObject] = useState() 
    const [subsCount,setSubsCount] = useState()
    
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
    
    useEffect(() => {
        if (!isFocussed) {
            setInVideoScreen(false)
        } else {
            setInVideoScreen(true)
        }
    }, [isFocussed])

    const getProducts = async(vendorId)=>{
        let dateToSend = null
        if(products.length===0){
                dateToSend = Date.now()
        }else{
                dateToSend = products[products.length-1].createdAt
                //todo print name of last element
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
            setAccountObject(data.msg[0])
            // console.log(data.msg[0])
            if(data.msg.length<5){
          setFetchMoreData(false) 
      }else{
          setFetchMoreData(true)
      }
            // console.log(accountObject.createdAt)
            // console.log("ACC",data.msg)
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
            // console.log("ACC",accountObject)
            const dataToSend = {
                vendorEmail:vendorEmail,
                buyerEmail:JSON.parse(data).email,
            }
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
                    </View>
                        <View>
                            {/* <Text style={{color:"gray",fontFamily:"Poppins",fontSize:14}}>Joined {new Date(accountObject.createdAt).toUTCString().split(" ")[2] +", "+ new Date(accountObject.createdAt).toUTCString().split(" ")[3]}</Text> */}
                            <Text style={{color:"gray",fontFamily:"Poppins",fontSize:14}}>Joined {moment(accountObject.createdAt).fromNow()}</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                        </View>
                    </View>
                    
                    <View style={{justifyContent:"center",marginRight:10}}>
                        <Text style={{textAlign:"center",fontFamily:"Mortend"}}>{subsCount&&formatNumber(subsCount)}</Text>
                            <View style={{marginBottom:5,flexDirection:"row",alignItems:"center",gap:2}}>
                                <Text style={{fontSize:10,textAlign:"center",fontFamily:"Poppins",color:"gray"}}>Subscribers</Text>
                            </View>
                        {/* <TouchableOpacity onPress={()=>{
                            // sound.play();

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
                        }} style={{backgroundColor:subscribed?COLORS.redOrange:COLORS.secondary,marginRight:10,borderRadius:50}}>
                            <Text style={{textAlign:"center",color:"white",padding:10,fontSize:10,fontFamily:"Poppins"}}>{subscribed?"Unsubscribe":"Subscribe"}</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
                
                <View style={{alignItems:"center",width:"95%",flexDirection:"row",marginVertical:10,gap:10}}>
                <TouchableOpacity 
                            onPress={()=> {
                                setSearchingVendor(true)
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
                                        //   Find the email of the product vendor
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
                                        
                                        getAllVendorInfoFromServer({"accountOwnerID":vendorId,"accountType":accountType}).then(dataOfVendor=>{
                                            const idGenerated = uuid.v4()
                                            dispatch(resetMessages())
                                            dispatch(addMessage({
                                                _id: idGenerated,
                                                text: 'Hello 👋',
                                                createdAt: new Date(),
                                                user: {
                                                    _id: userObjectReducer.email,
                                                    name:userObjectReducer.firstName+ " " + userObjectReducer.lastName,
                                                    avatar:userObjectReducer.profileImage?userObjectReducer.profileImage:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                                },
                                            }))
                                            dispatch(enableCanSearchVendorAccountSwitch())
                                            dispatch(addSelectedVendorToChat({
                                                accountOwnerID:vendorId,
                                                accountType:accountType
                                            }))
                                            setSearchingVendor(false)
                                            router.push({
                                                pathname:"/(tabs)/Messages/messageScreen",
                                                params:{screen:"MessageScreen",params:{email:dataOfVendor.email,vendor_name:dataOfVendor.name,vendor_image:dataOfVendor.profileImage,addMessageByImages:1,
                                                        dataToSend:JSON.stringify({
                                                        _id: idGenerated,
                                                        text: 'Hello 👋',
                                                        createdAt: new Date(),
                                                        user: {
                                                            _id: userObjectReducer.email,
                                                            name:userObjectReducer.firstName+ " " + userObjectReducer.lastName,
                                                            avatar:userObjectReducer.profileImage?userObjectReducer.profileImage:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                                        },
                                                    })}}
                                            })
                                            // navigator.navigate("MESSAGES",)
                                        })
                                    }
                                })
                        
                            }}
                            style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                                <View style={{flexDirection:"row",justifyContent:"center"}}>
                                    <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>{searchingVendor?<View style={{height:400,width:"100%",justifyContent:"center",alignItems:"center"}}>
                        <LottieView style={{width:100,height:350}} autoPlay source={require("../lottieAnimations/loading.json")}/>
                    </View>:"Message"}</Text>
                                
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={()=>{
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
                        }} style={{flex:1,backgroundColor:"#ededed",padding:7,borderRadius:10}}>
                            <Text style={{textAlign:"center",color:COLORS.secondary,fontSize:14,fontFamily:"Poppins"}}>Subscribe</Text>
                        </TouchableOpacity>
                </View>
                
                {/* Videos or Items */}
                <View style={styles.profileVideosAndItemsContainer}>
                    <View style={styles.profileVideosAndItemsSelectionContainer}>
                        <TouchableOpacity onPress={()=>{
                            setItemsOrVideosSelected("items")
                        }} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",flex:1}}>
                            <FontAwesome5 name="border-all" size={24} color={itemsOrVideosSelected==="items"?COLORS.redOrange:"gray"} />
                            <Text style={{margin:5,fontFamily:"Mortend",fontSize:16}}>{products?products.length:null}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            setItemsOrVideosSelected("videos")
                        }} style={{flexDirection:"row",alignItems:"center",justifyContent:"center",flex:1}}>
                            <MaterialIcons name="video-collection" size={24} color={itemsOrVideosSelected==="videos"?COLORS.redOrange:"gray"} />
                            <Text style={{margin:5,fontFamily:"Mortend",fontSize:16}}>{videos?videos.length:null}</Text>
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
                                    showsVerticalScrollIndicator={false}
                                    // keyExtractor={(item) =>  item.id}
                                    numColumns={2}
                                    estimatedItemSize={2000}
                                    onEndReached={()=>{
                                        if(fetchMoreData){
                                            getProducts(vendorId)
                                        }
                                    }}
                                    onEndReachedThreshold={0.05}
                                    renderItem={({item})=><EachItem item={item}/>
                                }
                            />
                        :
                            <MasonryFlashList
                                data={videos}
                                keyExtractor={(item) =>  item._id}
                                numColumns={2}
                                estimatedItemSize={200}
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

export default VendorProfileScreen