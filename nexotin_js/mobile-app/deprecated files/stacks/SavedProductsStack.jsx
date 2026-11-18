import { View, Text } from 'react-native'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React,{useEffect} from 'react'
import SavedProducts from '../../client/screens/SavedProductsScreen'


const Stack = createNativeStackNavigator()

const SavedProductsStack = () => {


    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            {/* <Stack.Screen name="Saved" component={SavedProducts}/> */}
        </Stack.Navigator>
    )
}

export default SavedProductsStack