import { View, Text,Dimensions,TouchableOpacity,StyleSheet,ActivityIndicator } from 'react-native'
import React, { useEffect,forwardRef,useImperativeHandle,useState, useCallback } from 'react'
import { Gesture, GestureDetector,ScrollView,FlatList } from 'react-native-gesture-handler'
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { COLORS } from '../constants/theme'
import { Feather } from '@expo/vector-icons';
import ProductDescription from './ProductDescription';
import ProductReviews from './ProductReviews';
import ProductRelatedItems from './ProductRelatedItems';
import { Entypo } from '@expo/vector-icons';
import {Badge} from "react-native-ui-lib"

// import { ActivityIndicator } from 'react-native';

const ViewProductsBottomSheet = forwardRef(({buyerImagesLoading,buyerImages,fetchProductReview,reviewsLoading,reviews,setFetchProductReview,refreshPage,setRefreshPage,productData,initialHeight},parentRef) => {


// console.log(Object.keys(productData))
    const [vendorInfo,setVendorInfo] = useState()
    
    useEffect(()=>{
        const grabVendorInfo = async(vendorId,accountType)=>{
            // console.log("VENDOR ID AND ACCOUNT TYPE",vendorId,accountType)
            const data = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-vendor-of-products",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({details:[{vendorId,accountType}]})
            })
            const dd = await data.json()
            // console.log("VENDOR INFO",dd)
            setVendorInfo(dd.msg)
            // console.log("VENDOR INFO",data)
        }
        grabVendorInfo(productData.accountOwnerID,productData.accountType)
    },[])

    useImperativeHandle(parentRef,()=>({MAX_TRANSLATE_Y,scrollTo,bottomSheetOption,setBottomSheetOption,reviews}),[scrollTo])
    const [bottomSheetOption,setBottomSheetOption] = useState("Reviews")
    const {width,height}=Dimensions.get("screen")
    // const MAX_TRANSLATE_Y = -700
    const MAX_TRANSLATE_Y = -height*0.77
    const translateY = useSharedValue(0)
    const active = useSharedValue(false)
    const context = useSharedValue({y:initialHeight})
    const gesture = Gesture
    .Pan()
    .onStart(()=>{
        context.value={y:translateY.value}
    })
    .onUpdate((event)=>{
        translateY.value = event.translationY+context.value.y
        if(translateY.value>=-200){
            active.value=false
        }else{
            active.value=true
        }
        // CLAMP TO THE TOP
        translateY.value = Math.max(translateY.value,MAX_TRANSLATE_Y)
    })
    .onEnd(()=>{
        if(translateY.value>-height/3){
            translateY.value = withSpring(0)
        }else if(translateY.value<-height/2){
            translateY.value = withSpring(MAX_TRANSLATE_Y)
        }
    })
    const rBottomSheetStyle = useAnimatedStyle(()=>{
        return {
            transform:[{translateY:translateY.value}]
        }
    })
    
    const scrollTo = useCallback((destination)=>{
        'worklet';
        if(destination===0){
            active.value=false
        }else{
            active.value=true
        }
        translateY.value=withSpring(destination,{damping:50})
    },[])
    // useEffect(()=>{
    //     translateY.value = withSpring(-height/3)
    // },[trigger])
    const rBackDropStyle = useAnimatedStyle(()=>{
        return {opacity:withTiming(active.value?1:0)}
    })
    
    const rBackDropProps = useAnimatedProps(()=>{
        return{
            pointerEvents:active.value ? "auto":"none"
        }
    },[])
    return (
        <>
            <Animated.View
                animatedProps={rBackDropProps}
                onTouchStart={()=>{
                    scrollTo(0)
                }}
                style={[rBackDropStyle,{...StyleSheet.absoluteFill,backgroundColor:"rgba(0,0,0,0.5)"}]}>
            </Animated.View>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[rBottomSheetStyle,{height:height,width:"100%",position:"absolute",top:height,borderRadius:25,backgroundColor:"white"}]}>
                    {/* <Text>ViewProductsBottomSheet</Text> */}
                    <View style={{width:75,height:4,backgroundColor:"gray",alignSelf:"center",marginVertical:15,borderRadius:5}}>
                    </View>
                    <View style={{width:"90%",alignSelf:"center"}}>
                        <View style={{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between"}}>
                            <Text style={{fontSize:20,width:"80%",fontFamily:"Poppins",color:COLORS.secondary}}>{productData.name}</Text>
                            <TouchableOpacity style={{}} onPress={()=>{scrollTo(0)}}>
                                <Entypo name="chevron-with-circle-down" size={30} color="gray" />
                                {/* <FontAwesome name="chevron-circle-down" size={30} color={COLORS.accent2} /> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={{width:"90%",alignSelf:"center",flexDirection:"row",justifyContent:"space-between",paddingVertical:10}}>
                        <TouchableOpacity onPress={()=>{
                            setBottomSheetOption("Description")
                        }} style={{flex:1}}>
                            <Text style={{color:COLORS.secondary,textAlign:"left",fontFamily:"Poppins",fontSize:16}}>Description</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            scrollTo(MAX_TRANSLATE_Y)
                            setBottomSheetOption("Reviews")
                        }} style={{flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                            <Text style={{color:COLORS.secondary,textAlign:"center",fontFamily:"Poppins",fontSize:16}}>Reviews</Text>
                            {/* <View style={{borderRadius:8,marginHorizontal:5,backgroundColor:COLORS.primary,paddingHorizontal:5,}}>
                                <Text style={{color:"white",fontFamily:"Poppins"}}>{reviews&&reviews.length}</Text>
                            </View> */}
                            <Badge backgroundColor={COLORS.primary} containerStyle={{paddingHorizontal:5}} labelStyle={{fontSize:15}} label={reviewsLoading?<ActivityIndicator size={15} color='white'/>:reviews.length} size={20}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            setBottomSheetOption("RelatedItems")
                        }} style={{flex:1}}>
                            <Text style={{color:COLORS.secondary,textAlign:"right",fontFamily:"Poppins",fontSize:16}}>Related Items</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Line in Bottom Sheet */}
                    <View style={{flexDirection:"row",width:"90%",alignSelf:"center",height:2,borderRadius:10,backgroundColor:"#ededed",marginBottom:15}}>
                        <View style={bottomSheetOption==="Description"?{flex:1,height:2,backgroundColor:COLORS.redOrange}:{flex:1,height:2}}>
                        </View>
                        <View style={bottomSheetOption==="Reviews"?{flex:1,height:2,backgroundColor:COLORS.redOrange}:{flex:1,height:2}}>
                        </View>
                        <View style={bottomSheetOption==="RelatedItems"?{flex:1,height:2,backgroundColor:COLORS.redOrange}:{flex:1,height:2}}>
                        </View>
                    </View>
                    
                    {/*  */}
                    <View>
                        {
                            bottomSheetOption==="Description"?
                            <ProductDescription scrollTo={scrollTo} ScrollView={ScrollView} productData={productData} vendorInfo={vendorInfo}/>:
                            bottomSheetOption==="Reviews"?
                            <ProductReviews buyerImagesLoading={buyerImagesLoading} buyerImages={buyerImages} fetchProductReview={fetchProductReview} MAX_TRANSLATE_Y={MAX_TRANSLATE_Y } reviewsLoading={reviewsLoading} reviews={reviews} setFetchProductReview={setFetchProductReview} scrollTo={scrollTo} ScrollView={ScrollView} productData={productData}/>:
                            bottomSheetOption==="RelatedItems"?
                            <ProductRelatedItems refreshPage={refreshPage} setRefreshPage={setRefreshPage} scrollTo={scrollTo} ScrollView={ScrollView} FlatList={FlatList} productData={productData}/>:null
                        }
                        
                    </View>
                    
                </Animated.View>
            </GestureDetector>
        </>
    )
})

export default ViewProductsBottomSheet