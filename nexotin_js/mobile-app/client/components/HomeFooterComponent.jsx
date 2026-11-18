import { View, Text,ScrollView } from 'react-native'
import React from 'react'
import { flashSalesData } from "../data/flashSalesData";
import EachFlashSaleItem from "./EachFlashSaleItem";
import Items from "./Items";
import { newArrivals } from "../data/newArrivals";
import { useSelector } from 'react-redux';
const HomeFooterComponent = ({data}) => {

    const products = useSelector(state=>state.productsReducer)

    return (
        <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {flashSalesData().map((item,index)=>{
                        return <EachFlashSaleItem key={index} name={item.name} discount={item.discount} price={item.price} image={item.image}/>
                    })}
                </ScrollView>
            {/* Main Items */}
            <Items data={data} title={"Thrift Items"}/>
        </View>
    )
}

export default HomeFooterComponent