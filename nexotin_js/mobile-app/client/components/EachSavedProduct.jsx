import { View, Text,Image,TouchableOpacity,ScrollView } from 'react-native'
import React from 'react'
import styles from "../styles/SavedProductsStyle"
import { COLORS } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
const EachSavedProduct = ({setFavoritesItemsState,data}) => {
    
    // console.log("DATA",Object.keys(data))

    // const navigation = useNavigation()

    const removeFromSavedItem = async(itemToRemove)=>{
        try {
            const data = JSON.parse(await AsyncStorage.getItem("favorites"))
            let dataToRemove={}
            data.forEach((item)=>{
                if(item.id ===itemToRemove.id){
                    dataToRemove=item
                    return
                }
            })
            const newData = data.filter(item=>item.id!==dataToRemove.id)
            setFavoritesItemsState(newData)
            await AsyncStorage.setItem("favorites",JSON.stringify(newData))
        } catch (error) {
            console.log("Error",error.message)
        }
    }
    
    return (
        <TouchableOpacity onPress={()=>{
            // console.log(Object.keys(data))
            // navigation.navigate("HOME",{screen:"ViewProductMainScreen",params:{id:data.id}})
            // router.push({
            //     pathname:"/productDetails",
            //     params:{id:data.id}
            // })
            // console.log("DD",data._id)
            router.push(`/shop/p/${data.id}`)
        }} style={styles.eachSavedItemContainer}>
            <View>
                <Image source={{uri:data.image.secure_url}} style={{maxWidth:190,height:data.height,borderRadius:15,marginBottom:5}}/>
                {data?.selectedSizes?.length>0&&
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {/* <Text style={{fontSize:8,padding:2,marginVertical:3}}>Sizes</Text> */}
                        {data.selectedSizes.slice(0,7).map((size,index)=>{
                            return (
                                <View key={index} style={{padding:2,borderWidth:1,borderColor:"#C0C0C0",borderRadius:3,marginRight:5,marginVertical:3}}>
                                    <Text style={{fontSize:7,color:"gray"}}>{size}</Text>
                                </View>
                            )
                        })}
                    </ScrollView>
                }
                <Text style={styles.eachSavedProductName}>{data.name}</Text>
                <Text style={styles.eachSavedProductPrice}>₵ {(data.price).toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={()=>removeFromSavedItem(data)} style={styles.eachSavedItemFavoriteButton}>
                <MaterialIcons name="cancel" size={30} color={COLORS.primary} />
                {/* <FontAwesome name="bookmark" size={28} color={COLORS.primary} /> */}
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

export default EachSavedProduct