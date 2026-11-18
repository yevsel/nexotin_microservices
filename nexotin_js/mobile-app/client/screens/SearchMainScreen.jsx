import { View, Text, ScrollView,StatusBar,Image, TouchableOpacity, TextInput,Dimensions,FlatList,Platform } from 'react-native'
import React,{useState,useEffect,useCallback, useContext} from 'react'
// import { SafeAreaFrameContext } from 'react-native-safe-area-context'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Entypo } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import SearchItemComponent from '../components/SearchItemComponent';
// import { TextInput } from 'react-native-gesture-handler';
import {styles} from "../styles/HomeStyle"
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Banner3 from "../assets/Banner7.png"
import Banner1 from "../assets/Banner6.png"
import Banner4 from "../assets/Banner8.png"
import Banner5 from "../assets/Banner5.png"
import * as Device from 'expo-device';
import {Carousel} from "react-native-ui-lib"
import SearchedVendorComponent from '../components/SearchedVendorComponent';
import { MasonryFlashList } from "@shopify/flash-list";
import SearchProductsOrVendorsComponent from '../components/SearchProductsOrVendorsComponent';
//import EachHomeItem
import EachHomeItem from '../components/EachHomeItem';
import LottieView from 'lottie-react-native';
import { ParentContext } from '../context/ParentContext';

const SearchMainScreen = ({phraseRef}) => {

    const {setShowBottomNavigation} = useContext(ParentContext)

    const {width,height} = Dimensions.get("screen")
    // const navigation = useNavigation()
    const [searchText,setSearchText] = useState()
    const [searchResponse,setSearchResponse] = useState([])
    
    const [toggleSearch,setToggleSearch] = useState(false)
    
    const [productsOrVendors,setProductsOrVendors] = useState("products")
    
    const [route, setRoute] = useState("api/search-products")
    
    const [loading,setLoading] = useState(false)

    const renderItem = ({ item }) => <EachHomeItem key={item._id} data={item} />
    
    // const route = {
    //     product:"/api/search-products",
    //     vendors:"/api/search-vendors"
    // }

    useEffect(()=>{
        setShowBottomNavigation(false)
    },[])
    
    useEffect(() => {

        // console.log("SEARCING DATABASE")
        const searchDatabase = async(text,route)=>{
            if(text){
                setLoading(true)
            }
            try {
                // const responseFromDB = await fetch(`https://nexotin-mobile-server.onrender.com/${route}`,{
                    const responseFromDB = await fetch(`${process.env.EXPO_PUBLIC_SERVER_ROUTE}/api/full-text-search`,{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({name:text})
                })
                const result = await responseFromDB.json()
                // console.log(result.msg)
                setSearchResponse(result.msg)
                setLoading(false)
                // console.log("RESULT FROM SEARCH",result)
            } catch (error) {
                console.log("Search error",error.message)
                setLoading(false)
            }
        }
        searchDatabase(searchText,route)

        
    },[toggleSearch,route])
    
    
    useEffect(()=>{
                
        return ()=>{
            setSearchText("")
            setRoute("api/search-products")
            setSearchResponse([])
        }
    },[])
    
    
    const debounce = (cb, delay = 500) => {
        let timeout; 
        return (...args) => { 
          clearTimeout(timeout); 
          timeout = setTimeout(() => cb(...args), delay); 
        };
      };
    
      const handleSearch = useCallback(
        debounce((text) => {
        //   console.log("Debounced Search:", text);
          setToggleSearch(!toggleSearch)
        }),
        [searchText]
      );
    
    return (
        <SafeAreaView style={{height,alignItems:"center",backgroundColor:"white"}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <ScrollView style={{width:"100%"}} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}}>
                <View style={{ width: "95%", marginTop:15, alignSelf: "center", marginBottom: 20, borderWidth: 1, borderColor: "gray", paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderRadius: 50 }}>
                    <TextInput
                        autoComplete={ Platform.OS === 'web' ? 'none' : 'off' }
                        autoFocus onChangeText={(e)=>{
                        handleSearch(e)
                        setSearchText(e)
                    }} cursorColor={COLORS.primary}  value={searchText}  placeholder="Search, Shop, Slay!" placeholderTextColor={"gray"} style={{fontSize:15,fontFamily:"Poppins",flex:1,paddingVertical:10}}/>
                    <Ionicons name="search-outline" size={20} color={"gray"} />
                </View>
                <View style={{width:"100%",alignItems:"center",flexDirection:"row",gap:30,paddingLeft:20,marginBottom:20}}>
                    <Text style={{fontFamily:"Poppins",color:"gray"}}>Show results as</Text>
                    {/* Products */}
                    <TouchableOpacity
                        onPress={()=>{
                            setProductsOrVendors("products")
                            setRoute("api/search-products")
                            setSearchResponse([])
                        }}
                    style={productsOrVendors==="products"?{backgroundColor:"white",paddingVertical:5,paddingHorizontal:15,borderRadius:20}:{backgroundColor:"white",paddingVertical:5,paddingHorizontal:15,borderRadius:20}}>
                        <Text style={productsOrVendors==="products"?{color:COLORS.redOrange,fontSize:14}:{color:"gray"}}>Products</Text>
                    </TouchableOpacity>
                    {/* Vendors */}
                </View>
                <FlatList 
                    style={{flex:1}}
                    onEndReached={()=>{
                        console.log("You have reached the end")
                    }}
                    onEndReachedThreshold={0.05}
                    ListHeaderComponent={
                        loading?
                        <View style={{height:300,width:"100%",justifyContent:"center",alignItems:"center"}}>
                            <LottieView style={{width:100,height:250}} autoPlay source={require("../lottieAnimations/loading.json")}/>
                        </View>
                        :
                        <SearchProductsOrVendorsComponent searchResponse={searchResponse} productsOrVendors={productsOrVendors}/>
                    }
                />
                
        <Carousel loop animated autoplay  pagingEnabled style={styles.bannerContainer} >
            <View>
                <Image style={[styles.bannerImage]} resizeMode='contain' source={Banner3}/>
            </View>
            <View>
                <Image style={[styles.bannerImage]} resizeMode='contain' source={Banner1}/>
            </View> 
            <View>
                <Image style={[styles.bannerImage]} resizeMode='contain' source={Banner5}/>
            </View>
            <View>
                <Image style={[styles.bannerImage]} resizeMode='contain' source={Banner4}/>
            </View>
        </Carousel>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SearchMainScreen