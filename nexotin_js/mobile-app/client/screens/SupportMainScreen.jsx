import { View, Text,TouchableOpacity,ScrollView,Alert,StatusBar, TouchableWithoutFeedback} from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from '../constants/theme';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Collapsible from 'react-native-collapsible';
import { FontAwesome } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Linking from 'expo-linking'
import { router } from 'expo-router';
const SupportMainScreen = () => {

    // const navigation = useNavigation()

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
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Support</Text>
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
                    Linking.openURL("mailto:support@nexotin.com")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <AntDesign name="mail" size={24} color="black" />
                        {/* <AntDesign name="warning" size={24} color={COLORS.secondary} /> */}
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:COLORS.secondary}}>support@nexotin.com</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color={COLORS.secondary} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    Linking.openURL("https://wa.me/+233205462760")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <FontAwesome name="whatsapp" size={24} color="black" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:COLORS.secondary}}>+233 205 462 760</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color={COLORS.secondary} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    Linking.openURL("https://twitter.com/NexotinGhana")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <FontAwesome name="whatsapp" size={24} color="black" /> */}
                        <AntDesign name="twitter" size={24} color="black" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:COLORS.secondary}}>@nexotinghana</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color={COLORS.secondary} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    Linking.openURL("https://www.linkedin.com/company/nexotin-company-ltd/")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <Entypo name="linkedin" size={24} color="black" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:COLORS.secondary}}>Nexotin Company ltd</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color={COLORS.secondary} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    Linking.openURL("https://www.facebook.com/NexotinGhanaLtd")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <Entypo name="facebook" size={24} color="black" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:COLORS.secondary}}>Nexotin Ghana Limited</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color={COLORS.secondary} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    Linking.openURL("https://www.instagram.com/nexotin.app")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:20,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <Entypo name="facebook" size={24} color="black" /> */}
                        <Entypo name="instagram" size={24} color="black" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:COLORS.secondary}}>@nexotinghana</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color={COLORS.secondary} />
                    </View>
                </TouchableOpacity>
                
                </ScrollView>
        </SafeAreaView>
    )
}

export default SupportMainScreen