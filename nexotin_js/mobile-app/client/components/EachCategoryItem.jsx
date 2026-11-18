import { View, Text, TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import styles from '../styles/CategoriesStyle'
import { Feather } from '@expo/vector-icons';
import SubCategory from './SubCategory';
import { Entypo } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';

const EachCategoryItem = ({gender,data}) => {
    const [isCollapsed,setIsCollapsed] = useState(true)

    if(data.name!=="All"){
        return (
            <TouchableOpacity onPress={()=>setIsCollapsed(!isCollapsed)}>
                <View style={[styles.eachCategoryItem,{borderTopLeftRadius:40,borderTopRightRadius:40,borderBottomLeftRadius:isCollapsed?40:0,borderBottomRightRadius:isCollapsed?40:0}]}>
                    <View>
                        {data.icon}
                    </View>
                    <View style={styles.eachCategoryItemTextContainer}>
                        <Text style={styles.eachCategoryItemTextContainerText}>{data.name}</Text>
                    </View>
                    <View style={{marginTop:5}}>
                    {isCollapsed?
                    <Feather name="plus" size={20} color="black" />:<Feather name="minus" size={24} color="black" />
                    }
                    {/* <Entypo name="chevron-right" size={24} color="#333" /> */}
                        {/* <Feather name="chevron-right" size={24} color="gray" /> */}
                    </View>
                </View>
                
                {gender ==="men"? <SubCategory isCollapsed={isCollapsed} gender={"men"} data={data}/>:<SubCategory isCollapsed={isCollapsed} gender={"women"} data={data}/>}
            </TouchableOpacity>
        )
    }
}

export default EachCategoryItem