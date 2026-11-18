import { View, Text,ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'
import { router } from 'expo-router'

const ProductDescription = ({scrollTo,productData,vendorInfo}) => {

  const {width,height} = Dimensions.get("screen")
  
  // const navigation = useNavigation()
  
  // console.log("PRODUCT DATA",productData)

  return (
    <View style={{height:height*0.6,width:"100%",alignSelf:"center"}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{height:height*0.55,width:"90%",alignSelf:"center"}}>
            <Text style={{fontFamily:"Poppins"}}>{productData.productDescription.trim()}</Text>
            
            <View style={{flexDirection:"row",marginTop:20,justifyContent:"space-between",width:180}}>
                <Text style={{fontFamily:"Poppins",color:"gray"}}>Category:  </Text>
                <View style={{padding:3,paddingHorizontal:8,borderRadius:3,fontFamily:"Poppins",backgroundColor:"gray"}}>
                  <Text style={{fontSize:10,color:"white"}}>{productData.subCategory}</Text>
                </View>
            </View>
            <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between",width:180}}>
                <Text style={{fontFamily:"Poppins",color:"gray"}}>Brand:  </Text>
                <View style={{padding:3,paddingHorizontal:8,borderRadius:3,fontFamily:"Poppins",backgroundColor:"gray"}}>
                  <Text style={{fontSize:10,color:"white"}}>{productData?.brand.trim()}</Text>
                </View>
            </View>
            <View style={{flexDirection:"row",marginTop:10,justifyContent:"space-between",width:180}}>
                <Text style={{fontFamily:"Poppins",color:"gray"}}>Quantity:  </Text>
                <View style={{padding:3,paddingHorizontal:8,borderRadius:3,fontFamily:"Poppins",backgroundColor:"gray"}}>
                  <Text style={{fontSize:10,color:"white"}}>{productData?.productQuantity}</Text>
                </View>
            </View>
            
            {/* {vendorInfo&&<View style={{width:150,marginTop:20,paddingBottom:50}}>
                    <TouchableOpacity onPress={()=>{
                      // console.log("VENDOR INFO",Object.keys(vendorInfo[0]))
                      // console.log()
                      const obj = {
                        vendorId:productData.accountOwnerID,
                        accountType:productData.accountType,
                        vendorEmail:vendorInfo[0].accountType==="individual"?vendorInfo[0].email:vendorInfo[0].businessEmail
                      }
                      // console.log("INFO TO SEND",obj)
                      router.push({
                        pathname:"/vendorProfile",
                        params:obj
                      })
                      
                      // navigation.navigate("VendorProfileScreenForHomeStack",{vendorId:productData.accountOwnerID,accountType:productData.accountType,vendorEmail:vendorInfo[0].accountType==="individual"?vendorInfo[0].email:vendorInfo[0].businessEmail})
                    }} style={{padding:8,paddingHorizontal:8,borderRadius:3,fontFamily:"Poppins",backgroundColor:COLORS.newBlue}}>
                      <Text style={{fontSize:15,color:"white",textAlign:"center"}}>Visit vendor page</Text>
                    </TouchableOpacity>
            </View>} */}
            
        </ScrollView>
    </View>
  )
}

export default ProductDescription