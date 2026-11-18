import { View, Text, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import styles from '../styles/CategoriesStyle'
import { COLORS } from '../constants/theme'
import Collapsible from 'react-native-collapsible';
import { router } from 'expo-router'
const SubCategory = ({gender,data,isCollapsed}) => {

    // const navigation = useNavigation()
    
    
    if(data[gender].length!==0){
        return (
            <Collapsible collapsed={isCollapsed} style={styles.subCategoryContainer}>
            <TouchableOpacity style={{backgroundColor:COLORS.accent4,height:30,marginTop:-30,zIndex:-2}}></TouchableOpacity>
                {data[gender].map((item,index)=>{
                    return(
                        <TouchableOpacity onPress={()=>{
                                router.push({
                                    pathname:"/(tabs)/Home/specificCategoryScreen",
                                    params:{categoryName:data.name,specificCategory:data[gender][index]}
                                })
                            // console.log("data",data)
                            // navigation.navigate("SpecificCategoryScreen",{categoryName:data.name,specificCategory:data[gender][index]})
                            // console.log(gender,data.name,data[gender][index])
                        }} key={index} style={styles.eachSubCategoryTextContainer}>
                            <Text style={styles.eachSubCategoryText}>{item}</Text>
                        </TouchableOpacity>
                    )
                })}
            </Collapsible>
        )
    
    }
}

export default SubCategory