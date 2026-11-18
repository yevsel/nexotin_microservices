import { View, Text,TouchableOpacity, Alert  } from 'react-native'
import React from 'react'
import styles from '../styles/SavedProductsStyle'
import AsyncStorage from '@react-native-async-storage/async-storage';


const emptyFavorites =()=>{
    AsyncStorage.setItem("favorites",JSON.stringify([])).then((data)=>{
        // console.log("SUCCESS",data)
    }).catch(error=>console.log("Error Emptying",error))
}

const SavedProductsHeaderComponent = ({setFavoritesItemsState,favoritesItemsState}) => {
    return (
        <View style={{backgroundColor:"white"}}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerContainerText}>Saved Items</Text>
            </View>
            {favoritesItemsState.length>0?
            <View style={styles.headerResetButtonContainer}>
                <TouchableOpacity onPress={()=>{
                    Alert.alert('Clearing saved products', 'Are you sure you want to delete everything.', [
                        {text: 'Yes', style:"destructive",onPress: () => {
                            emptyFavorites()
                            setFavoritesItemsState([])
                        }},
                        {text: 'No', style:"cancel",onPress: () => {
                            
                        }},
                    ]);
                    
                }} style={styles.headerResetButton}>
                    <Text style={styles.headerResetButtonText}>CLEAR ALL</Text>
                </TouchableOpacity>
            </View>:null
            }
        </View>
    )
}

export default SavedProductsHeaderComponent