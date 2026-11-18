import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const OnboardingLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
      <Stack.Screen name='index' />
      <Stack.Screen name='signUpScreen' />
      <Stack.Screen name="forgotPasswordScreen" />
    </Stack>
  )
}

export default OnboardingLayout