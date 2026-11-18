import { View, Text,Image } from 'react-native'
import React from 'react'
import { styles } from '../styles/HomeStyle'
import { FontAwesome } from '@expo/vector-icons';

const EachFlashSaleItem = ({name,image,price,discount}) => {
    const newPrice = (oldPrice,discount)=>{
        let discountPercentage = discount/100
        return oldPrice-(discountPercentage*oldPrice)
    }

    return (
        <View style={styles.eachFlashSaleContainer}>
            <View style={styles.eachFlashSaleImageContainer}>
                <Image source={image} resizeMode='cover' style={{width:150,height:200}}/>
                <View style={styles.eachFlashSaleBoltIcon}>
                    <FontAwesome name="bolt" size={18} color="black" />
                    <Text style={styles.eachFlashSaleBoltIconText}>-{discount}%</Text>
                </View>
            </View>
            <Text style={styles.eachFlashSaleNewPrice}>GH₵ {(newPrice(price,discount)).toFixed(2)}</Text>
            <Text style={styles.eachFlashSaleOldPrice}>GH₵ {(price).toFixed(2)}</Text>
        </View>
    )
}

export default EachFlashSaleItem