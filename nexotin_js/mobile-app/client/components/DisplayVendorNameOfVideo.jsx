import { View, Text } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/theme'
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
const DisplayVendorNameOfVideo = ({video,profile}) => {
  // console.log("PROFILE",Object.keys(profile))
  return (
  <>
  {
    profile&&
      <View>
        <View style={{flexDirection:"row",alignItems:"center"}}>
          <Text numberOfLines={1} style={{color:"white",fontFamily:"PoppinsBold"}}>{profile.accountType==="individual"?profile.firstName+" "+profile.lastName:profile.shopName}</Text>
          <View>
            {profile?.accountType==="individual"?<Ionicons name="person-outline" size={15} style={{marginLeft:5}} color={COLORS.primary} />:<MaterialIcons name="storefront" style={{marginLeft:5}} size={15} color={COLORS.primary} />}
          </View>
        </View>
        <Text numberOfLines={3}  style={{color:"white"}}>{video.title}</Text>
      </View>
  }
  </>
  )
}

export default DisplayVendorNameOfVideo