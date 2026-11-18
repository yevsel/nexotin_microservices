import { View,FlatList } from 'react-native'
import React from 'react'

const FlashSales = ({data}) => {
  return (
    <View>
      <FlatList 
            horizontal={true}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({item})=><EachFlashSaleItem name={item.name} image={item.image} price={item.price} discount={item.discount}/>}
        />
    </View>
  )
}

export default FlashSales