import { View, Text, TouchableOpacity,StatusBar } from 'react-native'
import React from 'react'
import styles from '../styles/OTPScreenStyle'
import { COLORS } from '../constants/theme'
// import { useNavigation } from '@react-navigation/native'
import * as Device from 'expo-device';
const OTPScreen = () => {

    const navigation = useNavigation()

    return (
    
        <View style={styles.container}>
                      <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <View style={{width:"90%"}}>
                <Text style={styles.screenTitle}>OTP</Text>
                <Text style={{fontFamily:"Poppins",fontSize:17}}>We just sent you a 5 digit code</Text>
                {/* <Text style={{fontFamily:"Poppins",fontSize:17}}>Please check your phone and enter your OTP</Text> */}
                {/* Circles */}
                <View style={styles.circleContainer}>
                    <View style={styles.eachCircle}>
                        <Text style={styles.eachCircleText}>2</Text>
                    </View>
                    <View style={styles.eachCircle}>
                        <Text style={styles.eachCircleText}>4</Text>
                    </View>
                    <View style={styles.eachCircle}>
                        <Text style={styles.eachCircleText}>6</Text>
                    </View>
                    <View style={styles.eachCircle}>
                        <Text style={styles.eachCircleText}>9</Text>
                    </View>
                    <View style={styles.eachCircle}>
                        <Text style={styles.eachCircleText}>3</Text>
                    </View>
                </View>
                
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={()=>{
                // navigation.navigate("CreateAccountScreen")
                }}>
                    <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    )
}

export default OTPScreen