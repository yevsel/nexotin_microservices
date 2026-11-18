import { View, Text,TouchableOpacity,ScrollView,Alert,StatusBar, TouchableWithoutFeedback,Dimensions} from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from '../constants/theme';
import { Entypo } from '@expo/vector-icons';

import { AntDesign } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { FontAwesome } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking'
import { MaterialIcons } from '@expo/vector-icons';
import {useDispatch} from "react-redux"
import { acceptTermsAndConditions } from '../Actions';
import { router } from 'expo-router';

const TermsAndConditionsMainScreen = () => {


    const dispatch = useDispatch()
    
    // const [acceptTermsAndConditions,setAcceptTermsAndConditions] = useState(false)
    
    const {height} = Dimensions.get("screen")
    
    return (
        <SafeAreaView style={{height,alignItems:"center",backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="Apple"?"dark-content":"light-content"} backgroundColor={COLORS.secondary}></StatusBar>
            <View style={{marginVertical:15,flexDirection:"row",width:"90%",justifyContent:"center",position:"relative"}}>
                    <TouchableOpacity onPress={()=>{
                        // navigation.goBack()
                        router.back()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Terms & Conditions</Text>
                </View>
                <ScrollView style={{width:"90%"}} contentContainerStyle={{ paddingBottom: 100}} showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={{fontFamily:"Poppins",}}>Last Updated: 15th January, 2024</Text>
                        <Text style={{fontFamily:"Poppins",}}>By opening an account you confirm your agreement with the terms & comditions & are bound by the terms below; 
This document ("Terms and Conditions") is a legal agreement between you ("User" or "you") and Nexotin Company Ltd, a registered company in Ghana] ("Company" or "we"). These Terms and Conditions govern your use of Nexotin Mobile App ("Service").
</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>1. Acceptance of Terms
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>By accessing or using the Service, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>2. Use of the Service
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>a. Eligibility: You must be of legal years or older and have the legal capacity to enter into these Terms and Conditions.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>b. Registration: To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>c. Account Security: You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>3. User Content
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>a. Ownership: You retain ownership of any content you submit or upload ("User Content"). By providing User Content, you grant Nexotin Company Ltd a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute the User Content.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>b. Prohibited Content: You agree not to submit any User Content that is unlawful, offensive, or violates any third-party rights.
</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>4. Payment and Fees
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>a. Payment: Certain features of the Service may require payment. You agree to pay all fees and charges associated with your use of the Service.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>b. Return & Refund: Nexotin Company Ltd may have a refund policy, which will be clearly below.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>{`Return 
Eligible Time Period Most products on Nexotin company ltd can be returned within 48 hours after delivery. ie: If an item is delivered on the 01st, It can returned not later than 03rd provided that item is not from these restricted categories ( Health, Beauty, Underwears). Take Note After 48 hours of delivery, items cannot be returned. However, items that expired or damaged would be replaced by the seller.`}
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>Prerequisites For an Eligible Return Request:
The product shall not be from Health, Beauty & Underwears 
The product and its package are in good state (not broken or spotted) 
The product state should match your return reason
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>{`Refunds;
We have 3 stages you can request a refund or replacement
1. After an order is placed & payment is done but product is yet to be delivered to your delivery address (Full amount refund or you can change to a different product of the same price)
2. Product is delivered to your address (product cost only be refunded - Delivery fee not refundable. Replacement can be done at additional delivery cost)
3. If the wrong product is delivered (Replacement at no extra cost or full refund)
`}
</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>5. Termination

</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>We reserve the right to terminate or suspend your access to the Service at our sole discretion, without notice, for any reason, including without limitation, breach of these Terms and Conditions.</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>6. Disclaimer of Warranties
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>The Service is provided "as is" without warranty of any kind, either expressed or implied. We do not warrant that the Service will be error-free or uninterrupted.
</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>7. Limitation of Liability
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>To the fullest extent permitted by applicable law, Nexotin Company Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>8. Governing Law
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>These Terms and Conditions are governed by and construed in accordance with the laws of Ghana.
</Text>
                    </View>
                    <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>9. Contact Information
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>If you have any questions about these Terms and Conditions, please contact Nexotin Company Ltd.
</Text>
                    </View>
                    
                    <TouchableOpacity onPress={()=>{
                        // navigation.navigate("TermsAndConditionsMainScreen")
                        dispatch(acceptTermsAndConditions(true))
                        // navigation.navigate("CreateAccountScreen")
                        router.push("/(onboarding)/signUpScreen")
                    }} style={{height:60,backgroundColor:COLORS.redOrange,marginTop:50,alignItems:"center",justifyContent:"center",borderRadius:50}}>
                        <Text style={{color:"white",fontFamily:"Poppins",fontSize:17}}>Accept</Text>
                    </TouchableOpacity>
                    
                </ScrollView>
        </SafeAreaView>
    )
}

export default TermsAndConditionsMainScreen