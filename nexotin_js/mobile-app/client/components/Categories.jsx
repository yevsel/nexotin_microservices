import { View, Text,FlatList, TouchableOpacity,StyleSheet } from 'react-native'
import { Image } from 'expo-image';
import React from 'react'
import { styles } from '../styles/HomeStyle';
import { router } from 'expo-router';
const Categories = ({name,icon,routeScreen,color,category_image}) => {

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  // const navigation = useNavigation()


  return (
    <TouchableOpacity onPress={()=>{
          // console.log("route",routeScreen)
          if(routeScreen){
            router.push({
              pathname:`/specificProductCategoryScreen`,
              // pathname:`/(tabs)/Home/${routeScreen==="CategoriesScreen"?"categories":"specificCategoryScreen"}`,
              params:{categoryName:name}
            })
          }
        }}  style={{width:60,height:95}}>
            <Image 
              style={{width:60,height:60}}
              source={category_image}
              placeholder={ blurhash } 
              transition={500}
              contentFit="contain"
              />
              <Text style={{textAlign:"center",fontFamily:"Poppins",fontSize:10,marginTop:3}}>{name}</Text>
    </TouchableOpacity>
  )
}
 

export default Categories