import { View, Text,ScrollView,TouchableOpacity,Image,Dimensions } from 'react-native'
import React,{useState,useEffect} from 'react'
// import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import emptyProfile from "../assets/emptyProfile.png"
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker"
// import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
const ViewUserProfile = () => {

    // const navigation = useNavigation()
    const [userAccountObject,setUserAccountObject] = useState({})
    const {image} = useLocalSearchParams()
    
    // useEffect(()=>{
    //     setShowBottomNavigation(false)
    // },[])
    useEffect(()=>{
        AsyncStorage.getItem("userAccountObject").then(data=>{
            setUserAccountObject(JSON.parse(data))
            // console.log(Object.keys(userAccountObject))
        }).catch(err=>console.log(err.message))
        
    },[])
    
    if(!userAccountObject){
        <View>
        
        </View>
    }
    
    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            <ScrollView style={{width:"90%"}} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}}>
                <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                    <TouchableOpacity onPress={()=>{
                        router.back()
                        // navigation.goBack()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>User Profile</Text>
                </View>
                {/* Body */}
                
                {/* Image picker */}
                <View style={{paddingTop:30}}>
                    <View style={{justifyContent:"center",alignItems:"center",position:"relative"}}>
                    <Image source={{uri:image}} resizeMode="cover" style={{width:100,height:100,borderRadius:100}}/>
                        <TouchableOpacity onPress={()=>{
                            router.push("/(tabs)/Profile/editUserProfileImageScreen")
                            // navigation.navigate("EditUserProfileImageScreen")
                        }} style={{width:40,height:40,right:120,bottom:0,backgroundColor:COLORS.redOrange,borderRadius:50,alignItems:"center",justifyContent:"center",position:"absolute"}}>
                            <AntDesign name="edit" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    
                    {/* Edit Profile */}
                    
                    <View style={{marginVertical:50}}>
                        <View style={{marginBottom:10}}>
                            <Text style={{color:"gray",fontFamily:"Poppins",fontSize:17}}>First name</Text>
                            <Text style={{color:COLORS.secondary,fontFamily:"Poppins",fontSize:18}}>{userAccountObject.firstName}</Text>
                        </View>
                        <View style={{marginBottom:10}}>
                            <Text style={{color:"gray",fontFamily:"Poppins",fontSize:17}}>Last name</Text>
                            <Text style={{color:COLORS.secondary,fontFamily:"Poppins",fontSize:18}}>{userAccountObject.lastName}</Text>
                        </View>
                        {/* <View style={{marginBottom:10}}>
                            <Text style={{color:"gray",fontFamily:"Poppins",fontSize:17}}>Username</Text>
                            <Text style={{color:COLORS.secondary,fontFamily:"Poppins",fontSize:18}}>@{userAccountObject.username}</Text>
                        </View> */}
                        <View style={{marginBottom:10}}>
                            <Text style={{color:"gray",fontFamily:"Poppins",fontSize:17}}>Email</Text>
                            <Text style={{color:COLORS.secondary,fontFamily:"Poppins",fontSize:18}}>{userAccountObject.email}</Text>
                        </View>
                    </View>
                </View>
                {/* <TouchableOpacity style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:20,padding:20,borderRadius:50,backgroundColor:COLORS.redOrange}}>
                        <Text style={{fontFamily:"Poppins",color:COLORS.white,fontSize:20}}>Edit Profile</Text>
                    </TouchableOpacity> */}
                
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewUserProfile