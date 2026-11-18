import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import ProfileSettings from '../../../screens/ProfileSettings'
import { ParentContext } from '../../../context/ParentContext'

const profileSettingsScreen = () => {

  const {setLoggedIn} = useContext(ParentContext)

  return (
    <>
      <ProfileSettings setLoggedIn={setLoggedIn}/>
    </>
  )
}

export default profileSettingsScreen