import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import ProfileMainScreen from '../../../screens/ProfileMainScreen'
import { ParentContext } from '../../../context/ParentContext'

const ProfileScreen = () => {
  
  const {refreshProfile} = useContext(ParentContext)

  return (
    <>
      <ProfileMainScreen refreshProfile={refreshProfile}/>
    </>
  )
}

export default ProfileScreen