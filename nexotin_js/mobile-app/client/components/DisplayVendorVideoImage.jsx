import { View, Text,Image } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'

const DisplayVendorVideoImage = ({profile}) => {
  // console.log(Object.keys(profile))

  return (
  <>
  {
    profile&&
    <View>
      {
        profile.profileImage?
        <Image style={{width:50,height:50,borderRadius:50}} source={{uri:profile.profileImage.secure_url}}/>
        :
        <Image style={{width:50,height:50,borderRadius:50}} source={{uri:"https://cdn-icons-png.flaticon.com/512/149/149071.png"}}/>
      }
    </View>
  }
  </>
  )
}

export default DisplayVendorVideoImage