import React, { useEffect,useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
export default function useUserAccountObject() {
    const [userData,setUserData] = useState()
    
    useEffect(()=>{
        AsyncStorage.getItem("userAccountObject").then(userData=>{
            setUserData(JSON.parse(userData))
        })
    },[])

  return {
    user:userData
  }
}
