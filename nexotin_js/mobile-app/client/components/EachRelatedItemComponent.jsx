import { View, Text,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'

import {useDispatch} from "react-redux"
import { refreshPage } from '../Actions'
import { router } from 'expo-router'

const EachRelatedItemComponent = ({setRefreshPage,item,scrollTo}) => {

    const dispatch = useDispatch()

    // const navigation = useNavigation()
    // console.log(scrollTo) 
    return (
        <TouchableOpacity onPress={()=>{
            scrollTo(0)
            // console.log("HELLO")
            // setRefreshPage(!refreshPage)
            dispatch(refreshPage())
            // navigation.navigate("HOME",{screen:"ViewProductMainScreen",params:{id:item._id}})
            // navigation.navigate("ViewProductMainScreen",{id:item._id})
            router.push(`/shop/p/${item._id}`)
            // router.push({
            //     pathname:"/productDetails",
            //     params:{id:item._id}
            // })
        }} style={{width:"100%",flexDirection:"row",backgroundColor:COLORS.accent4,height:100,padding:10,borderRadius:15,marginBottom:15}}>
            {/* <Text>{item.name}</Text> */}
            <Image source={{uri:item.images[0].secure_url}} style={{width:80,height:80,borderRadius:10}} resizeMode='cover'/>
            <View style={{flex:1,marginLeft:10}}>
                {/* <View>{</View> */}
                <Text numberOfLines={2} style={{fontFamily:"Poppins",fontSize:15,lineHeight:18,color:"#333"}}>{item.name}</Text>
                <Text style={{fontFamily:"Mortend",fontSize:18}}>₵ {(item.price).toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default EachRelatedItemComponent