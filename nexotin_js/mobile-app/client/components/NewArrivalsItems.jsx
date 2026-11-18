import { View, Text,FlatList,RefreshControl } from 'react-native'
import React,{useState} from 'react'
// import MasonryList from '@react-native-seoul/masonry-list';
import EachHomeItem from "./EachHomeItem"; 
import {styles} from "../styles/HomeStyle"
import {ActivityIndicator} from "react-native-paper"
import { COLORS } from '../constants/theme';
import { useSelector } from 'react-redux';
import { MasonryFlashList } from "@shopify/flash-list";
import LottieView from 'lottie-react-native';

const NewArrivalsItems = ({data,title,loadingProducts}) => {

    const renderItem = ({item}) => <EachHomeItem key={item._id}  data={item}/>
    const productsReducer = useSelector(state=>state.productsReducer)
    

    
    return (
    <View style={{paddingHorizontal:0}}>
        <MasonryFlashList
              data={productsReducer}
              numColumns={2}
              renderItem={renderItem}
              estimatedItemSize={2000}
              contentContainerStyle={{
                paddingHorizontal: 0,  // Reduce outer padding
                paddingTop: 0,         // Optional top spacing
                gap: 0,                // Avoid if not supported
              }}
            />
        {loadingProducts&&
            // <ActivityIndicator style={{paddingVertical:10}} color={COLORS.primary}/>
            <View style={{height:150,width:"100%",justifyContent:"center",alignItems:"center"}}>
                <LottieView style={{width:100,height:250}} autoPlay source={require("../lottieAnimations/loading.json")}/>
            </View>
        }
    </View>
    )
}

export default NewArrivalsItems