// import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React,{useEffect} from 'react'
import AllMessagesScreen from '../../client/screens/AllMessagesScreen'
import { View,Text,TouchableOpacity } from 'react-native'
import MessageScreen from '../../client/screens/MessageScreen'
import Ionicons from '@expo/vector-icons/Ionicons';
const Stack = createNativeStackNavigator()


export const MessagesStack = ({loggedIn,setLoggedIn})=>{
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='AllMessagesScreen' children={()=><AllMessagesScreen setLoggedIn={setLoggedIn} loggedIn={loggedIn} />}/>
            <Stack.Screen name='MessageScreen' children={()=><MessageScreen/>} />
        </Stack.Navigator>
    )
}
