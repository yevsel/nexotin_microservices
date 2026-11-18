import { View, Text } from 'react-native'
import React from 'react'
// import MasonryList from '@react-native-seoul/masonry-list';
import EachHomeItem from "./EachHomeItem"; 
import {styles} from "../styles/HomeStyle"
import { MasonryFlashList } from "@shopify/flash-list";

const Items = ({data,title}) => {
  return (
    <View style={styles.itemContainer}>
        <View>
            <Text style={styles.itemContainerHeading}>{title}</Text>
        </View>
        <MasonryFlashList
          data={data.slice(4,)}
          numColumns={2}
          renderItem={({item}) => <EachHomeItem key={item._id}  data={item}/>}
        //   columnWrapperStyle={{ justifyContent: "space-around" }}
        //     contentContainerStyle={{ paddingBottom: 200 }}
        //     showsVerticalScrollIndicator={false} 
          estimatedItemSize={200}
        />
        {/* <MasonryList
            
            data={data.slice(4,)}
            keyExtractor={(item) =>  item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: "space-around" }}
            contentContainerStyle={{ paddingBottom: 200 }}
            showsVerticalScrollIndicator={false} 
            renderItem={({item}) => <EachHomeItem key={item._id}  data={item}/>}
            /> */}
    </View>
    )
}

export default Items