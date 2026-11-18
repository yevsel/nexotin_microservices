import {FlatList,StatusBar,RefreshControl, Dimensions,Text,TouchableOpacity,View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../../constants/theme";
import { useContext, useEffect,useState,useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeTopComponent from "../../../components/HomeTopComponent";
import { useSelector,useDispatch } from "react-redux";
import HomeTopMostComponent from "../../../components/HomeTopMostComponent";
import { addProducts } from '../../../Actions';
import * as Device from 'expo-device';
import { ParentContext } from "../../../context/ParentContext";
import { Link } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
const HomeScreen = () => {
    const {height} = Dimensions.get("screen")
    
    const {
        setLoggedIn,
        loggedIn,
        loadingProducts,
        fetchMoreData,
        getProducts
        } = useContext(ParentContext)

    const productsReducer = useSelector(state=>state.productsReducer)
    // console.log("RES",productsReducer)
    useEffect(()=>{
        // setShowBottomNavigation(true)
        const initializeFavoriteArray= async()=>{
            try {
                if(! await AsyncStorage.getItem("favorites")){
                    await AsyncStorage.setItem("favorites",JSON.stringify([]))
                }
            } catch (error) {
                // console.log("ERROR creating favorites",error.message)
            }
        }
        initializeFavoriteArray()

    },[])
    
    
     
        const [scrollY, setScrollY] = useState(0);
        const flatListRef = useRef();
        

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{position:"relative"}}>
            <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>   
            <HomeTopMostComponent setLoggedIn={setLoggedIn}/>
               <FlatList 
                  ref={flatListRef}
                  onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
                  scrollEventThrottle={16} // ensures smooth scroll tracking
                  onEndReached={() => {
                    if (fetchMoreData) {
                      getProducts();
                    }
                  }}
                  onEndReachedThreshold={0.05}
                  showsVerticalScrollIndicator={false} 
                  style={{ backgroundColor: COLORS.white }} 
                  ListHeaderComponent={<HomeTopComponent data={productsReducer} loadingProducts={loadingProducts} />}
                />
              
           {scrollY>=2000? <TouchableOpacity onPress={() => flatListRef.current.scrollToOffset({ offset: 0, animated: true })} style={{position:"absolute",bottom:80,right:30,backgroundColor:COLORS.redOrange,borderRadius:50,width:35,height:35,justifyContent:"center",alignItems:"center"}}>
                    <FontAwesome name="angle-double-up" size={24} color="white" />
                </TouchableOpacity> : null}
        </View>
                            
</SafeAreaView>
  )
}

export default HomeScreen