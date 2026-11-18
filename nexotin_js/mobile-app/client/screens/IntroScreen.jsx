import { View, Text,Image, StatusBar,Dimensions,TouchableOpacity } from 'react-native'
import React,{useState,useCallback, useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import intro1 from "../assets/Intro1.png"
import intro2 from "../assets/Intro2.png"
import intro3 from "../assets/Intro3.png"
import intro4 from "../assets/Intro4.png"
import intro5 from "../assets/Intro5.png"
import nexotinLogo from "../assets/nexotinLogo.png"
import { COLORS } from '../constants/theme';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import { useNavigation } from '@react-navigation/native';
import * as Device from 'expo-device';
import GoogleLogo from "../assets/google-logo.png"
// import * as Google from "expo-auth-session/providers/google"

import * as WebBrowser from "expo-web-browser"

// {
//     "id": "<user_id>",
//     "email": "<user_email>",
//     "verified_email": <boolean>,
//     "name": "<user_name>",
//     "given_name": "<user_given_name>",
//     "family_name": "<user_family_name>",
//     "link": "<user_profile_link>",
//     "picture": "<user_picture_url>",
//     "locale": "<user_locale>"
//   }

WebBrowser.maybeCompleteAuthSession()
const IntroScreen = () => {

    const {width,height} = Dimensions.get("screen")
    const navigation = useNavigation()
    
    const [user,setUser] = useState()
    const [accessToken,setAccessToken] = useState()
    
    // const [loadingGoogleAuth,setLoadingGoogleAuth] = useState(false)
    
    // const [request,response,promptAsync] = Google.useAuthRequest({
    //     webClientId:"720301084900-af1vqpdq77c5tqj8trdi09la2nbue7ib.apps.googleusercontent.com",
    //     androidClientId:"720301084900-hug6cauuam1kdfs75d86rbrc56ov69tg.apps.googleusercontent.com",
    //     iosClientId:"720301084900-qckddicfk7l2ojhspnudhmp21qs7pdsl.apps.googleusercontent.com"
    // })
    
    // useEffect(()=>{
    //     if(response?.type==="success"){
    //         setAccessToken(response.authentication.accessToken);
    //         accessToken&&fetchUser()
    //     }
    // },[response,accessToken])
    
    // const fetchUser = async()=>{
    //     let response = await fetch("https://www.googleapis.com/userinfo/v2/me",{
    //         headers:{
    //             Authorization:`Bearer ${accessToken}`
    //         }
    //     })
    //     const useInfo = await response.json();
    //     sendToServer(useInfo.email,useInfo.given_name,useInfo.family_name,useInfo.picture)
    //     // return useInfo
    //     // setUser(useInfo)
    // }
    
    // const sendToServer = async(email,given_name,family_name,picture)=>{
    //     try {
            
    //         const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/google-sign-up-sign-in-route",{
    //             method:"POST",
    //             headers:{"content-type":"application/json"},
    //             body:JSON.stringify({email,given_name,family_name,picture})
    //         })
    //         const data = response.json()
    //         console.log("SEND TO SERVER RESPONSE")
    //     } catch (error) {
    //         console.log("ERROR",error)
    //     }
    // }

    // const handleSingInWithGoogle = async()=>{
    //     if(response?.type==="success"){
    //         console.log("SUCESS")
    //     }
    // }
    
    // const handlerClickAuth = useCallback(() => {
    //     promptAsync({useProxy:false,showInRecents: true})
    // }, [promptAsync])// IT WORKS

    return (
        <SafeAreaView style={{flex:1,alignItems:"center",justifyContent:"center"}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <View style={{width:"80%",minHeight:400}}>
                <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                    <Image source={intro1} style={{width:width/3,height:150}} resizeMode='contain'/>
                    <Image source={intro2} style={{width:180,height:90,}} resizeMode='contain'/>
                </View>
                <View style={{width:"100%",flexDirection:"row",alignItems:"center",marginTop:20,justifyContent:"space-between"}}>
                    <Image source={intro3} style={{width:50,height:50,alignSelf:'flex-start',marginTop:50}} resizeMode='contain'/>
                    <Image source={intro4} style={{width:width/3,height:200,}} resizeMode='contain'/>
                    <Image source={intro5} style={{width:70,height:90,alignSelf:'flex-start'}} resizeMode='contain'/>
                </View>
                <View style={{height:100,width:"100%",flexDirection:'row',alignItems:"center",justifyContent:"center"}}>
                    <Image source={nexotinLogo} style={{width:100}} resizeMode='contain'/>
                    {/* <Text style={{fontFamily:"Mortend",marginBottom:10,fontSize:30,color:COLORS.secondary,textAlign:"center"}}>NEXOTIN</Text> */}
                    {/* <Text style={{fontFamily:"Poppins",color:COLORS.secondary}}>Lorem ipsum dolor sit amet, consectetur adipi scing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text> */}
                </View>
                <View style={{marginTop:10,flexDirection:"row",width:"100%",justifyContent:"space-between"}}>
                    {/* <TouchableOpacity onPress={()=>{

                        navigation.navigate("SignInScreen")
                    }} style={{width:"47%",alignItems:"center",justifyContent:"center",borderRadius:50,height:55,backgroundColor:COLORS.redOrange}}>
                        <Text style={{fontFamily:"Poppins",color:"white"}}>Log in</Text>
                    </TouchableOpacity> */}
                    {/* <TouchableOpacity onPress={()=>{
                        navigation.navigate("CreateAccountScreen")
                    }} style={{width:"47%",borderRadius:50,borderWidth:2,borderColor:"#1E293B",alignItems:"center",justifyContent:"center",height:55}}>
                        <Text style={{fontFamily:"Poppins"}}>Register</Text>
                    </TouchableOpacity> */}
                </View>
                {/* {ity>}Device.brand==="google"?null:
                <TouchableOpac onPress={handlerClickAuth} style={{borderWidth:2,borderColor:"#1E293B",paddingVertical:15,borderRadius:30,marginTop:20,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:10}}>
                    <Image source={GoogleLogo}/>
                    <Text style={{fontFamily:"Poppins"}}>Sign-up with Google</Text>
                </TouchableOpac
                <Image source={}/> */}
            </View>
        </SafeAreaView>
    )
}

export default IntroScreen