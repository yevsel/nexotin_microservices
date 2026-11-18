import { View, Text,TouchableOpacity,ScrollView,Alert,Dimensions,TextInput,FlatList,Image,StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
const TrackOrderMainScreen = () => {

    const navigation = useNavigation()
    const [orderNumber,setOrderNumber] = useState()

    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
                      <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <View style={{width:"90%"}}>
            
                <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                    <TouchableOpacity onPress={()=>{
                        // navigation.goBack()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Track Order</Text>
                </View>
                <View style={{marginBottom:20,borderWidth:1,borderColor:"#ccc",paddingHorizontal:20,flexDirection:"row",alignItems:"center",borderRadius:50}}>
                    <TextInput onChangeText={(e)=>{
                        //Search database
                        // setSearchText(e)
                        // searchDatabase(e)
                    }} cursorColor={COLORS.primary} value={orderNumber}  placeholder="Enter order number" style={{fontSize:15,fontFamily:"Poppins",flex:1,paddingVertical:10}}/>
                    <Ionicons name="search-outline" size={20} color={COLORS.gray} />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default TrackOrderMainScreen