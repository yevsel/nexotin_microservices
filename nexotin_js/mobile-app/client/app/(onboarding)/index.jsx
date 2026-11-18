import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import SignInScreen from '../../screens/SignInScreen'
import { ParentContext } from '../../context/ParentContext'

const LoginPage = () => {

  const {setLoggedIn} = useContext(ParentContext)

  return (
    <>
      <SignInScreen setLoggedIn={setLoggedIn}/>
    </>
  )
}

export default LoginPage