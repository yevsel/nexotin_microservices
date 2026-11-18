import { View, Text } from 'react-native'
import React from 'react'
import SearchedVendorComponent from './SearchedVendorComponent'
import { MasonryFlashList } from '@shopify/flash-list'
import EachHomeItem from './EachHomeItem'

const SearchProductsOrVendorsComponent = ({productsOrVendors,searchResponse}) => {

    const renderItem = ({ item }) => <EachHomeItem key={item._id} data={item} />

  return (
    <View style={{ width: "100%", alignSelf: "center" }}>
      {
                        productsOrVendors === "products" ? (
                            <MasonryFlashList
                                data={searchResponse}
                                numColumns={2}
                                renderItem={renderItem}
                                estimatedItemSize={2000}
                                // onEndReached={()=>{
                                //     console.log("You have reached the end")
                                // }}
                                // onEndReachedThreshold={0.05}
                            />
                        ) : (
                            searchResponse.map((item, index) => {
                                return <SearchedVendorComponent key={index} item={item} />;
                            })
                        )
                    }
    </View>
  )
}

export default SearchProductsOrVendorsComponent