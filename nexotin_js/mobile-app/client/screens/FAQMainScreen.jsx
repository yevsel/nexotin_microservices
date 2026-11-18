import { View, Text,TouchableOpacity,ScrollView,Alert,StatusBar, TouchableWithoutFeedback} from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from '../constants/theme';
import { Entypo } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import * as Device from 'expo-device';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
const FAQMainScreen = () => {

    // const navigation = useNavigation()
    const [isCollapsed1,setIsCollapsed1] = useState(true)
    const [isCollapsed2,setIsCollapsed2] = useState(true)
    const [isCollapsed3,setIsCollapsed3] = useState(true)
    const [isCollapsed4,setIsCollapsed4] = useState(true)
    const [isCollapsed5,setIsCollapsed5] = useState(true)
    const [isCollapsed6,setIsCollapsed6] = useState(true)
    const [isCollapsed7,setIsCollapsed7] = useState(true)

    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="Apple"?"dark-content":"light-content"} backgroundColor={COLORS.secondary}></StatusBar>
            <View style={{marginVertical:15,flexDirection:"row",width:"90%",justifyContent:"center",position:"relative"}}>
                    <TouchableOpacity onPress={()=>{
                        router.back()
                        // navigation.goBack()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>FAQ</Text>
                </View>
            <ScrollView style={{width:"90%"}} contentContainerStyle={{ paddingBottom: 100}} showsVerticalScrollIndicator={false}>
            
            <TouchableOpacity onPress={()=>{
                setIsCollapsed7(!isCollapsed7)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed7?30:0,borderBottomRightRadius:isCollapsed7?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>What is Nexotin</Text>
                    </View>
                    <View>
                        {isCollapsed7===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed7}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>We are a fashion e-commerce marketplace with focus on providing the best platform for our buyers to find, order, pay & receive products in fashion, cosmetics & accessories.</Text>
                </View>
            </Collapsible>
            
            <TouchableOpacity onPress={()=>{
                setIsCollapsed1(!isCollapsed1)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed1?30:0,borderBottomRightRadius:isCollapsed1?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>How do I place an order?</Text>
                    </View>
                    <View>
                        {isCollapsed1===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed1}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                    <Text style={{fontFamily:"Poppins",marginBottom:10}}>Find the product you want either by typing in the search bar or scrolling on product category page and click on your preferred product</Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        1. See the product picture(s), read the description to be sure it is what you want to buy.
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        2. Select any preferred sizes or colors from options available.
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        3. Click on "Add to basket".
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        4. Click on the "Cart icons" at the top right corner of the screen.
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        5. Fill in your details; shipping/delivery fee is automatically calculated based on the address you enter. Leave it empty to use your default address.
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        6. Click on "Continue payment"; based on your delivery address & quantity or products you are ordering you will see an option select "Pay on delivery".
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        7. If you are able to select "Pay on delivery", click yes on the prompt to complete the ordering process.
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        If you select "Continue payment", you will be required to select your preferred method (Mobile money, or Card) & follow the prompt to complete the payment. If your payment is successful the order process is complete.
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:5}}>
                        You can see & track your orders from "My orders"
                    </Text>
                </View>
            </Collapsible>
            
            
            <TouchableOpacity onPress={()=>{
                setIsCollapsed2(!isCollapsed2)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed2?30:0,borderBottomRightRadius:isCollapsed2?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>How does refund & replacement works</Text>
                    </View>
                    <View>
                        {isCollapsed2===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed2}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                    
                    {/* <Text style={{fontFamily:"Poppins"}}>
                    Refunds:
                    </Text> */}
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                    1. After an order is placed & payment is done but product is yet to be delivered to your delivery address (Full amount refund or you can change to a different product of the same price)
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                    2. Product is delivered to your address (product cost only be refunded - Delivery fee not refundable. Replacement can be done at additional delivery cost)
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                    3. If the wrong product is delivered (Replacement at no extra cost or full refund)
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        Please note that refund or replacement would not be possible after 48hrs of product delivery
                    </Text>
                    {/* <Text style={{fontFamily:"Poppins"}}>
                    4. Fill in & select the necessary details (sex, name, price, category, colors, sizes, description, quantity, condition etc.)
                    </Text>
                    <Text style={{fontFamily:"Poppins"}}>
                    5. Click POST
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginTop:15}}>
                    Video
                    </Text>
                    <Text style={{fontFamily:"Poppins"}}>
                    1. Click on the + button icon on the navigation bar
                    </Text>
                    <Text style={{fontFamily:"Poppins"}}>
                    2. Click on the ADD VIDEO button
                    </Text>
                    <Text style={{fontFamily:"Poppins"}}>
                    3. Select a video
                    </Text>
                    <Text style={{fontFamily:"Poppins"}}>
                    4. Write a description
                    </Text>
                    <Text style={{fontFamily:"Poppins"}}>
                    5. In the TAG tab type in the name of the product in the video & select from the results
                    </Text>
                    <Text style={{fontFamily:"Poppins"}}>
                    6. Click on POST
                    </Text> */}
                </View>
            </Collapsible>
            
            <TouchableOpacity onPress={()=>{
                setIsCollapsed3(!isCollapsed3)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed3?30:0,borderBottomRightRadius:isCollapsed3?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Delivery/Shipping cost & time</Text>
                    </View>
                    <View>
                        {isCollapsed3===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed3}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>We calculate delivery cost mainly based on the distance between the delivery address and the sellers location.</Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>Products ordered from the same town or city as the sellers are delivered on the same day or next day.
                    </Text>
                    <Text style={{fontFamily:"Poppins"}}>Products ordered from different town or city as the sellers are delivered within 24 - 72 hrs.
                    </Text>
                </View>
            </Collapsible>
            
            
            <TouchableOpacity onPress={()=>{
                setIsCollapsed4(!isCollapsed4)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed4?30:0,borderBottomRightRadius:isCollapsed4?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Who owns the products?</Text>
                    </View>
                    <View>
                        {isCollapsed4===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed4}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                    <Text style={{fontFamily:"Poppins"}}>Products are owned and managed by independent sellers, Nexotin does not own any product.</Text>
                </View>
            </Collapsible>
            
            <TouchableOpacity onPress={()=>{
                setIsCollapsed5(!isCollapsed5)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed5?30:0,borderBottomRightRadius:isCollapsed5?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>How is fraud mitigated</Text>
                    </View>
                    <View>
                        {isCollapsed5===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed5}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>Fraud is one the issues we greatly care about & try as much as possible to reduce the chance of it happening. These are the measures we put in place;</Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        1. We verify every single seller using national IDs, pictures & if possible in-person visit.
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        2. Every payment goes through Nexotin before we disburse to our sellers.
                    </Text>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>
                        3. Every delivery package is cross-checked to make sure it is what was ordered.
                    </Text>
                </View>
            </Collapsible>
            <TouchableOpacity onPress={()=>{
                setIsCollapsed6(!isCollapsed6)
            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderBottomLeftRadius:isCollapsed5?30:0,borderBottomRightRadius:isCollapsed5?30:0,borderTopRightRadius:30,borderTopLeftRadius:30,marginBottom:-10,marginTop:40}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Become a seller</Text>
                    </View>
                    <View>
                        {isCollapsed6===true?<Feather name="plus" size={20} color="black" />:<Feather name="minus" size={20} color="black" />}
                    </View>
            </TouchableOpacity>
            
            <Collapsible collapsed={isCollapsed6}>
                <View style={{backgroundColor:COLORS.accent4,padding:20,borderBottomRightRadius:30,borderBottomLeftRadius:30}}>
                    <Text style={{fontFamily:"Poppins",marginBottom:3}}>Download the Nexotin Vendor app from App Store or Play Store, create an account, complete the verification & start selling.</Text>
                </View>
            </Collapsible>
            </ScrollView>
        </SafeAreaView>
    )
}

export default FAQMainScreen