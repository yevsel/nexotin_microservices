import { View, Text,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'


const SearchItemComponent = ({item}) => {

    const navigation = useNavigation()
    
    

    return (
        <TouchableOpacity onPress={()=>{
            // navigation.navigate("ViewProductMainScreen",{id:item._id})
            router.push(`/shop/p/${item._id}`)
            // AsyncStorage.setItem("searchedItems",)
        }} style={{width:"100%",flexDirection:"row",backgroundColor:COLORS.accent4,height:100,padding:10,borderRadius:15,marginBottom:15}}>
            {/* <Text>{item.name}</Text> */}
            <Image source={{uri:item.images[0].secure_url}} style={{width:80,height:80,borderRadius:10}} resizeMode='cover'/>
            <View style={{flex:1,marginLeft:10}}>
                {/* <View>{</View> */}
                <Text numberOfLines={2} style={{fontFamily:"Poppins",fontSize:16}}>{item.name}</Text>
                <Text style={{fontFamily:"Mortend",fontSize:15}}>₵ {(Number(item.price).toFixed(2))}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SearchItemComponent