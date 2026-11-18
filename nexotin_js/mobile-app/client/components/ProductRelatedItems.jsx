import { View, Text, Dimensions} from 'react-native'
import React,{useEffect,useState,useCallback} from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../constants/theme'
import EachHomeItem from "./EachHomeItem"; 
import {ActivityIndicator} from "react-native-paper"
import EachRelatedItemComponent from './EachRelatedItemComponent';
import {useDispatch} from "react-redux"
import { refreshPage } from '../Actions';
const ProductRelatedItems = ({refreshPage,setRefreshPage,FlatList,ScrollView,productData,scrollTo}) => {

    const {width,height} = Dimensions.get("screen")
    const [loadingProducts,setLoadingProducts] = useState(false)
    const [data,setData] = useState([])
    
    // const dispatch = useDispatch()
    
    
    const getRelatedItems = useCallback(async(req,res)=>{
        try {
            setLoadingProducts(true)
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-related-items",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({mainCategory:productData.mainCategory})
            })
            const result = await response.json()
            setData(result.msg)
            setLoadingProducts(false)
        } catch (error) {
            console.log(error.message)
            setLoadingProducts(false)
        }
    },[])
    
    const renderItem = ({item}) => <EachHomeItem key={item._id}  data={item}/>
    
    useEffect(()=>{
        getRelatedItems()
    },[])
    
    if(loadingProducts){
        return (
        <View>
            <ActivityIndicator color={COLORS.primary}/>
        </View>)
    }
    
  return (
    <View style={{height:height*0.6,width:"100%",alignSelf:"center"}}>
        <ScrollView scrollEnabled={true}  showsVerticalScrollIndicator={false} style={{width:"90%",alignSelf:"center",flex:1}}>
            {data.map((item,index)=><EachRelatedItemComponent refreshPage={refreshPage} setRefreshPage={setRefreshPage} scrollTo={scrollTo} item={item} key={index}/>)}
        </ScrollView>
    </View>
  )
}

export default ProductRelatedItems