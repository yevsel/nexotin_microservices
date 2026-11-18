import { View, Text, StatusBar,TouchableHighlight,TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import styles from '../styles/SignUpScreenStyles'
import { COLORS } from '../constants/theme'
import * as Device from 'expo-device';
const SignUpScreen = () => {
    
    // const navigation = useNavigation()
    const [phoneNumber,setPhoneNumber] = useState()

    return (
        <View style={styles.container}>
                      <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <View style={{width:"90%"}}>
                <Text style={styles.screenTitle}>SIGN UP</Text>
                <View style={{flexDirection:"row",marginVertical:20}}>
                    <Text style={{fontFamily:"Poppins",fontSize:17}}>Already have an account? </Text>
                    <TouchableHighlight>
                        <Text style={{fontFamily:"Poppins",fontSize:17,textDecorationLine:"underline",fontWeight:"bold"}}>Login</Text>
                    </TouchableHighlight>
                </View>
                <View>
                    <Text style={{fontFamily:"Poppins",fontSize:17}}>Phone Number</Text>
                    <TextInput onChangeText={(e)=>{
                        setPhoneNumber(e)
                    }} inputMode='tel' cursorColor={COLORS.primary} multiline={false} style={{borderWidth:1,borderColor:COLORS.secondary,padding:15,borderRadius:50,marginTop:5,fontSize:16}} placeholder='eg. 024 952 3573'/>
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={()=>{
                    if(new String(phoneNumber).length>=10){
                        // navigation.navigate("OTPScreen")
                    }else{
                        console.log("Enter number")
                    }
                }}>
                    <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
                <View style={styles.orContainer}>
                    <View style={styles.leftLine}></View>
                    <Text style={{fontSize:17,fontFamily:"Poppins"}}>or</Text>
                    <View style={styles.rightLine}></View>
                </View>
                {/* <View>
                    <TouchableOpacity style={styles.googleButton}>
                        <AntDesign name="google" size={24} color="green" />
                        <Text style={styles.googleButtonText}>Sign up with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.appleButton}>
                        <AntDesign name="apple1" size={24} color="black" />
                        <Text style={styles.appleButtonText}>Sign up with Apple</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
            
        </View>
    )
}

export default SignUpScreen