import { View, Text, TouchableHighlight,TextInput,StatusBar,Alert,TouchableOpacity,ScrollView } from 'react-native'
import React, { useState,useEffect,useRef } from 'react'
// import styles from '../styles/SignUpScreenStyles'
import { COLORS } from '../constants/theme'

import { ActivityIndicator } from 'react-native-paper';
import * as Device from 'expo-device';
import {useSelector} from "react-redux"
import { router } from 'expo-router';
const CreateAccountScreen = () => {
    
    // const navigation = useNavigation()
    const [firstName,setFirstName] = useState()
    const [lastName,setLastName] = useState()
    const [phoneNumber,setPhoneNumber] = useState()
    const [username,setUsername] = useState()
    const [password,setPassword] = useState()
    const [confirmPassword,setConfirmPassword] = useState()
    const [passwordValidator,setPasswordValidator] = useState(null)
    const [email,setEmail] = useState()
    const [addressText,setAddressText] = useState()
    const [location,setLocation] = useState({data:null,latitude:null,longitude:null})
    const [loading,setLoading] = useState(false)
    const [usernameValidator,setUsernameValidator] = useState(false)
    const [gender,setGender] = useState("male")
    
    const [lowerCaseValid,setLowerCaseValid] = useState(false)
    const [upperCaseValid,setUpperCaseValid] = useState(false)
    const [digitsValid,setDigitsValid] = useState(false)
    
    const acceptTermsAndConditionsReducer = useSelector(state=>state.acceptTermsAndConditionsReducer)
    
    const enableButton = firstName&&lastName&&password&&confirmPassword&&email&&acceptTermsAndConditionsReducer
    
    const ref = useRef()

    return (
        <View style={{flex:1,backgroundColor:"white",alignItems:"center"}}>
        <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <ScrollView keyboardShouldPersistTaps='always' style={{width:"90%"}} contentContainerStyle={{paddingVertical:50,paddingBottom:200}} showsVerticalScrollIndicator={false}>
                <Text style={{fontFamily:"PoppinsBold",fontSize:25,color:COLORS.newBlack,textAlign:"center"}}>Sign Up</Text>
                <View style={{paddingTop:50}}>
                    {/* First Name */}
                    <View>
                        <Text style={{fontFamily:"Poppins",fontSize:17,color:COLORS.newBlack}}>First name <Text style={{color:"red",fontSize:10}}> </Text></Text>
                        <TextInput onChangeText={(e)=>{
                            setFirstName(e)
                        }} inputMode='text' value={firstName} cursorColor={COLORS.primary} multiline={false} placeholderTextColor={COLORS.placeholderTextColor} style={{borderWidth:2,borderColor:COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholder='Enter your first Name'/>
                    </View>
                    {/* Last Name */}
                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17,color:COLORS.newBlack}}>Last name <Text style={{color:"red",fontSize:10}}> </Text></Text>
                        <TextInput onChangeText={(e)=>{
                            setLastName(e)
                        }} inputMode='text' value={lastName} cursorColor={COLORS.primary} multiline={false} style={{borderWidth:2,borderColor:COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholderTextColor={COLORS.placeholderTextColor} placeholder='Enter your last Name'/>
                    </View>
                    {/* Phone number */}
                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17,color:COLORS.newBlack}}>Phone number <Text style={{color:"red",fontSize:10}}> </Text></Text>
                        <TextInput onChangeText={(e)=>{
                            // console.log("NUMBER",e)
                            setPhoneNumber(e)
                        }} inputMode='tel' value={phoneNumber} cursorColor={COLORS.primary} multiline={false} style={{borderWidth:2,borderColor:COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholderTextColor={COLORS.placeholderTextColor} placeholder='Enter your phone number'/>
                    </View>
                    {/* Gender */}
                    {/* <View style={{width:"90%",marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:16}}>Gender</Text>
                        <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:10}}>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <RadioButton.Item position='leading' label='Male' color={COLORS.primary} value="male" onPress={()=>setGender("male")} status={gender==="male"?"checked":"unchecked"}/>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <RadioButton.Item position='leading' label='Female' color={COLORS.primary} value="female" onPress={()=>setGender("female")} status={gender==="female"?"checked":"unchecked"}/>
                            </View>
                    </View>
                </View> */}
                    {/* User Name */}
                    {/* <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17}}>Username <Text style={{color:"red",fontSize:10}}> </Text></Text>
                        <TextInput onChangeText={(e)=>{
                            const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
                            setUsernameValidator(usernameRegex.test(e))
                            if(usernameValidator){
                                setUsername(e)
                            }
                        }} inputMode='text'  cursorColor={COLORS.primary} multiline={false} style={{borderWidth:1,borderColor:usernameValidator===true?"green":"red",padding:15,borderRadius:50,marginTop:5,fontSize:16}} placeholder='Username'/>
                    </View> */}
                    {/* <View style={{margin:4}}>
                        <Text style={{fontFamily:"Poppins",fontSize:12,color:"gray"}}>Please this should be one word, no spaces</Text>
                    </View> */}
                    {/* Location */}
                    {/* <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17,marginBottom:10}}>Location <Text style={{color:"red",fontSize:10}}> </Text></Text>
                        <GooglePlacesAutocomplete
                            styles={{
                                textInputContainer:{alignItems:"center",padding:3,paddingRight:20,borderWidth:1,borderColor:COLORS.secondary,borderRadius:50},
                                textInput:{fontSize:17}
                            }}
                            ref={ref}
                            listViewDisplayed={false}
                            cursorColor={COLORS.primary}
                            disableScroll={true}
                            fetchDetails={true}
                            renderRightButton={()=><Ionicons name="location-sharp" size={20} color="gray" />}
                            placeholder='Search location'
                            query={{
                                key: 'AIzaSyBkdpeOr-6ISnArg1FGnd5IfW-jGOf7t-w',
                                language: 'en',
                                components:'country:GH'
                            }}
                            onPress={(data, details) => {
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
                    </View> */}
                    {/* <View style={{margin:4}}>
                        <Text style={{fontFamily:"Poppins",fontSize:12,color:"gray"}}>
                        This is your default delivery address, you can change this when placing an order.</Text>
                    </View> */}
                    {/* Email */}
                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17,color:COLORS.newBlack}}>Email <Text style={{color:"red",fontSize:10}}> </Text></Text>
                        <TextInput onChangeText={(e)=>{
                            setEmail(e)
                        }} inputMode='email' value={email} cursorColor={COLORS.primary} multiline={false} style={{borderWidth:2,borderColor:COLORS.textInputBorder,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholderTextColor={COLORS.placeholderTextColor} placeholder='Enter your email'/>
                    </View>
                    {/* <View style={{margin:4}}>
                        <Text style={{fontFamily:"Poppins",fontSize:12,color:"gray"}}>Please enter a working email address.</Text>
                    </View> */}
                    {/* Password */}
                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17}}>Password <Text style={{color:"red",fontSize:10}}> </Text></Text>
                        <TextInput onChangeText={(e)=>{
                            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
                            const lower = /[a-z]/
                            const upper = /[A-Z]/
                            const digits = /\d/
                            // console.log(lower.test(e))
                            setDigitsValid(digits.test(e))
                            setUpperCaseValid(upper.test(e))
                            setLowerCaseValid(lower.test(e))
                            setPasswordValidator(passwordRegex.test(e))
                            setPassword(e)
                        }} secureTextEntry={true} value={password} cursorColor={COLORS.primary} multiline={false} style={{borderWidth:2,borderColor:COLORS.textInputBorder
                        ,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholderTextColor={COLORS.placeholderTextColor}  placeholder='Enter a password'/>
                    </View>
                    <View style={{margin:4}}>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <View style={{width:7,height:7,marginHorizontal:10,borderRadius:10,backgroundColor:lowerCaseValid?"green":"red"}}></View>
                            <Text style={{fontFamily:"Poppins",fontSize:12,color:"gray"}}>At least one lowercase letter.</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <View style={{width:7,height:7,marginHorizontal:10,borderRadius:10,backgroundColor:upperCaseValid?"green":"red"}}></View>
                            <Text style={{fontFamily:"Poppins",fontSize:12,color:"gray"}}>At least one uppercase letter.</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <View style={{width:7,height:7,marginHorizontal:10,borderRadius:10,backgroundColor:digitsValid?"green":"red"}}></View>
                            <Text style={{fontFamily:"Poppins",fontSize:12,color:"gray"}}>At least one digit.</Text>
                        </View>
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <View style={{width:7,height:7,marginHorizontal:10,borderRadius:10,backgroundColor:password?.length>=6?"green":"red"}}></View>
                            <Text style={{fontFamily:"Poppins",fontSize:12,color:"gray"}}>A minimum length of 6 characters.</Text>
                        </View>
                    </View>
                    {/* Confirm Password */}
                    <View style={{paddingTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17}}>Confirm password <Text style={{color:"red",fontSize:10}}> </Text></Text>
                        <TextInput onChangeText={(e)=>{
                            setConfirmPassword(e)
                        }}secureTextEntry={true} value={confirmPassword} cursorColor={COLORS.primary} multiline={false} style={{borderWidth:2,borderColor: (password?.length > 6 && password === confirmPassword) ? "green" : COLORS.textInputBorder
                        ,padding:15,borderRadius:10,marginTop:5,fontSize:16}} placeholderTextColor={COLORS.placeholderTextColor}  placeholder='Enter a password'/>
                    </View>
                    {/* Terms And Conditions */}
                    {!acceptTermsAndConditionsReducer&&<TouchableOpacity onPress={()=>{
                        // navigation.navigate("TermsAndConditionsMainScreen")
                            router.push("/(onboarding)/termsAndConditionMainScreen")
                    }} style={{height:60,backgroundColor:"lightgreen",marginTop:50,alignItems:"center",justifyContent:"center",borderRadius:50}}>
                        <Text style={{color:"gray",fontFamily:"Poppins",fontSize:17}}>Read terms and conditions</Text>
                    </TouchableOpacity>}
                    
                    {/* Done */}
                    {<TouchableOpacity disabled={!enableButton} style={{height:60,backgroundColor:acceptTermsAndConditionsReducer===true?COLORS.redOrange:"gray",marginTop:50,alignItems:"center",justifyContent:"center",borderRadius:50}} onPress={()=>{
                        
                        const sendToDatabase = async(firstName,lastName,phoneNumber,gender,username,password,email,location)=>{
                            setLoading(true)
                            try {
                                const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/register-user",{
                                    method:"POST",
                                    headers:{"Content-Type":"application/json"},
                                    body:JSON.stringify({firstName,lastName,phoneNumber,gender,username,password,email,location})
                                })
                                const result = await response.json()
                                // console.log(result)
                                if(result.msg===true){
                                    Alert.alert('Registration', 'Your registration was successful, welcome to Nexotin.', [
                                        {
                                            text: 'Sign in',
                                            onPress: () => router.push("/(onboarding)"),
                                        },
                                    ]);
                                }else if(result.msg==="Username already exist"){
                                    Alert.alert('Registration', 'Username already exist', [
                                        {
                                            text: 'Try again',
                                            onPress: ()=>{}
                                        },
                                    ]);
                                }else if(result.msg==="Email already exist"){
                                    Alert.alert('Registration', 'Email already exist', [
                                        {
                                            text: 'Try again',
                                            onPress: ()=>{}
                                        },
                                    ]);
                                }
                                setLoading(false)
                            } catch (error) {
                                console.log(error.message)
                                setLoading(false)
                            }
                        }
                        sendToDatabase(firstName,lastName,phoneNumber,gender,username,password,email,location)
                    }}>
                        <Text style={{color:"white",fontFamily:"Poppins",fontSize:17}}>{loading?<ActivityIndicator color="white"/>:"Create Account"}</Text>
                    </TouchableOpacity>}
                    
                </View>
            </ScrollView>
        </View>
    )
}

export default CreateAccountScreen