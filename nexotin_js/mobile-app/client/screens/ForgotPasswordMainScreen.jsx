import { View, Text,TouchableHighlight,TouchableOpacity,TextInput,StatusBar, ScrollView,Alert } from 'react-native'
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
import * as Device from 'expo-device';
import { router } from 'expo-router';
// import { SvgUri } from 'react-native-svg';
// import GoogleIcon from "../assets/SVG/googlesvg.svg"

const ForgotPasswordMainScreen = ({setLoggedIn}) => {

    const dispatch = useDispatch()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false)
    const [responseFromDatabase,setResponseFromDatabase] = useState("")
    const [revealPassword,setRevealPassword] = useState(false)
    
    const [recoveryCode,SetRecoveryCode] = useState()
    
    const [newPassword,setNewPassword] = useState()
    
    const [state,setState] = useState(1)
    // const [loading]
    
    const enableButton = email&&password
    
    const sendRecoveryCode = async(userEmail)=>{
        const dataToSend={
            userEmail:userEmail.toLowerCase()
        }
        try {
            setLoading(true)
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/forgot-password-post",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(dataToSend)
            })
            const dataRes = await response.json()
            // console.log("RESPOSNE",dataRes)
            if(dataRes) setState(2)
            setLoading(false)
        } catch (error) {
            console.log("ERROR",error.message)
            setLoading(false)
        }
    }
     
    const sendResetPasswordRequest = async(userEmail,shortCode,newPassword)=>{
        // console.log(userEmail,shortCode,newPassword)
        const dataToSend = {
            userEmail:userEmail.toLowerCase(),
            shortCode,
            newPassword
        }
        // console.log("DATA",data)
        try {
            setLoading(true)
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/forgot-password-confirm-and-update",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(dataToSend)
            })
            const dataRes = await response.json()
            setLoading(false)
            if(dataRes.msg==="Wrong code. Try again"){
                Alert.alert('Password resetting', "Wrong code. Enter the right code and try again.", [
                    {text: 'Ok', onPress: () => {}},
                ]);
            }else if(dataRes.msg==="Done"){
                Alert.alert('Password resetting', "You have successfully reset your password", [
                    {text: 'Sign in', onPress: () => {
                        router.push("/(onboarding)")
                        // navigation.navigate("SignInScreen")
                    }},
                ]);
            }
        } catch (error) {
            console.log("ERROR",error.message)
            setLoading(false)
        }
    }
    
    return (
        
        <View style={{flex:1,backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={{alignItems:"center",backgroundColor:"white",justifyContent:"flex-start",paddingVertical:60,flex:1}}>
                <View style={{width:"90%",paddingTop:0}}>
                    <Text style={{fontFamily:"PoppinsBold",fontSize:25,color:COLORS.newBlack,textAlign:"center"}}>Forgot password</Text>
                    {/* <Text style={{fontFamily:"Poppins",fontSize:17}}>It takes less than a minute? </Text> */}
                    {state===1?<><View style={{marginTop:30}}>
                        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                            <Text style={{fontFamily:"Poppins",fontSize:17}}>Email</Text>
                            {/* <Text style={{color:"#D12E34",fontFamily:"PoppinsBold",fontSize:12}}>{responseFromDatabase==="Wrong email"?"Wrong email":responseFromDatabase==="This account has been deleted."?"This account has been deleted":null}</Text> */}
                        </View>
                        <TextInput onChangeText={(e)=>{
                            setEmail(e)
                        }} inputMode='email' value={email} cursorColor={COLORS.primary} multiline={false} style={{borderWidth:2,borderColor:responseFromDatabase==="Wrong email"?"#D12E34":COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholderTextColor={COLORS.placeholderTextColor} placeholder='Enter your email'/>
                    </View></>:
                    <>
                    <View style={{marginTop:30}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17}}>Please input the recovery code sent to your email.</Text>
                        <TextInput onChangeText={(e)=>{
                            SetRecoveryCode(e)
                        }} inputMode='decimal' value={recoveryCode} cursorColor={COLORS.primary} multiline={false} style={{borderWidth:2,borderColor:COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholderTextColor={COLORS.placeholderTextColor} placeholder='Enter your recovery code'/>
                    </View>
                    
                    <View style={{marginTop:30}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17}}>Enter your new password</Text>
                    </View>
                    <View style={{borderWidth:2,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderColor:COLORS.textInputBorder,borderRadius:10,marginTop:8,fontSize:16}}>
                            <TextInput onChangeText={(e)=>{
                                setNewPassword(e)
                            }}  secureTextEntry={revealPassword?false:true} value={newPassword} cursorColor={COLORS.primary} style={{fontSize:16,flex:1,padding:15}} placeholderTextColor={COLORS.placeholderTextColor} multiline={false}  placeholder='Enter your new password'/>
                            
                            <TouchableOpacity onPress={()=>setRevealPassword(!revealPassword)}>
                            {revealPassword===false?
                                <Text style={{fontFamily:"PoppinsBold",paddingHorizontal:15,fontSize:10,color:"gray"}}>SHOW</Text>:
                                <Text style={{fontFamily:"PoppinsBold",paddingHorizontal:15,fontSize:10,color:"gray"}}>HIDE</Text>
                            }
                            </TouchableOpacity>
                        </View>
                    </>
                    }
                </View>
                {state===1?<>
                <TouchableOpacity disabled={loading||email?.length<5}  onPress={()=>sendRecoveryCode(email)} style={{padding:17,borderRadius:50,width:"90%",backgroundColor:COLORS.redOrange,marginTop:40,alignItems:"center"}}>
                    <Text style={{textAlign:"center",color:"white",fontFamily:"Poppins",fontSize:18}}>{loading?<ActivityIndicator style={{}} color={"white"}/>:"Get recovery code"}</Text>
                </TouchableOpacity></>:
                <TouchableOpacity disabled={loading||newPassword?.length<7}  onPress={()=>{
                    if(newPassword?.length<7){
                        Alert.alert('Password resetting', 'Password is too short', [
                            {text: 'OK', onPress: () => {}},
                        ]);
                    }
                    sendResetPasswordRequest(email,recoveryCode,newPassword)
                }} style={{padding:17,borderRadius:50,width:"90%",backgroundColor:COLORS.redOrange,marginTop:40,alignItems:"center"}}>
                <Text style={{textAlign:"center",color:"white",fontFamily:"Poppins",fontSize:18}}>{loading?<ActivityIndicator color={"white"}/>:"Reset password"}</Text>
            </TouchableOpacity>
                }
                
                {/* <TouchableOpacity disabled={!enableButton} style={styles.nextButton} onPress={()=>{
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
                                    setLoggedIn(true)
                                    dispatch(storeUserObject(JSON.parse(data)))
                                }).catch(err=>console.log(err.message))
                            }).catch(err=>console.log(err.message))
                            setLoading(false)
                        } catch (error) {
                            setLoading(false)
                        }
                    }
                    sendToDatabase(data)
                }}>
                    {loading&&<ActivityIndicator animating={true} color={COLORS.white} style={{marginHorizontal:10}}/>}
                    <Text style={styles.nextButtonText}>{loading===true?"Authenticating..":"Login"}</Text>
                </TouchableOpacity> */}
            </ScrollView>
        
        </View>
    )
}

export default ForgotPasswordMainScreen