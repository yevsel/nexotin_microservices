import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ProfileScreenLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="myOrdersMainScreen"/>
        <Stack.Screen name="viewOrderDetailsScreen"/>
        <Stack.Screen name="editUserProfileImageScreen"/>
        <Stack.Screen name="faqMainScreen"/>
        <Stack.Screen name="profileSettingsScreen"/>
        <Stack.Screen name="supportMainScreen"/>
        <Stack.Screen name="savedProductsScreen"/>
        <Stack.Screen name="termsAndPoliciesScreen"/>
        <Stack.Screen name="userProfileSettings"/>
    </Stack>
  )
}

export default ProfileScreenLayout