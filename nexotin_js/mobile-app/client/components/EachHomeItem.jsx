
import { View, Text,Image,TouchableOpacity, ScrollView,Dimensions} from 'react-native'
import React, { useEffect, useState,useCallback } from 'react'
import {styles} from "../styles/HomeStyle"
import { COLORS } from '../constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Audio} from "expo-av"
import ProductImageComponent from './ProductImageComponent';
import {useSelector} from "react-redux"
import { router } from 'expo-router';
const EachHomeItem = ({data,deactivateHeight=false,preview=false}) => {

    const expoPushTokenReducer = useSelector(state=>state.expoPushTokenReducer)

    // console.log("QU",data.productQuantity)
    // console.log("TRANSFORMED IMAGES",transformImage(data.images[0].secure_url))
    // console.log("IMAGE LINK",data.images[0].secure_url)
    
    // const navigation = useNavigation()
    const [addFavorite,setAddFavorite]=useState(false)
    const [inFavorites,setInFavorites] = useState(false)
    
    const [outOfStock,setOutOfStock] = useState(data.productQuantity===0?true:false)
    
    const checkIfInFavorites = useCallback(async()=>{
        try {
            const favorites = JSON.parse(await AsyncStorage.getItem("favorites"))
            // console.log("FAVORITES",favorites)
            if(favorites.length!==0){
                favorites.forEach((item)=>{
                    if(data._id===item.id){
                        setInFavorites(true)
                    }
                })
            }
        } catch (error) {
        }
        
    },[])
    
    const storeData = async(id,name,image,height,price,selectedSizes)=>{
        try {
            let favoritesArray = JSON.parse(await AsyncStorage.getItem("favorites"))
            const data = {  id,image,name,height,price,selectedSizes}
            let indexOfItem = favoritesArray.findIndex(item=>item.id===data.id)
            if(indexOfItem===-1){
                favoritesArray = [data,...favoritesArray]
                await AsyncStorage.setItem("favorites",JSON.stringify(favoritesArray))
                playSuccess()
            }
        } catch (error) {
            console.log("Store data error",error.message)
        }
    }

    const [sound, setSound] = useState();

    async function playSuccess() {
      const { sound } = await Audio.Sound.createAsync( require("../assets/sounds/tap.mp3"))
      ;
      setSound(sound);
  
      await sound.playAsync();
    }
    
    const storeTokenFree = async(pushToken)=>{
        try {
          let d = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/add-free-token",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({expoToken:pushToken,role:"mobile"})
          })
          let m = await d.json()
        //   console.log("M",m)
        } catch (error) {
          console.log("ERROR",error)
        }
      }

    const storeTokenInServer = async(pushToken)=>{
        AsyncStorage.getItem("userToken").then(async(userToken)=>{
            if(userToken){
                let d = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/save-expo-token",{
              // let d = await fetch("http://127.0.0.1:4500/api/save-expo-token",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${JSON.parse(userToken)}`
                },
                body:JSON.stringify({expoToken:pushToken,role:"mobile"})
            }
          )
          let m = await d.json()
            //   console.log('EXPO FROM CLICK',m)
            }else{
                console.log("NO TOKEN")
                }
              })
            }

    useEffect(()=>{
        checkIfInFavorites()
    },[])
    return (
        <TouchableOpacity onPress={()=>{
            // console.log("TOKEN REDUCER",expoPushTokenReducer)
            if(expoPushTokenReducer){
                storeTokenInServer(expoPushTokenReducer)
                storeTokenFree(expoPushTokenReducer)
            }else{
                // console.log("NO TOKEN TO PUSH")
            }
            router.push(`/shop/p/${data._id}`)
        }} style={styles.eachHomeItemContainer}>
            <View style={styles.eachHomeItemImageContainer}>
                {data.productQuantity===0 && (
                    <View style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 10,
                        zIndex: 5
                    }}>
                        <Text style={{
                            color: "white",
                            fontSize: 16,
                            textAlign: "center",
                            backgroundColor:"#FF5757",
                            padding:10,
                            paddingHorizontal:20
                        }}>Sold out</Text>
                    </View>
                )}

                    <ProductImageComponent source={data.images[0].secure_url} style={preview?{minWidth: 170,height:180,borderRadius:15}:{minWidth: 180,height:deactivateHeight?230:data.height,borderRadius:15}}/>
                
                <TouchableOpacity onPress={()=>{
                    storeData(data._id,data.name,data.images[0],data.height,data.price,data.selectedSizes)
                    setInFavorites(true)
                }} style={styles.eachItemFavoriteButton}>
                    {inFavorites?<FontAwesome name="bookmark" size={20} color={COLORS.white} />:<FontAwesome name="bookmark-o" size={20} color={COLORS.white} />}
                </TouchableOpacity>
            </View>
            {/* <Image source={{uri:images[0].secure_url}}/> */}
            <View style={styles.eachHomeItemTextContainer}>
                {data?.selectedSizes?.length>0&&
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {/* <Text style={{fontSize:8,padding:2,marginVertical:3}}>Sizes</Text> */}
                            {data.colors.slice(0,5).map((color,index)=>{
                                return (
                                    <View key={index} style={{padding:2,width:15,height:10,borderWidth:1,backgroundColor:color,borderColor:"#C0C0C0",borderRadius:3,marginRight:5,marginVertical:3}}>
                                        
                                    </View>
                                )
                            })}
                        </ScrollView>
                    }
                {data?.selectedSizes?.length>0&&
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {/* <Text style={{fontSize:8,padding:2,marginVertical:3}}>Sizes</Text> */}
                        {data.selectedSizes.slice(0,7).map((size,index)=>{
                            return (
                                <View key={index} style={{padding:2,borderWidth:1,borderColor:"#C0C0C0",borderRadius:3,marginRight:5,marginVertical:3}}>
                                    <Text style={{fontSize:7,color:"gray"}}>{size}</Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                }
                {!preview&&<Text numberOfLines={1} style={styles.eachHomeItemName}>{data.name}</Text>}
                <Text style={styles.eachHomeItemPrice}>₵ {(data.price).toFixed(2)}</Text>
            </View>
            
        </TouchableOpacity>
    )
}

export default EachHomeItem