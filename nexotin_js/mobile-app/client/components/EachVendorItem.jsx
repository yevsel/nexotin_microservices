import { View, Text,Image, TouchableOpacity,ScrollView } from 'react-native'
import React,{useState} from 'react'
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../constants/theme'
import ProductImageComponent from './ProductImageComponent';
import {useDispatch} from "react-redux"
import { refreshPage } from '../Actions'
import { router } from 'expo-router';

const EachItem = ({item}) => {
    
    const dispatch = useDispatch()
    
     const [outOfStock,setOutOfStock] = useState(item.productQuantity===0?true:false)

    return (
        <TouchableOpacity onPress={()=>{
            dispatch(refreshPage())
            router.push(`/shop/p/${item._id}`)
        }} style={{margin:5}}>
            <View style={{position:"relative",borderRadius:10,overflow:"hidden"}}>
                {item.productQuantity===0 && (
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
            <ProductImageComponent source={item.images[0].secure_url} style={{maxWidth:200,height:item.height,borderRadius:15}}/>
                {/* <Image source={{uri:item.images[0].secure_url}} style={{maxWidth:200,height:item.height}}/> */}
            </View>
            <View style={{marginVertical:5}}>
                {item.selectedSizes.length>0&&
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            {/* <Text style={{fontSize:8,padding:2,marginVertical:3}}>Sizes</Text> */}
                            {item?.selectedSizes?.slice(0,7).map((size,index)=>{
                                return (
                                    <View key={index} style={{padding:2,borderWidth:1,borderColor:"#C0C0C0",borderRadius:3,marginRight:5,marginVertical:3}}>
                                        <Text style={{fontSize:8,color:"gray"}}>{size}</Text>
                                    </View>
                                )
                            })}
                        </ScrollView>
                    }
                <Text numberOfLines={1} style={{fontFamily:"Poppins",fontSize:12,color:"#333",lineHeight:18}}>{item.name}</Text>
                <Text style={{fontFamily:"Mortend",fontSize:15,color:"#333"}}>₵ {(item.price).toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default EachItem