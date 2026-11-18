import { View, Text,TouchableOpacity,Image,Alert} from 'react-native'
import React, { useState,useEffect } from 'react'
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker"
import { SafeAreaView } from "react-native-safe-area-context"
import { COLORS } from '../constants/theme';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const EditUserProfileImageScreen = ({setRefreshProfile,refreshProfile}) => {
    // const navigation  = useNavigation()
    const [image,setImage] = useState({})
    const [stringImage,setStringImage] = useState("")
    const [loading,setLoading] = useState(false)
    
    
    const enableButton = stringImage
    
    const sendToDatabase = async(token,image)=>{
        try {
            setLoading(true)
            const responseFromDatabase = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/edit-user-profile-image",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({image})
            })
            const data = await responseFromDatabase.json()
            const {msg} = data
            // console.log("RES",data)
            setLoading(false)
            // Update
            AsyncStorage.getItem("userAccountObject").then(data=>{
                const aO = JSON.parse(data)
                aO.profileImage = image.secure_url
                
                AsyncStorage.setItem("userAccountObject",JSON.stringify(aO)).then(data=>{
                    if(msg.acknowledged){
                        Alert.alert("Picture update","Update Successful🎊",[
                            {
                                text:"Ok",
                                onPress:()=>{
                                    // console.log(setRefreshProfile)
                                    setRefreshProfile(!refreshProfile)
                                    router.back()
                                    // navigation.navigate("ProfileMainScreen")
                                }
                            }
                        ])
                    }else{
                        Alert.alert("Picture update","Try again",[
                            {
                                text:"Go back"
                                // onPress:()=>console.log("Yes")
                            }
                        ])
                    }
                    
                }).catch(err=>console.log(err.message))
            }).catch(err=>console.log(err.message))
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error.message)
        }
    }
    
    const pickImage = async () => {
        try{
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                base64:true,
                aspect: [1, 1],
                quality: 0.5,
                
            });
            setStringImage(`data:image/jpeg;base64,${result.assets[0].base64}`)
            if (!result.canceled) {
                setImage(result.assets[0]);
            }
        }catch(error){
            // console.log(error.message)
        }
    }
    useEffect(()=>{
        // pickImage()
    },[])
    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            <View style={{width:"90%",backgroundColor:"",flex:1}}>
                {/* <Text>Hello</Text> */}
                <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                    <TouchableOpacity onPress={()=>{
                        router.back()
                        // navigation.goBack()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Edit Profile Picture</Text>
                </View>
                {image&&<Image source={{uri:image.uri}} style={{width:"100%",height:400,marginVertical:20,resizeMode:"contain"}}/>}
                {image===true?null:<View style={{width:"100%",height:10}}></View>}
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity onPress={pickImage} style={{backgroundColor:COLORS.accent2,height:60,alignItems:"center",flex:1,justifyContent:"center",borderRadius:50,marginRight:5}}>
                        <Text style={{color:"white",fontFamily:"Poppins",fontSize:17,textAlign:"center"}}>Select Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!enableButton} onPress={()=>{
                        // console.log(stringImage)
                        AsyncStorage.getItem("userToken").then((token)=>{
                            // console.log("TOKEN",token)
                            const uploadBase64ImageToCloudinary = async (base64Data) => {
                                try {
                                    setLoading(true)
                                    const response = await fetch(
                                    `https://api.cloudinary.com/v1_1/deaijqucs/upload`,
                                    {
                                        method:"POST",
                                        headers:{"Content-Type":"application/json"},
                                        body:JSON.stringify({
                                            file: base64Data,
                                            upload_preset: 'profile_images',}),
                                    });
                                // console.log(await response.json())
                                    const image = await response.json()
                                    // console.log("CLOUDIAN",image)
                                    sendToDatabase(JSON.parse(token),image)
                                } catch (error) {
                                    console.log('Upload error:', error.message);
                                }
                                };
                                uploadBase64ImageToCloudinary(stringImage)
                        
                        }).catch(err=>console.log(err.message))
                    }} style={{backgroundColor:COLORS.redOrange,flex:1,marginLeft:5,height:60,alignItems:"center",justifyContent:"center",borderRadius:50,flexDirection:"row"}}>
                        {loading&&<ActivityIndicator animating={true} color={COLORS.white} style={{marginHorizontal:10}}/>}
                        {loading===true?null:<Text style={{color:"white",fontFamily:"Poppins",fontSize:17,textAlign:"center"}}>Save</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default EditUserProfileImageScreen