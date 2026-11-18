import { View, Text,TouchableHighlight,TouchableOpacity,TextInput,StatusBar, ScrollView } from 'react-native'
import React, { useState } from 'react'
import styles from '../styles/SignInScreenStyle'
import { COLORS } from '../constants/theme'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome,Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { storeUserObject } from '../Actions';
import * as Device from 'expo-device';
import { router } from 'expo-router';

const SignInScreen = ({setLoggedIn}) => {


    // const [request,response,promptAsync] = Google.useAuthRequest({
    //     webClientId:"720301084900-af1vqpdq77c5tqj8trdi09la2nbue7ib.apps.googleusercontent.com",
    //     androidClientId:"720301084900-hug6cauuam1kdfs75d86rbrc56ov69tg.apps.googleusercontent.com",
    //     iosClientId:"720301084900-qckddicfk7l2ojhspnudhmp21qs7pdsl.apps.googleusercontent.com"
    // })
    
    // const handleSingInWithGoogle = async()=>{
    //     if(response?.type==="success"){
    //         console.log("SUCESS")
    //     }
    // }

    const dispatch = useDispatch()
    // const navigation = useNavigation()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const [responseFromDatabase,setResponseFromDatabase] = useState("")
    const [revealPassword,setRevealPassword] = useState(false)
    
    const enableButton = email&&password
    
    // const getUserInfo = async(token)=>{
    //     if(!token) return;
    //     try {
    //         const response = await fetch(
    //             "https://www.googleapis.com/userinfo/v2/me",
    //             {
    //                 headers:{Authorization:`Bearer ${token}`}
    //             }
    //         )
    //         console.log("GOOGLE RESPONSE",response)
    //     } catch (error) {
    //         console.log("ERROR",error.message)
    //     }
    // }
    
    // return (
    //     <View>
    //         <Text>HELLO</Text>
    //     </View>
    // )
    
    return (
        
        <View style={{flex:1,backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={{alignItems:"center",backgroundColor:"white",justifyContent:"flex-start",paddingVertical:60,flex:1}}>
                {/* <TouchableOpacity onPress={()=>navigation.goBack()} style={{position:"absolute",top:10,left:0,backgroundColor:"white",padding:10,borderRadius:50}}>
                    <Entypo name="chevron-left" size={30} color="#333" />
                </TouchableOpacity> */}
                <View style={{width:"90%",paddingTop:0}}>
                    <Text style={{fontFamily:"PoppinsBold",fontSize:25,color:COLORS.newBlack,textAlign:"center"}}>Login</Text>
                    <View style={{flexDirection:"row",marginTop:40}}>
                        <Text style={{fontFamily:"Poppins",color:"#64748B",fontSize:17}}>Don't have an account? </Text>
                        <TouchableOpacity onPress={()=>{
                            // navigation.navigate("CreateAccountScreen")
                            router.push("/(onboarding)/signUpScreen")
                        }}>
                            <Text style={{fontFamily:"Poppins",fontSize:17,textDecorationLine:"underline",fontWeight:"bold",color:"#2E80E8"}}>Create one</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Text style={{fontFamily:"Poppins",fontSize:17}}>It takes less than a minute? </Text> */}
                    <View style={{marginTop:30}}>
                        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                            <Text style={{fontFamily:"Poppins",fontSize:17}}>Email</Text>
                            <Text style={{color:"#D12E34",fontFamily:"PoppinsBold",fontSize:12}}>{responseFromDatabase==="Wrong email"?"Wrong email":responseFromDatabase==="This account has been deleted."?"This account has been deleted":null}</Text>
                        </View>
                        <TextInput onChangeText={(e)=>{
                            setEmail(e)
                        }} inputMode='email' cursorColor={COLORS.primary} multiline={false} style={{borderWidth:2,borderColor:responseFromDatabase==="Wrong email"?"#D12E34":COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholderTextColor={COLORS.placeholderTextColor} placeholder='Enter your email'/>
                    </View>
                    <View style={{marginTop:30}}>
                        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                            <Text style={{fontFamily:"Poppins",fontSize:17}}>Password</Text>
                            <Text style={{color:"#D12E34",fontFamily:"PoppinsBold",fontSize:12}}>{responseFromDatabase==="Wrong password"?"Incorrect password":responseFromDatabase==="This account has been deleted."?"This account has been deleted":null}</Text>
                        </View>
                        <View style={{borderWidth:2,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderColor:responseFromDatabase==="Wrong password"?"#D12E34":COLORS.textInputBorder,borderRadius:10,marginTop:5,fontSize:16}}>
                            <TextInput onChangeText={(e)=>{
                                setPassword(e)
                            }}  secureTextEntry={revealPassword?false:true} cursorColor={COLORS.primary} style={{fontSize:16,flex:1,padding:15}} placeholderTextColor={COLORS.placeholderTextColor} multiline={false}  placeholder='Enter your password'/>
                            
                            <TouchableOpacity onPress={()=>setRevealPassword(!revealPassword)}>
                            {revealPassword===false?
                                <Text style={{fontFamily:"PoppinsBold",paddingHorizontal:15,fontSize:10,color:"gray"}}>SHOW</Text>:
                                <Text style={{fontFamily:"PoppinsBold",paddingHorizontal:15,fontSize:10,color:"gray"}}>HIDE</Text>
                            }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>{
                    router.push("/(onboarding)/forgotPasswordScreen")
                    // navigation.navigate("ForgotPasswordMainScreen")
                }} style={{alignSelf:"flex-end",margin:20}}>
                    <Text style={{fontFamily:"Poppins",fontSize:17,textDecorationLine:"underline",fontWeight:"bold",color:"#2E80E8"}}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity disabled={!enableButton} style={styles.nextButton} onPress={()=>{
                    const data = {email:email.toLowerCase(),password}
                    const sendToDatabase = async(data)=>{
                        try {
                            setLoading(true)
                            setResponseFromDatabase("")
                            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/login-user",{
                                method:"POST",
                                headers:{"content-type":"application/json"},
                                body:JSON.stringify(data)
                            })
                            const result = await response.json()
                            // console.log("REES",result.msg)
                            // return
                            setResponseFromDatabase(result.msg)
                            if(result.msg==="Wrong email" || result.msg==="Wrong password"){
                                setLoading(false)
                                return
                            }else if(result.msg==="This account has been deleted."){
                                setLoading(false)
                                return
                            }
                            AsyncStorage.setItem("userToken",JSON.stringify(result.msg.token)).then(data=>{
                                const {firstName,lastName,email,gender,phoneNumber,createdAt,location,username,profileImage} = result.msg.data
                                let loginData={}
                                if(profileImage){
                                    loginData={firstName,lastName,email,gender,phoneNumber,location,createdAt,username,profileImage:profileImage.secure_url}
                                }else{
                                    loginData={firstName,lastName,email,gender,phoneNumber,username,location,createdAt}
                                }

                                AsyncStorage.setItem("userAccountObject",JSON.stringify(loginData)).then(data=>{
                                    router.push("/(tabs)/Home")
                                    dispatch(storeUserObject(loginData))
                                }).catch(err=>console.log(err.message))
                            }).catch(err=>console.log("SIGN IN PAGE STORING USER INFO ERROR",err.message))
                            setLoading(false)
                        } catch (error) {
                            setLoading(false)
                        }
                    }
                    sendToDatabase(data)
                }}>
                    {loading&&<ActivityIndicator animating={true} color={COLORS.white} style={{marginHorizontal:10}}/>}
                    <Text style={styles.nextButtonText}>{loading===true?"Authenticating..":"Login"}</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity>
                    <Image />
                </TouchableOpacity> */}
                {/* <TouchableOpacity 
                    onPress={()=>{
                        promptAsync()
                    }}
                style={styles.googleButton}>
                    <AntDesign name="google" size={24} color="green" />
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.appleButton}>
                    {/* <AntDesign name="apple1" size={24} color="black" />
                    <Text style={styles.appleButtonText}>Sign up with Apple</Text> */}
                </TouchableOpacity>
                
                {/* <View style={{marginTop:-40}}>
                    <Text style={{fontFamily:"Poppins",color:"#64748B",textAlign:"center"}}>or login with</Text>
                    <TouchableOpacity style={{marginTop:10}}>
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",width:"100%",paddingVertical:15}}>

                            <Text style={styles.googleButtonText}>Sign up with Google</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}
            </ScrollView>
        
        </View>
    )
}

export default SignInScreen