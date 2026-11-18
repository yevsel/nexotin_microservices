import { View, Text,TouchableOpacity,TextInput,Alert } from 'react-native'
import { useState,useRef,useEffect } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { categories } from '../data/categoriesData'
import { Image } from 'expo-image'
import { removeCategoriesData } from '../Actions'
import { useDispatch } from 'react-redux'
import { COLORS } from '../constants/theme'
const CategoriesFilteringSystem = ({setNoData,setShowPriceFilterTag,showPriceFilterTag,setCategoriesProductsData,setDataToSend}) => {


    const fromRef = useRef()
    const toRef = useRef()
    const [from,setFrom] = useState(null)
    const [to,setTo] = useState(null)
    const [showFilter,setShowFilter] = useState(false)
    const [triggerPrice,setTriggerPrice] = useState(true)
    
    const dispatch = useDispatch()
    
    const enableApplyPriceFilter = from && to 
    
    const [gender,setGender] = useState("men")
    
    const {categoryName,specificCategory} = useLocalSearchParams()

    // const [selectedSpecificCategory,setSelectedSpecificCategory] = useState(categories.find(item=>item.name===categoryName)[gender][0].name)
    
    const [selectedSpecificCategory,setSelectedSpecificCategory] = useState(null)
    
    const getSpecificCategoryData = (gender)=>{
        const specificCategory = categories.find(item=>item.name===categoryName)
        return specificCategory[gender]
    }
    
    

    useEffect(()=>{

        setDataToSend({
            categoryName,
            specificCategory:selectedSpecificCategory,
            gender,
            from,
            to
        })
        
        
    },[gender,triggerPrice,selectedSpecificCategory])
    
    // console.log("CAT",categories)
    
    
    return(
        <>  
            {/* Get the Specific ones */}
            <View style={{marginTop:10,flexDirection:"row",flexWrap:"wrap",width:"95%",marginHorizontal:"auto",columnGap:15}}>
    
                {
                    getSpecificCategoryData(gender).map((item,index)=>{
                        return(
                            // <>
                                <TouchableOpacity key={index} onPress={()=>{
                                            
                                            
                                            // dispatch(removeCategoriesData())
                                            setNoData(false)
                                            setCategoriesProductsData([])
                                            setSelectedSpecificCategory(item.name)
                                        }}  style={{width:60,minHeight:95}}>
                                            {/* {item.name===selectedSpecificCategory} */}
                                            <View >
                                                <Image 
                                                  style={[
                                                    { width: 60, height: 60 },
                                                    item.name === selectedSpecificCategory
                                                      ? { borderWidth: 3, borderColor: COLORS.newBlack,borderRadius:8 }
                                                      : {}
                                                  ]}
                                                  
                                                  source={item.image}
                                                //   placeholder={ blurhash } 
                                                  transition={500}
                                                  contentFit="contain"
                                                  />
                                            </View>
                                          <Text style={{lineHeight:12,textAlign:"center",fontFamily:"Poppins",fontSize:10,marginTop:3}}>{item.name}</Text>
                                    </TouchableOpacity>
                            // </>
                        )
                    })
                }
            
            </View>
            
            
            <View style={{flexDirection:"row",width:"90%",alignItems:"center",marginLeft:10,marginTop:10}}>
                <TouchableOpacity onPress={()=>{
                    setCategoriesProductsData([])
                    setGender("men")
                    setNoData(false)
                }} style={gender==="men"?{paddingHorizontal:20,borderWidth:2,borderColor:COLORS.newBlue,borderRadius:20,marginRight:20}:{paddingHorizontal:20,borderWidth:2,borderColor:"#ccc",borderRadius:20,marginRight:20}}>
                    <Text style={{
                          fontFamily: "Poppins",
                          fontSize: 18,
                          color: gender === "men" ? COLORS.newBlue : "#ccc"
                        }}>Men</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    setCategoriesProductsData([])
                    setGender("women")
                    setNoData(false)
                }} style={gender==="women"?{paddingHorizontal:20,borderWidth:2,borderColor:COLORS.newBlue,borderRadius:20,marginRight:20}:{paddingHorizontal:20,borderWidth:2,borderColor:"#ccc",borderRadius:20,marginRight:20}}>
                    <Text style={{
                          fontFamily: "Poppins",
                          fontSize: 18,
                          color: gender === "women" ? COLORS.newBlue : "#ccc"
                        }}>Women</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setShowFilter(!showFilter)} style={showPriceFilterTag===true?{paddingHorizontal:20,borderWidth:2,borderColor:COLORS.newBlue,borderRadius:20,marginRight:20}:{paddingHorizontal:20,borderWidth:2,borderColor:"#ccc",borderRadius:20,marginRight:20}}>
                    <Text style={{
                          fontFamily: "Poppins",
                          fontSize: 18,
                          color: showPriceFilterTag === true ? COLORS.newBlue : "#ccc"
                        }}>Price</Text>
                </TouchableOpacity>
            </View>
            
            
            {showPriceFilterTag&&<View style={{backgroundColor:COLORS.accent1,width:"40%",marginLeft:"auto",borderRadius:5,marginRight:20,marginTop:10}}>
                    <Text style={{textAlign:"center",padding:5,color:"gray",fontFamily:"Poppins"}}>₵ {Number(fromRef?.current).toFixed(2)} - ₵ {Number(toRef?.current).toFixed(2)}</Text>
                </View>}
                
            {/* Price filtering */}
            <View style={{width:"95%",margin:"auto"}}>
                {showFilter&&
                <View style={{marginVertical:15,width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingVertical:20,borderWidth:1,borderColor:"#ccc",paddingHorizontal:10,marginRight:10,borderRadius:10}}>
                        <Text style={{fontFamily:"Poppins",color:"gray"}}>FROM</Text>
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{fontFamily:"Mortend",color:"gray",marginHorizontal:10}}>₵</Text>
                            <TextInput onChangeText={(e)=>setFrom(e)} style={{fontFamily:"Mortend",fontSize:18,paddingHorizontal:10,flex:1,color:COLORS.secondary}}  autoFocus inputMode='tel' keyboardType='numeric' />
                        </View>
                    </View>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingVertical:20,borderWidth:1,borderColor:"#ccc",paddingHorizontal:10,marginLeft:10,borderRadius:10}}>
                        <Text style={{fontFamily:"Poppins",color:"gray"}}>TO</Text>
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{fontFamily:"Mortend",color:"gray",marginHorizontal:10}}>₵</Text>
                            <TextInput onChangeText={(e)=>setTo(e)} style={{fontFamily:"Mortend",fontSize:18,paddingHorizontal:10,flex:1,color:COLORS.secondary}} inputMode='tel' keyboardType='numeric'/>
                        </View>
                    </View>
                </View>}
            </View>
            
            
             {/* Apply filtering */}
             <View style={{width:"95%",margin:"auto"}}>
                {showFilter&&<View style={{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                    <TouchableOpacity onLongPress={()=>{
                        setCategoriesProductsData([])
                        setShowFilter(false)
                        setShowPriceFilterTag(false)
                        setTriggerPrice(!triggerPrice)
                        // dispatch(removeCategoriesData())
                    }} onPress={()=>setShowFilter(false)} style={{flex:1,paddingVertical:15,marginRight:10,borderRadius:50,borderWidth:1,borderColor:"#F65C1F"}}>
                        <Text style={{textAlign:"center",fontFamily:"Poppins",color:"#F65C1F",}}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!enableApplyPriceFilter} onPress={()=>{
                        if(Number(from)>Number(to) || from===to){
                            Alert.alert('Price filtering', '"FROM" should be less than "TO"', [
                                {text: 'OK', onPress: () => {}},
                            ])
                            // setShowPriceFilterTag()
                        }else{
                            // console.log(from,to)
                            setCategoriesProductsData([])
                            fromRef.current=from
                            toRef.current=to
                            setTriggerPrice(!triggerPrice)
                            setShowFilter(false)
                            setShowPriceFilterTag(true)
                            setNoData(true)
                            // dispatch(removeCategoriesData())
                        }
                    }} style={{flex:1,paddingVertical:15,marginLeft:10,borderRadius:50,backgroundColor:"#F65C1F"}}>
                        <Text style={{textAlign:"center",color:"white",fontFamily:"Poppins"}}>Apply</Text>
                    </TouchableOpacity>
                </View>}
             </View>
        </>
    )
}


export default CategoriesFilteringSystem