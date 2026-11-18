import { View, Text } from 'react-native'
import React, { useContext, useEffect,useState } from 'react'
import { Tabs } from 'expo-router'
import { Octicons,Feather,MaterialCommunityIcons } from '@expo/vector-icons'
import { COLORS } from '../../constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabaseClient } from '../../utils/supabase-client'
import { ParentContext, ParentContextProvider } from '../../context/ParentContext'

const TabsLayout = () => {

  // const {messagesCount} = useContext(ParentContext)
  
  const {dialogue} = useContext(ParentContext)
    
    const [messagesCount,setMessagesCount] = useState(0)
    const countMessages = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("userAccountObject");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          
          const { data, error, count } = await supabaseClient
            .from("chat_table").select("sender_email",{count:"exact"})
            .eq("sender_email", userData.email);
            
          if (error) {
            console.error("Supabase query error:", error);
            return;
          }
    
          // console.log("Messages count:", count);
          setMessagesCount(count)
          // console.log("MESSAGES DATA",data)
          // Handle `data` or `count` as needed
        } else {
          console.log("No user data found in AsyncStorage.");
        }
      } catch (err) {
        console.error("Error in countMessages:", err);
      }
    };
    
    
    useEffect(()=>{
      countMessages()
    },[dialogue])
  
  return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.redOrange,
                tabBarInactiveTintColor: "#A0A0A0",
                tabBarStyle: {
                        backgroundColor: "white",                 
                },
                tabBarHideOnKeyboard: true,
                
            }}>
            <Tabs.Screen 
                name="Home"
                options={{
                    title:"HOME",
                    tabBarStyle:{
                        backgroundColor:"white",
                    },
                    tabBarIcon: ({ focused, color, size }) => (
                        <Octicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen 
                name="Videos"
                options={{
                    title:"VIDEOS",
                    tabBarIcon: ({ focused, color, size }) => (
                      <Octicons name="device-camera-video" size={25} color={color} />
                    ),
                  }}
            />
            <Tabs.Screen 
                name="Messages"
                options={{
                    title:"MESSAGES",
                    tabBarBadge:messagesCount===null?0:messagesCount,
                    tabBarIcon: ({ focused, color, size }) => (
                      <Feather name="mail" size={24} color={color} />
                    ),
                  }}
            />
            <Tabs.Screen 
                name="Profile"
                options={{
                    title:"PROFILE",
                    // tabBarShowLabel: true,
                    tabBarIcon: ({ focused, color, size }) => (
                    //   <MaterialIcons name="account-circle" size={27} color={color} />
                      <MaterialCommunityIcons name="account-circle-outline" size={27} color={color} />
                    ),
                  }}
            />
        </Tabs>
  )
}

export default TabsLayout