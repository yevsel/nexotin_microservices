import { View,StyleSheet,FlatList,ScrollView,Image,Text } from 'react-native'
import React,{useState,useEffect, useContext} from 'react'
import {styles} from "../styles/HomeStyle"
import {SIZES} from "../constants/theme"
import { categories } from "../data/categoriesData";
import Categories from "./Categories";
import Banner3 from "../assets/Banner7.png"
import Banner1 from "../assets/Banner6.png"
import Banner4 from "../assets/Banner8.png"
import Banner5 from "../assets/Banner5.png"
import NewArrivalsItems from "./NewArrivalsItems"
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProductImageComponent from './ProductImageComponent';
import {Carousel} from "react-native-ui-lib"
import { MasonryFlashList } from "@shopify/flash-list";
import { router } from 'expo-router';
import { ParentContext } from '../context/ParentContext';
import EachHomeItem from './EachHomeItem';
// import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import ShimmerPlaceholder from './shimmeringPlaceholder';
import HomeProductsPreview from './HomeProductsPreview';
// import { MaterialIcons } from '@expo/vector-icons';

const HomeTopComponent = ({loadingProducts,data}) => {

    const [hotSalesItems,setHotSalesItems] = useState([])
    
    // const navigation = useNavigation()
    
    const {getProductsByCategoryForHome} = useContext(ParentContext)
    
    const [menShirt,setMenShirt] = useState([])
    const [loadingMenShirt,setLoadingMenShirt] =useState(true)
    const [womenWear,setWomenWear] = useState([])
    const [loadingWomenWear,setLoadingWomenWear] = useState(true)
    const [footwear,setFootwear] = useState([])
    const [loadingFootwear,setLoadingFootwear] = useState(true)
    
    const [loadingShoes,setLoadingShoes] = useState(true)
    const [shoes,setShoes]=useState([])
    
    const [loadingWomenFootwear,setLoadingWomenFootwear] = useState(true)
    const [womenFootwear,setWomenFootwear] = useState([])
    
    const [loadingWatches,setLoadingWatches] = useState(true)
    const [watches,setWatches] = useState([])
    
    const [loadingBags,setLoadingBags] = useState(true)
    const [bags,setBags] = useState([])
    
    const [loadingGlasses,setLoadingGlasses] = useState(true)
    const [glasses,setGlasses] = useState([])
    
    useEffect(()=>{
    
       
        
         // Women
         getProductsByCategoryForHome({"categoryName": "Clothing", "from": null, "gender": "women", "specificCategory": null, "to": null}).then(d=>{
            setWomenWear(d)
            // setLoadingMenShirt(false)
            setLoadingWomenWear(false)
        }).catch(er=>console.log("Women error",er.message))
    
    
       // Mens shirt
       getProductsByCategoryForHome({"categoryName": "Clothing", "from": null, "gender": "men", "specificCategory": null, "to": null}).then(d=>{
        // console.log("Data",d)
        setMenShirt(d)
        setLoadingMenShirt(false)
        // setLoadingWomenWear(false)
    }).catch(er=>console.log("Mens shirt error",er))
    
        // Sneakers
        getProductsByCategoryForHome({"categoryName": "Footwear", "from": null, "gender": "men", "specificCategory": "Sneakers", "to": null}).then(d=>{
            setFootwear(d)
            setLoadingFootwear(false)
        }).catch(er=>console.log("Sneakers errir",er))
        
        
        // Shoes
        getProductsByCategoryForHome({"categoryName": "Footwear", "from": null, "gender": "men", "specificCategory": "Shoes & Boots", "to": null}).then(d=>{
          setShoes(d)
         setLoadingShoes(false)
      }).catch(er=>console.log("Shoes error",er))
    
    // Women footwear
        getProductsByCategoryForHome({"categoryName": "Footwear", "from": null, "gender": "women", "specificCategory": "Sneakers", "to": null}).then(d=>{
          setWomenFootwear(d)
         setLoadingWomenFootwear(false)
      }).catch(er=>console.log("Women footwear error",er))
      
      
      // Watches
        getProductsByCategoryForHome({"categoryName": "Watches", "from": null, "gender": "men", "specificCategory": null, "to": null}).then(d=>{
          setWatches(d)
           setLoadingWatches(false)
      }).catch(er=>console.log("Watches error",er))
      
      // Bags
        getProductsByCategoryForHome({"categoryName": "Bags", "from": null, "gender": "men", "specificCategory": null, "to": null}).then(d=>{
          setBags(d)
           setLoadingBags(false)
      }).catch(er=>console.log("Bags error",er))
      
      // Glasses
          getProductsByCategoryForHome({"categoryName": "Glasses", "from": null, "gender": "men", "specificCategory": null, "to": null}).then(d=>{
          setGlasses(d)
           setLoadingGlasses(false)
      }).catch(er=>console.log("Glasses error",er))
    },[])
    
    
    
    return (
    <View>
        
        <View style={{marginTop:10,flexDirection:"row",flexWrap:"wrap",width:"95%",marginHorizontal:"auto",columnGap:15}}>
            {
                    categories.map((item,index)=>{
                        return(
                            <Categories key={index} category_image={item.image} name={item.name} routeScreen={item.routeScreen} icon={item.icon} color={item.color}/>
                        )
                    })
            }
        </View>
        {/* Banner */}
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

       
        {/* Latest in mens */}
        <HomeProductsPreview params={{"categoryName": "Clothing", "from": null, "gender": "men", "specificCategory": null, "to": null}} title={"Latest in mens shirt"} loadingState={loadingMenShirt} data={menShirt}/>
        
        
         {/* Latest in ladies wear */}
        <HomeProductsPreview params={{"categoryName": "Clothing", "from": null, "gender": "women", "specificCategory": null, "to": null}} title={"Latest in ladies wear"} loadingState={loadingWomenWear} data={womenWear}/>
        
        
        {/* Banner */}
        <Image source={require("../assets/categories_images/sneakersBanner.png")} style={{width:"96%",margin:"auto"}} resizeMode='contain'/>
        
        {/* Sneakers */}
        <HomeProductsPreview params={{"categoryName": "Footwear", "from": null, "gender": "men", "specificCategory": "Sneakers", "to": null}} title={"Latest in sneakers"} loadingState={loadingFootwear} data={footwear}/>
        
        
        {/* Shoes */}
        <HomeProductsPreview params={{"categoryName": "Footwear", "from": null, "gender": "men", "specificCategory": "Shoes & Boots", "to": null}} title={"Latest in shoes"} loadingState={loadingShoes} data={shoes}/>
        
        {/* Women footwear */}
        <HomeProductsPreview params={{"categoryName": "Footwear", "from": null, "gender": "women", "specificCategory": "Sneakers", "to": null}} title={"Ladies footwear"} loadingState={loadingWomenFootwear} data={womenFootwear}/>
        
        
        {/* Accessories */}
        <Image source={require("../assets/categories_images/accessoriesBanner.png")} style={{width:"96%",margin:"auto"}} resizeMode='contain'/>
        
        {/* Watches */}
        <HomeProductsPreview params={{"categoryName": "Watches", "from": null, "gender": "men", "specificCategory": null, "to": null}} title={"Latest in watches"} loadingState={loadingWatches} data={watches}/>
        
        {/* Bags */}
        <HomeProductsPreview params={{"categoryName": "Bags", "from": null, "gender": "men", "specificCategory": null, "to": null}} title={"Latest in bags"} loadingState={loadingBags} data={bags}/>
        
        {/* Glasses */}
        <HomeProductsPreview params={{"categoryName": "Glasses", "from": null, "gender": "men", "specificCategory": null, "to": null}} title={"Latest in glasses"} loadingState={loadingGlasses} data={glasses}/>
        
        <View style={{flex:1,height:20}}></View>
        <NewArrivalsItems data={data} loadingProducts={loadingProducts} title={"New Arrivals"}/>
         <View style={{flex:1,height:100}}></View>

    </View>
    )
}
const headingStyle=StyleSheet.create({
    headingStyle:{
        fontFamily:"Mortend",
        fontSize:SIZES.headingSize,
        textAlign:"center"
    }
})
export default HomeTopComponent