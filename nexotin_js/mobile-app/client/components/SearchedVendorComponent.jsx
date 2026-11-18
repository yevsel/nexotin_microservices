import { View, Text,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'

import AsyncStorage from '@react-native-async-storage/async-storage'
import DisplayVendorVideoImage from './DisplayVendorVideoImage';
import { router } from 'expo-router'

const SearchedVendorComponent = ({item}) => {

    const navigator = useNavigation()

    return (
        <TouchableOpacity onPress={()=>{
            // navigation.navigate("ViewProductMainScreen",{id:item._id})
                router.push({
                    pathname:"/vendorProfile",
                    params:{vendorId:item._id,accountType:item.accountType,vendorEmail:"sel3491justice@gmail.com"}
                })
            // navigator.navigate("VendorProfileScreenForHomeStack",{vendorId:item._id,accountType:item.accountType,vendorEmail:"sel3491justice@gmail.com"})
            // AsyncStorage.setItem("searchedItems",)
        }} style={{width:"100%",flexDirection:"row",backgroundColor:COLORS.accent4,height:70,padding:10,borderRadius:15,marginBottom:15}}>
            {/* <Text>{item.name}</Text> */}
            <DisplayVendorVideoImage profile={item}/>
            {/* <Image source={{uri:item?.profileImage.secure_url}} style={{width:80,height:80,borderRadius:10}} resizeMode='cover'/> */}
            <View style={{flex:1,marginLeft:10}}>
                {/* <View>{</View> */}
                <Text numberOfLines={2} style={{fontFamily:"Poppins",fontSize:17}}>{item.accountType==="individual"?item.firstName+" "+item.lastName:item.shopName}</Text>
                {/* <Text style={{fontFamily:"Mortend",fontSize:15}}>GHC {(Number(item.price).toFixed(2))}</Text> */}
            </View>
        </TouchableOpacity>
    )
}

export default SearchedVendorComponent