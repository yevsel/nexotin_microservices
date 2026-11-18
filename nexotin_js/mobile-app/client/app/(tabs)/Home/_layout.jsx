import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { HomeTabContextProvider } from '../../../context/HomeTab/HomeTabContext'

const HomeScreenLayout = () => {
  return (
    <HomeTabContextProvider>
      <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="index"/>
            <Stack.Screen name="search"/>
            <Stack.Screen name="basket"/>
            <Stack.Screen name="categories"/>
            <Stack.Screen name="specificCategoryScreen"/>
            <Stack.Screen name="finalOrderPaymentScreen"/>
            {/* <Stack.Screen name="productDetails"/> */}
        </Stack>
     </HomeTabContextProvider>
  )
}

export default HomeScreenLayout