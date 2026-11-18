import { View, Text,Dimensions,TouchableOpacity,Image,TextInput,Alert } from 'react-native'
import React,{forwardRef, useEffect, useImperativeHandle, useRef,useState,useCallback} from 'react'
import { Video, ResizeMode } from 'expo-av';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import DisplayVendorVideoImage from './DisplayVendorVideoImage';
import DisplayVendorNameOfVideo from './DisplayVendorNameOfVideo';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { removeVideoAddedToBlockedVideos } from '../Actions'
import { RadioButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useDispatch} from "react-redux"
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const EachVideo = forwardRef(({buyerEmail,index,currentVideo,video,pauseVideoMain},parentRef) => {

    // console.log("VIDE0",video)

    function formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(2) + 'K';
        } else {
            return number.toString();
        }
    }


    // const navigation = useNavigation()
    
    const transformVideo = (video)=>{
        let cuts = video.split("/")
        let newCuts = cuts.slice(0,cuts.length-3)
        let videoURL = cuts.slice(cuts.length-3)
        let linkWithoutExtension = videoURL[videoURL.length-1].split(".")[0]
        let extension = videoURL[videoURL.length-1].split(".")[1]
        extension="mp4"
        let newVideoURL = videoURL[0]+"/"+videoURL[1]+"/"+linkWithoutExtension+"."+extension

        // console.log(newCuts.join("/")+"/q_auto:low/"+newVideoURL)
        // console.log(newCuts.join("/")+"/q_auto:low/"+videoURL.join("/"))
        // return newCuts.join("/")+"/q_auto:low/"+videoURL.join("/")
        return newCuts.join("/")+"/q_auto:low/"+newVideoURL
    }

    const {height,width} = Dimensions.get("window")
    const ref = useRef()
    
    const [vidIndex,setVidIndex] = useState(index)

    const [muteVideo,setMuteVideo]=useState(false)
    
    const [vendorProfile,setVendorProfile] = useState({}) 
    const [loadingProfile,setLoadingProfile] = useState(true)
    
    const [prevLikesCount,sePrevLikesCount] = useState(8)
    const [likesCount,setLikesCount] = useState(8)
    const [likesInformation,setLikesInformation] = useState()
    
    const [showReport,setShowReport] = useState(false)
    
    const [reportCollapsed,setReportCollapsed] = useState(true) 
    const [reportReason,setReportReason] = useState("misleading")
    const [reportText,setReportText] = useState("")
    const [sendingReport,setSendingReport] = useState(false)
    
    const dispatch = useDispatch()
    
    const play = async () => {


        try {
            await ref.current.playAsync();
        } catch (error) {
          // Handle the error here, e.g., log it or take appropriate action.
            console.error("Error in playAsync:", error);
        }
    };

    /**const play = async()=>{
        ref.current.playAsync()
        // try {
        //     if(ref.current){
        //         ref.current.playAsync()
        //     }
        // } catch (error) {
        //     console.log(error.message)
        // }
        
        // if(ref.current===null){
        //     return 
        // }
        // const status = await ref.current.getStatusAsync();
        // if(status?.isPlaying()){
        //     return
        // }
        // try {
        //     await ref.current.playAsync()
        // } catch (error) {
        //     console.log(error.message)
        // }
    }**/
    
    const stop = async () => {

        try {
            await ref.current.stopAsync()
            // if(ref.current){
            //         }
        } catch (error) {
          // Handle the error here, e.g., log it or take appropriate action.
          console.error("Error in stopAsync:", error);
        }
      };
    
    /**const stop = async()=>{
        // console.log(ref.current.getStatusAsync())
        ref.current.stopAsync()
        // try {
        //     if(ref.current){
        //         await ref.current.stopAsync()
        //     }
        // } catch (error) {
        //     console.log(error.message)
        // }
        // if(ref.current===null){
        //     return
        // }
        // const status = await ref.current.getStatusAsync();
        // if(!status?.isPlaying()){
        //     return
        // }
        // try {
        //     await ref.current.stopAsync()
        // } catch (error) {
        //     console.log(error.message)
        // }
    }**/
    
    const unload = async()=>{
        if(ref.current===null){
                return
            }
        try {
            await ref.current.unloadAsync()
        } catch (error) {
            console.error("Error in unload:", error);
        }
        // try {
        //     if(ref.current){
        //         await ref.current.unloadAsync()
        //     }
        // } catch (error) {
        //     console.log(error.message)
        // }
        // if(ref.current){
        
        // }
        // if(ref.current===null){
        //     return
        // }
        // try {
        //     await ref.current.unloadAsync()
        // } catch (error) {
        //     console.log(error.message)
        // }
    }
    
    useImperativeHandle(parentRef,()=>({play,unload,stop}))
    
    useEffect(()=>{
    
        getVideoLikes(buyerEmail,video._id)
    
        const {accountType,vendorId} = video
        // console.log(vendorId)
        setLoadingProfile(true)
        const getVendorInfo = async (accountType,vendorId)=>{
            try {
                const result = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-profile-for-video",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({accountType,vendorId})
                })
                const data = await result.json()
                // console.log("VENDOR PROFILE",data.msg)
                setVendorProfile(data.msg)
                setLoadingProfile(false)
                // console.log("PERSON",data.msg.accountType)
            } catch (error) {
                console.log(error.message)
                setLoadingProfile(false)
            }
        }
        getVendorInfo(accountType,vendorId)
        
        
        return()=>{
            unload()
        }
    },[])
    
    const getVideoLikes = async(buyerEmail,videoId)=>{
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/count-video-likes",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({buyerEmail,videoId})
            })
            const data = await response.json()
            setLikesInformation(data.msg)
            // console.log("LIKES",data)
        } catch (error) {
            console.log("ERR",error.message)
        }
    }
    
    const likeVideo = async(buyerEmail,videoId)=>{
        // console.log(buyerEmail,videoId)
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/post-video-likes",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({buyerEmail,videoId})
            })
            const data = await response.json()
            // console.log("LIKING",data)
        } catch (error) {
            console.log("ERR",error.message)
        }
    }
    const unlikeVideo = async(buyerEmail,videoId)=>{
        // console.log(buyerEmail,videoId)
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/unlike-video-route",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({buyerEmail,videoId})
            })
            const data = await response.json()
            // console.log("LIKING",data)
        } catch (error) {
            console.log("ERR",error.message)
        }
    }
    
    const getAccountObject = useCallback(()=>{
        AsyncStorage.getItem("userAccountObject").then(data=>{
            if(data===null){
                // navigation.navigate("HOME",{screen:"BasketMainScreen"})
                Alert.alert('', 'Login to', [
                    {text: 'Cancel', style:"destructive",onPress: () => {
                    }},
                    {text: 'Login', style:"cancel",onPress: () => {
                        
                    }},
                ]);
            }else{
                // navigation.navigate("HOME",{screen:"BasketMainScreen"})
            }
        })
      },[])
    
    // console.log("VIDEO URL",video?.videoObject.secure_url)
    return (
        <View style={{backgroundColor:"black",position:"relative",width:width,height:height,alignSelf:"center",justifyContent:"center",alignItems:"center"}}>
            {/* <Text>Hello</Text> */}
            <Video
                ref={ref}
                style={{height:height,width:width}}
                source={{
                    uri: transformVideo(video?.videoObject.secure_url),
                }}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping={true}
                shouldPlay={vidIndex===currentVideo?.index&&!pauseVideoMain}
                />
            {/* Icons */}
            
            <View style={{position:"absolute",bottom:250,right:20}}>
                <TouchableOpacity disabled={!likesInformation} onPress={()=>{
                    
                    AsyncStorage.getItem("userAccountObject").then(data=>{
                        if(data===null){
                            // navigation.navigate("HOME",{screen:"BasketMainScreen"})
                            Alert.alert('Login to continue', '', [
                                {text: 'Later', style:"destructive",onPress: () => {
                                }},
                                {text: 'Login', style:"cancel",onPress: () => {
                                    // setLoggedIn(false)
                                }},
                            ]);
                        }else{
                            if(!likesInformation?.liked){
                                likeVideo(buyerEmail,video._id)
                                setLikesInformation(prev=>{
                                    const old = prev
                                    const newOne = {count:old.count+1,liked:true}
                                    return newOne
                                })
                            }else{
                                unlikeVideo(buyerEmail,video._id)
                                setLikesInformation(prev=>{
                                    const old = prev
                                    const newOne = {count:old.count-1,liked:false}
                                    return newOne
                                })
                                // console.log("UNLIKE VIDEO")
                            }
                        }
                    })
                    
                    
                    
                }} style={{alignItems:"center"}}>
                {/* <AntDesign name="heart" size={24} color="black" /> */}
                    <AntDesign name="heart"size={30} color={likesInformation?.liked?"orangered":"white"} />
                    {/* <Octicons name="feed-heart" size={35} color="white" /> */}
                    <Text style={{color:"white",fontFamily:"Poppins",marginTop:0,fontFamily:"Mortend",fontWeight:"bold"}}>{likesInformation?formatNumber(Number(likesInformation?.count)):"..."}</Text>
                </TouchableOpacity>
                
                
            </View>
            {/* Report */}
            <TouchableOpacity onPress={()=>setShowReport(!showReport)} style={{position:"absolute",bottom:200,right:15,paddingHorizontal:10,borderRadius:50}}>
                <FontAwesome5 name="exclamation-circle" size={24} color={COLORS.secondary} />
            </TouchableOpacity>
            
            {showReport&&<View style={{position:"absolute",bottom:220,right:60,borderRadius:10,width:250,overflow:"hidden",minHeight:50,borderWidth:1,borderColor:"white",backgroundColor:"rgba(255,255,255,0.9)",}}>
                        <TouchableOpacity onPress={()=>{
                            Alert.alert('', 'You will not see this video', [
                                {text: 'Yes I don\'t want to see this video', style:"destructive",onPress: () => {
                                    // console.log("ID",productData._id)
                                    AsyncStorage.getItem("blockedVideos").then(data=>{
                                        const blockedVideos = JSON.parse(data)
                                        blockedVideos.push(video._id)
                                        AsyncStorage.setItem("blockedVideos",JSON.stringify(blockedVideos)).then(res=>{
                                        {
                                            dispatch(removeVideoAddedToBlockedVideos(video._id))
                                            setTimeout(()=>{
                                                setShowReport(false)
                                            },100)
                                        }})
                                    }).catch(err=>console.log(err))
                                }},
                                {text: 'Cancel', style:"cancel",onPress: () => {
                                    setShowReport(false)
                                }},
                            ]);
                        }} style={{width:"100%",paddingVertical:10,backgroundColor:COLORS.newBlue,borderBottomWidth:1,borderBottomColor:"white",paddingHorizontal:15}}>
                            <Text style={{textAlign:"left",color:"white",fontFamily:"Poppins",fontSize:17}}>Do not show again</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>setReportCollapsed(!reportCollapsed)} style={{width:"100%",paddingVertical:10,backgroundColor:COLORS.newBlue,paddingHorizontal:15,flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
                            <Text style={{textAlign:"left",color:"white",fontFamily:"Poppins",fontSize:17}}>Flag this video</Text>
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
            
            <View style={{position:"absolute",bottom:100,left:0,right:0,flexDirection:"row"}}>
                <View style={{flexDirection:"row",width:width,padding:10}}>
                    <View style={{flexDirection:"row",flex:1,marginRight:20}}>
                        <TouchableOpacity onPress={()=>{
                            // console.log("VV",vendorProfile)
                            let vendorEmail = vendorProfile.accountType==="individual"?vendorProfile.email:vendorProfile.businessEmail
                            router.push({
                                    pathname:"/vendorProfile",
                                    params:{vendorId:video.vendorId,accountType:video.accountType,vendorEmail:vendorEmail}
                                  })
                            // navigation.navigate("VendorProfileScreen",{vendorId:video.vendorId,accountType:video.accountType,vendorEmail:vendorEmail})
                        }}>
                            <DisplayVendorVideoImage profile={vendorProfile}/>
                        </TouchableOpacity>
                        <View style={{flex:1,marginHorizontal:5}}>
                            <Text style={{color:"white",fontFamily:"Poppins",fontSize:18}}>{vendorProfile&&<DisplayVendorNameOfVideo video={video} profile={vendorProfile}/>}</Text>
                        </View>
                    </View>
                <View>
                    <TouchableOpacity onPress={()=>{
                    router.push(`/shop/p/${video.productId}`)
                        // router.push({
                        //     pathname:"/productDetails",
                        //     params:{id:video.productId}
                        // })
                    }} style={{backgroundColor:COLORS.redOrange,padding:10,paddingHorizontal:40,borderRadius:50}}>
                        <Text style={{fontFamily:"Poppins",color:"white",fontSize:17}}>Buy</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
        </View>
    )
})

export default EachVideo