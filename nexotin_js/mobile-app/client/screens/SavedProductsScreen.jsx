import { View,Image,StatusBar } from 'react-native'
import React,{useEffect,useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from "react-native-safe-area-context";
import SavedProductsHeaderComponent from '../components/SavedProductsHeaderComponent';
import EachSavedProduct from '../components/EachSavedProduct';
import styles from '../styles/SavedProductsStyle';
import emptyCart from "../assets/empty_cart.png"
import * as Device from "expo-device"
import { COLORS } from '../constants/theme';
import { MasonryFlashList } from "@shopify/flash-list";

const SavedProducts = () => {
    const [favoritesItemsState,setFavoritesItemsState]=useState([])
    // const isFocussed = useIsFocused()
    const getSavedDataArray = async()=>{
        AsyncStorage.getItem("favorites").then((data)=>{
            setFavoritesItemsState(JSON.parse(data))  
        }).catch(error=>{
            console.log("Error",error.message)
        })
    }
    

    useEffect(()=>{ 

        getSavedDataArray()
    },[])


    return (
        <SafeAreaView backgroundColor="white" style={{flex:1}}>
        <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <SavedProductsHeaderComponent favoritesItemsState={favoritesItemsState} setFavoritesItemsState={setFavoritesItemsState}/>
            <View style={styles.savedProductContainer}>
                {favoritesItemsState.length>0?
                <MasonryFlashList
                    data={favoritesItemsState}
                    keyExtractor={(item) =>  item.id}
                    estimatedItemSize={2000}
                    numColumns={2}
                    // columnWrapperStyle={{ justifyContent: "space-around" }}
                    // contentContainerStyle={{ paddingBottom: 300 }}
                    // showsVerticalScrollIndicator={false} 
                    renderItem={({item}) => <EachSavedProduct setFavoritesItemsState={setFavoritesItemsState} data={item}/>}/>
            :
            <View style={{width:"100%",alignItems:"center",marginTop:100}}>
                        <Image source={emptyCart} style={{width:"100%",height:120}} resizeMode='contain'/>
                        {/* <View style={{padding:5,paddingHorizontal:40,borderRadius:20,backgroundColor:COLORS.redOrange,}}>
                            <Text style={{color:"white",fontFamily:"Poppins"}}>Empty</Text>
                        </View> */}
                    </View>
            }
            </View>
        </SafeAreaView>
    )
}

export default SavedProducts