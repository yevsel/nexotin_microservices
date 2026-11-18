import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import GoBack from '../../../components/GoBack'
import ReportButton from '../../../components/ReportButton'
import GoBackp from '../../../components/GoBackp'
import GoBackMessages from '../../../components/GoBackMessages'

const MessageScreenLayout = () => {
  return (
    <Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="messageScreen" options={{
                  headerShown:false,
                  headerBackTitleVisible: false,
                  headerTitle:"",
                  headerTransparent:true,
                  // headerLeft:()=>(<GoBack/>),
                  // headerRight: () => <ReportButton />
                }}/>
    </Stack>
  )
}

export default MessageScreenLayout