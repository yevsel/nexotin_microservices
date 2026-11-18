import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import EditUserProfileImageScreen from '../../../screens/EditUserProfileImageScreen'
import { ParentContext } from '../../../context/ParentContext'

const editUserProfileImageScreen = () => {

    const {setRefreshProfile,refreshProfile} = useContext(ParentContext)

  return (
    <>
        <EditUserProfileImageScreen setRefreshProfile={setRefreshProfile} refreshProfile={refreshProfile}/>
    </>
  )
}

export default editUserProfileImageScreen