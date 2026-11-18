import { View, Text,TouchableOpacity,ScrollView,Alert,StatusBar, TouchableWithoutFeedback} from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from '../constants/theme';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
// import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking'
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const TermsAndPolicies = () => {

    // const navigation = useNavigation()
    const [isCollapsed7,setIsCollapsed7] = useState(true)
    const [isCollapsed1,setIsCollapsed1] = useState(true)
    const [isCollapsed2,setIsCollapsed2] = useState(true)

    // const {height} = Dimension.

    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="Apple"?"dark-content":"light-content"} backgroundColor={COLORS.secondary}></StatusBar>
            <View style={{marginVertical:15,flexDirection:"row",width:"90%",justifyContent:"center",position:"relative"}}>
                    <TouchableOpacity onPress={()=>{
                        // navigation.goBack()
                        router.back()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Terms & Policies</Text>
                </View>
                <ScrollView style={{width:"90%"}} contentContainerStyle={{ paddingBottom: 100}} showsVerticalScrollIndicator={false}>
                
                
                {/* <TouchableOpacity  style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.redOrange,padding:20,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <AntDesign name="warning" size={24} color="white" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"white"}}>Report an issue</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color="white" />
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={()=>{
                setIsCollapsed7(!isCollapsed7)
                    }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed7?30:0,borderBottomRightRadius:isCollapsed7?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:0}}>
                            <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                                {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                                <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Privacy Policy</Text>
                            </View>
                            <View>
                                {isCollapsed7===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                            </View>
                </TouchableOpacity>
            
                <Collapsible collapsed={isCollapsed7}>
                    <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                        <Text style={{fontFamily:"Poppins",marginBottom:3}}>{`Last Updated: 15th January, 2024

This Privacy Policy ("Policy") is a statement by Nexotin Company Ltd, a registered company in Ghana ("Company" or "we"), regarding the collection, use, and protection of personal information when you use Nexotin Mobile App ("Service").
`}</Text>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>1. Information We Collect
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>a. Personal Information: We may collect personal information, such as your name, email address, location and contact details when you register for an account or use our Service.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>b. Usage Data: We may collect information about how you interact with our Service, including your IP address, device information, and browsing patterns.
</Text>
                    </View>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>2. Use of Information

</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>a. Providing and Improving the Service: We use the collected information to provide and maintain the Service, to improve our offerings, and to personalize your experience.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>b. Communication: We may use your contact information to communicate with you about updates, promotions, and other relevant information.
</Text>
                    </View>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>3. Data Sharing
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>a. Third-Party Service Providers: We do not share your information with third parties & we do not track you across other apps or websites.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>b. Legal Compliance: We may disclose your information if required by law or in response to a valid legal request.
</Text>
                    </View>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>4. Cookies and Similar Technologies</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>a. Cookies: We use cookies and similar technologies to collect and store information when you access our Service. You can configure your browser to refuse all cookies or to indicate when a cookie is being sent.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>b. Legal Compliance: We may disclose your information if required by law or in response to a valid legal request.</Text>
                    </View>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>5. Data Security
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
</Text>
                    </View>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>6. Your Rights
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>a. Access and Correction: You have the right to access and correct your personal information.
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>b. Opt-Out: You can opt-out of receiving promotional communications from us by following the instructions in our emails or contacting us directly.
</Text>
                    </View>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>7. Children's Privacy
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>Our Service is not directed at individuals under the legal age. We do not knowingly collect personal information from children under legal age. If you believe that we have inadvertently collected personal information from a child, please contact us to remove the information.
</Text>
                    </View>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>8. Changes to this Policy</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>We reserve the right to update or modify this Privacy Policy at any time. The most recent version will be indicated by the "Last Updated" date.
</Text>
                    </View>
                                        <View style={{marginTop:20}}>
                        <Text style={{fontFamily:"Poppins",fontSize:20}}>9. Contact Information
</Text>
<Text style={{fontFamily:"Poppins",marginTop:5}}>If you have any questions about this Privacy Policy, please contact Nexotin Company Ltd.
</Text>
                    </View>
                    </View>
                </Collapsible>
                
                <TouchableOpacity onPress={()=>{
                setIsCollapsed1(!isCollapsed1)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed1?30:0,borderBottomRightRadius:isCollapsed1?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Refund & Returns Policy</Text>
                    </View>
                    <View>
                        {isCollapsed1===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed1}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>{`General Terms
By opening an account, you confirm that you are in agreement with and bound by the terms of service contained in the Returns & Refund terms outlined below. These terms apply to the entire website and any email or other type of communication between you and Nexotin company ltd.
`}</Text>
                <View style={{marginTop:20}}>
<Text style={{fontFamily:"Poppins",marginTop:5}}>{`Return
Eligible Time Period Most products on Nexotin company ltd can be returned within 48 hours after delivery. ie: If an item is delivered on the 01st, It can returned not later than 03rd provided that item is not from these restricted categories ( Health, Beauty, Underwears). Take Note After 48 hours of delivery, items cannot be returned. However, items that expired or damaged would be replaced by the seller.
`}
</Text>
                </View>
                <View style={{marginTop:20}}>
<Text style={{fontFamily:"Poppins",marginTop:5}}>{`Prerequisites For an Eligible Return Request:
The product shall not be from Health, Beauty & Underwears 
The product and its package are in good state (not broken or spotted) 
The product state should match your return reason.
`}
</Text>
                </View>
                <View style={{marginTop:20}}>
<Text style={{fontFamily:"Poppins",marginTop:5}}>{`Refunds;
We have 3 stages you can request a refund or replacement
1. After an order is placed & payment is done but product is yet to be delivered to your delivery address (Full amount refund or you can change to a different product of the same price)
2. Product is delivered to your address (product cost only be refunded - Delivery fee not refundable. Replacement can be done at additional delivery cost)
3. If the wrong product is delivered (Replacement at no extra cost or full refund)
`}
</Text>
                </View>
                    </View>
            </Collapsible>

            <TouchableOpacity onPress={()=>{
                setIsCollapsed2(!isCollapsed2)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed2?30:0,borderBottomRightRadius:isCollapsed2?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Terms & Conditions</Text>
                    </View>
                    <View>
                        {isCollapsed2===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed2}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
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
                </View>
            </Collapsible>
                </ScrollView>
        </SafeAreaView>
    )
}

export default TermsAndPolicies