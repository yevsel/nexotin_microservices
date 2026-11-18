import { View, Text,TouchableOpacity,ScrollView, TextInput,Alert,Dimensions } from 'react-native'
import React, { useEffect, useState,useRef, useContext } from 'react'
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import EachHomeItem from '../components/EachHomeItem';
import { ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants/theme';
import { FlatList } from 'react-native-gesture-handler';
import { MasonryFlashList } from "@shopify/flash-list";
import LottieView from 'lottie-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'react-native';
import CategoriesFilteringSystem from '../components/CategoriesFilteringSystem';
import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { removeCategoriesData } from '../Actions';
import { useDispatch,useSelector } from 'react-redux';
import { ParentContext } from '../context/ParentContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SpecificCategoryScreen = ({}) => {
    const fromRef = useRef()
    const toRef = useRef()
    const [from,setFrom] = useState(null)
    const [to,setTo] = useState(null)
    const [men,setMen] = useState(false)
    const [women,setWomen] = useState(false)
    const [showFilter,setShowFilter] = useState(false)
    const [triggerPrice,setTriggerPrice] = useState(true)
    
    const [triggerSearch,setTriggerSearch] = useState(false)
    
    const [ObjectToSend,setObjectToSend] = useState({
    
    })
    
    // const {categoriesProductsData} = useContext(ParentContext)
    

    const [showPriceFilterTag,setShowPriceFilterTag] = useState(false)
    const {categoryName,specificCategory} = useLocalSearchParams()

    
    const [dataToSend,setDataToSend] = useState({})
    
    
    const [categoriesProductsData, setCategoriesProductsData] = useState([]);
    const [categoriesProductsLoading, setCategoriesProductsLoading] = useState(false);
    const [fetchMoreCategoryData, setFetchMoreCategoryData] = useState(true);
    
    const [noData,setNoData] = useState(false)
    
    
    const getProductsByCategory = async(obj)=>{
            try {
                setCategoriesProductsLoading(true)
                let dateToSend = null
                if(categoriesProductsData.length===0){
                    dateToSend = Date.now()
                }else{
                    dateToSend = categoriesProductsData[categoriesProductsData.length-1].createdAt
                }
                let dataToSend = {
                  categoryName:obj.categoryName,
                  specificCategory:obj.specificCategory,
                  from:obj.from,
                  to:obj.to,
                  gender:obj.gender,
                  createdAt:dateToSend
                }
                if(!Object.values(dataToSend).includes(undefined)){
                  
                    // console.log("OTS",dataToSend)
                  const responseFromDB = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-products-by-category",{
                      method:"POST",
                      headers:{"Content-Type":"application/json"},
                      body:JSON.stringify(dataToSend)
                  })
                  
                  const result = await responseFromDB.json()
                  
                  if(categoriesProductsData.length===0 && result && result.msg.length===0){
                    setCategoriesProductsLoading(false)
                    setNoData(true)
                  }
                  
                  AsyncStorage.getItem("blockedProducts").then((blockedProductsData)=>{
                    const blockedProducts = JSON.parse(blockedProductsData)
                    const filtered = result.msg.filter(item=>{
                        if(!blockedProducts.includes(item._id)){
                            return item
                        }
                    })
                    setCategoriesProductsData([...categoriesProductsData,...filtered])
                  }).catch(err=>console.log(err))
                  if(result.msg.length<5){
                      setFetchMoreCategoryData(false) 
                  }else{
                      setFetchMoreCategoryData(true)
                  }
                  setCategoriesProductsLoading(false)
                }
            } catch (error) {
                Alert.alert('Products fetching', 'Network error please try again', [
                    {text: 'OK', onPress: () => {}},
                ]);
                setCategoriesProductsLoading(false)
            }
        }
        
    
    useEffect(()=>{

        getProductsByCategory(dataToSend)
        
    },[dataToSend,fetchMoreCategoryData])
    
    
    const [scrollY, setScrollY] = useState(0);
    const flatListRef = useRef();
    
    
    
    useEffect(()=>{
        // console.log("SCROLL",scrollY)
    },[scrollY])
    
    const grabRightGender={
        "women":"Women",
        "men":"Men"
    }
    
    const height = Dimensions.get("screen").height
    

    
    return (
        
        <View style={{flex:1,backgroundColor:"white",position:"relative"}}>
        <StatusBar translucent backgroundColor="transparent" />
            
                <View style={{paddingBottom:0,width:"100%",paddingTop:40}}>
                    <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                        <View style={{width:"100%"}}>
                            <Text style={{fontFamily:"Poppins",fontSize:18,color:"gray",textAlign:"center"}}>{categoryName}</Text>
                            <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                {(dataToSend.gender && dataToSend.specificCategory)?<Text style={{fontFamily:"Poppins",fontSize:10,color:"gray",textAlign:"center"}}>{grabRightGender[dataToSend.gender]}</Text>:<Text></Text>}
                                {dataToSend.specificCategory&&<Text style={{fontSize:18,paddingBottom:2,color:COLORS.redOrange}}> · </Text>}
                                {dataToSend.specificCategory?<Text style={{fontFamily:"Poppins",fontSize:10,color:"gray",textAlign:"center"}}>{dataToSend.specificCategory}</Text>:<Text></Text>}
                                {showPriceFilterTag&&<Text style={{fontSize:18,paddingBottom:2,color:COLORS.redOrange}}> · </Text>}
                                {showPriceFilterTag?<Text style={{fontFamily:"Poppins",fontSize:10,color:"gray",textAlign:"center"}}>₵ {Number(dataToSend.from).toFixed(2)} - ₵ {Number(dataToSend.to).toFixed(2)}</Text>:<Text></Text>}
                            </View>
                        </View>
                    </View>
                </View>
                {/* Categories Filtering system */}
                {/* <ScrollView> */}
                    
                    {
                        
                        <>
                            <FlatList  
                                style={{width:"100%"}} 
                                ref={flatListRef}
                                onScroll={(event) => {
                                    setScrollY(event.nativeEvent.contentOffset.y); // y-axis scroll distance
                                  }}
                                  scrollEventThrottle={16} // very important to make scroll smooth
                                showsVerticalScrollIndicator={false} 
                                contentContainerStyle={{paddingBottom:100}}
                                onEndReached={()=>{
                                    if(fetchMoreCategoryData){
                                        getProductsByCategory(dataToSend)
                                        
                                    }
                                }}
                                onEndReachedThreshold={0.05}
                                ListHeaderComponent={
                                <>
                                <CategoriesFilteringSystem setNoData={setNoData} showPriceFilterTag={showPriceFilterTag}  setShowPriceFilterTag={setShowPriceFilterTag} setCategoriesProductsData={setCategoriesProductsData} setDataToSend={setDataToSend}/>
                            
                                    
                                    {
                                        noData?
                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'white' }}>
                                          
                                          <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: '#333', marginTop: 90 }}>
                                            No Results Found
                                          </Text>
                                          <Text style={{ fontFamily: 'Poppins', fontSize: 14, color: 'gray', textAlign: 'center', marginTop: 5 }}>
                                            We couldn’t find any products matching your filters. Try adjusting them or come back later.
                                          </Text>
                                          
                                        </View>
                                        :
                                        
                                        <MasonryFlashList
                                          data={categoriesProductsData}
                                          numColumns={2}
                                            renderItem={({item}) => <EachHomeItem key={item._id}  data={item}/>}
                                          estimatedItemSize={2000}
                                        />
                                    }
                                    
                                    {categoriesProductsLoading&&<View style={{height:150,width:"100%",justifyContent:"center",alignItems:"center"}}>
                                                    <LottieView style={{width:100,height:250}} autoPlay source={require("../lottieAnimations/loading.json")}/>
                                                </View>}
                                    </>
                                
                                }
                            >
                            </FlatList>
                            {fetchMoreCategoryData===false?<View style={{marginVertical:5,backgroundColor:"transparent"}}>
                                {/* <Text style={{fontFamily:"Poppins",color:"gray",textAlign:"center",fontSize:10,transform: [{ translateY: -20 }]}}>Hope you found what you were looking for.</Text> */}
                            </View>:null}
                            
                            {scrollY>=1500?<TouchableOpacity onPress={() => flatListRef.current.scrollToOffset({ offset: 0, animated: true })} style={{position:"absolute",bottom:30,right:30,backgroundColor:COLORS.redOrange,borderRadius:50,width:35,height:35,justifyContent:"center",alignItems:"center"}}>
                                <FontAwesome name="angle-double-up" size={24} color="white" />
                            </TouchableOpacity>:null}
                        </>
                    }
                    
            {/* </ScrollView> */}
            </View>
    )
}

export default SpecificCategoryScreen