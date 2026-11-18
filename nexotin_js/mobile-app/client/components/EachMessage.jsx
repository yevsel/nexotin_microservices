import { View, Text, TouchableOpacity,Image } from 'react-native'
import React, { useContext } from 'react'
import moment from "moment"
import { router } from 'expo-router'
import { ParentContext } from '../context/ParentContext'
export default function EachMessage({image,name,time,message,email}) {

    // const navigation = useNavigation()
    
    const {setReceiverEmail,setMessageParameters} = useContext(ParentContext)

  return (
    <TouchableOpacity onPress={()=>{
      setReceiverEmail(email)
      setMessageParameters()
      router.push({
        pathname:"/(tabs)/Messages/messageScreen",
        params:{image,name,time,message,email}
      })
      }
      
      } style={{width:"100%",borderTopWidth:1,borderTopColor:"#ededed",height:80,padding:10}}>
        <View style={{flexDirection:"row",gap:10}}>
            <Image source={{uri:image}} resizeMode='cover' style={{width:60,height:60,backgroundColor:"gray",borderRadius:100}}></Image>
            <View style={{flex:1,justifyContent:"space-between"}}>
                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                    <Text style={{fontFamily:"Mortend",fontSize:17}}>{name}</Text>
                    <Text style={{color:"gray",fontSize:10,fontFamily:"Poppins"}}>{moment(time).fromNow()}</Text>
                </View>
                <Text numberOfLines={2} style={{marginTop:10,fontSize:15,color:"gray",flex:1,fontFamily:"Poppins"}}>{message}</Text>
            </View>
        </View>
      <Text></Text>
    </TouchableOpacity>
  )
}