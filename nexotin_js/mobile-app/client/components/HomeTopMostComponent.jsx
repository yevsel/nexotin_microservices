import { View, Text,StyleSheet,TextInput,TouchableOpacity,FlatList,ScrollView,Image } from 'react-native'
import React,{useState,useEffect} from 'react'
import {styles} from "../styles/HomeStyle"
import {COLORS,FONTS,SIZES} from "../constants/theme"
import { Ionicons } from '@expo/vector-icons';
import TopBasket from './TopBasket';
import nexotinLogo2 from "../assets/nexotinLogo2.png"
import AsyncStorage from '@react-native-async-storage/async-storage'

import { MasonryFlashList } from "@shopify/flash-list";
import { router } from 'expo-router';
const HomeTopMostComponent = () => {

    
    const [expoToken,setExpoToken]=useState("")
    const [resetSending,setResetSending]= useState(false)
    

    return (
    <View>
        <View style={styles.headingContainer}>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <Image source={nexotinLogo2} style={{width:70,height:20}} resizeMode='contain'/>
            </View>
            <View style={{flexDirection:"row",alignItems:"center"}}>
                <TouchableOpacity onPress={()=>{
                    // navigation.navigate("SearchMainScreen")
                    router.push("/(tabs)/Home/search")
                    
                }} style={styles.headingTextInputContainer}>
                    <Text style={{flex:1,paddingHorizontal:5,fontFamily:"Poppins",color:"gray",}}>Search Shop & Slay</Text>
                    <Ionicons name="search-outline" size={20} color={COLORS.gray} />
                </TouchableOpacity>
                <TopBasket />
            </View>
        </View>
    </View>
    )
}
const headingStyle=StyleSheet.create({
    headingStyle:{
        fontFamily:"Mortend",
        fontSize:SIZES.headingSize,
        textAlign:"center"
    }
})
export default HomeTopMostComponent