import {FlatList,StatusBar,RefreshControl, Dimensions} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants/theme";
import { useEffect,useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeTopComponent from "../components/HomeTopComponent";
import { useSelector,useDispatch } from "react-redux";
import HomeTopMostComponent from "../components/HomeTopMostComponent";
import { addProducts } from '../Actions';
import * as Device from 'expo-device';
// import * as SplashScreen from 'expo-splash-screen';
// import { StyleSheet, RefreshControl } from 'react-native';
// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync();

export const HomeScreen = ({setLoggedIn,setShowBottomNavigation,getProducts,fetchMoreData,productsData,loadingProducts})=>{

    const {height} = Dimensions.get("screen")

    useEffect(()=>{
        // setShowBottomNavigation(true)
        const initializeFavoriteArray= async()=>{
            try {
                if(! await AsyncStorage.getItem("favorites")){
                    await AsyncStorage.setItem("favorites",JSON.stringify([]))
                }
            } catch (error) {
                // console.log("ERROR creating favorites",error.message)
            }
        }
        initializeFavoriteArray()

    },[])


    return(
        <SafeAreaView  style={{backgroundColor:"white",height}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>   
            <HomeTopMostComponent setLoggedIn={setLoggedIn}/>
            <FlatList 
                onEndReached={()=>{
                    if(fetchMoreData){
                        getProducts()
                    }
                }}
                onEndReachedThreshold={0.05}
                showsVerticalScrollIndicator={false} 
                style={{backgroundColor:COLORS.white}} 
                ListHeaderComponent={<HomeTopComponent data={productsData} loadingProducts={loadingProducts}/>}
                />    
        </SafeAreaView>
    )
    
}
