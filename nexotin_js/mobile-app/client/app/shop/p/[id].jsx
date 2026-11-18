import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import ViewProductMainScreen from '../../../screens/ViewProductMainScreen'
import { ParentContext } from '../../../context/ParentContext'

const productDetails = () => {
    
    const {setLoggedIn, setShowBottomNavigation}= useContext(ParentContext)

  return (
    <>
        <ViewProductMainScreen setLoggedIn={setLoggedIn} setShowBottomNavigation={setShowBottomNavigation}/>
    </>
  )
}

export default productDetails