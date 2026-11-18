import { View, Text,TouchableOpacity,StatusBar,FlatList,Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import TopBasket from '../components/TopBasket';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/CategoriesStyle';

import { COLORS } from '../constants/theme';
import {categories} from "../data/categoriesData"
import EachCategoryItem from '../components/EachCategoryItem';
import * as Device from 'expo-device';
import { router, useLocalSearchParams } from "expo-router";
const CategoriesScreen = ({route}) => {
    const {categoryName} = useLocalSearchParams()

    const [menOrWomenSelected,setMenOrWomenSelected]=useState("men")
    const menSelectedContainer={
        // borderWidth:3,
        // borderColor:"gray",
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        paddingVertical:18,
        backgroundColor:COLORS.redOrange,
        marginRight:10,
        borderRadius:40
        
    }
    const menUnSelectedContainer={
        // borderWidth:3,
        // borderColor:"gray",
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        paddingVertical:18,
        backgroundColor:"#ccc",
        marginRight:10,
        borderRadius:40
    }
    const womenSelectedContainer={
        // borderWidth:3,
        // borderColor:"gray",
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:COLORS.redOrange,
        paddingVertical:18,
        marginLeft:10,
        borderRadius:40
    }
    const womenUnSelectedContainer={
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#ccc",
        paddingVertical:18,
        marginLeft:10,
        borderRadius:40
    }

    return (
        <SafeAreaView style={{backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={()=> {
                    router.push("/(tabs)/Home")
                }}>
                    <Ionicons name="chevron-back-sharp" size={30} color="black" />
                </TouchableOpacity>
                <View style={styles.headerContainerTitle}>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333",textAlign:"center"}}>Categories</Text>
                </View>
                <View>
                    <TopBasket/>
                </View>
            </View>
            {/* Main Part */}
            {/* <View style={styles.menAndWomenContainer}>
                <TouchableOpacity onPress={()=>setMenOrWomenSelected("men")} style={menOrWomenSelected==="men"?menSelectedContainer:menUnSelectedContainer}>
                    <Text style={styles.menAndWomenText}>MEN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setMenOrWomenSelected("women")} style={menOrWomenSelected==="women"?womenSelectedContainer:womenUnSelectedContainer}>
                    <Text style={styles.menAndWomenText}>WOMEN</Text>
                </TouchableOpacity>
            </View> */}
            {/* Body */}
            <View style={{height:"100%",backgroundColor:"white",paddingHorizontal:15}}>
                <FlatList
                    data={categories}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item)=>item.id}
                    contentContainerStyle={{ paddingBottom: 400 }}
                    renderItem={({item})=><EachCategoryItem gender={menOrWomenSelected} data={item}/>}
                />
            </View>
        </SafeAreaView>
    )
}

export default CategoriesScreen