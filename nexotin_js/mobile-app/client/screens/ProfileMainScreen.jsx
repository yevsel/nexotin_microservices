import { View, Text,ScrollView,TouchableOpacity,Image,Dimensions } from 'react-native'
import React,{useState,useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { useSelector,useDispatch } from 'react-redux';
import { setAllowAppAccess } from '../Actions';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
// import Fontisto from '@expo/vector-icons/Fontisto';
const ProfileMainScreen = ({refreshProfile}) => {

    // const navigation = useNavigation()
    const [userAccountObject,setUserAccountObject] = useState({})
    const {width,height} = Dimensions.get("screen")
    
    const dispatch = useDispatch()
    
    const allowAppAccessReducer = useSelector(state=>state.allowAppAccessReducer)
    
    
    useEffect(()=>{
        AsyncStorage.getItem("userAccountObject").then(data=>{
            if(data!==null){
                setUserAccountObject(JSON.parse(data))
                setAllowAppAccess(dispatch(setAllowAppAccess()))
            }
        }).catch(err=>console.log(err.message))
        // console.o
    },[refreshProfile])
    
    if(!userAccountObject){
        <View>
        
        </View>
    }
    
    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            <ScrollView style={{width:"90%"}} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:100}}>
                <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                    {/* <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity> */}
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Profile</Text>
                </View>
                {/* Body */}
                
                <View style={{paddingTop:30}}>
                    <View style={{justifyContent:"center",alignItems:"center",position:"relative"}}>
                        <Image source={{uri:userAccountObject?.profileImage?userAccountObject.profileImage:"https://res.cloudinary.com/primegh/image/upload/v1692658213/sfan_blog_images/zu8htfwhbexietetnfsm.png"}} resizeMode="cover" style={{width:100,height:100,marginBottom:50,borderRadius:100}}/>
                        {/* <TouchableOpacity style={{width:50,height:50,right:120,bottom:50,backgroundColor:COLORS.redOrange,borderRadius:50,alignItems:"center",justifyContent:"center",position:"absolute"}}>
                            <AntDesign name="edit" size={24} color="white" />
                        </TouchableOpacity> */}
                    </View>
                    <Text style={{textAlign:"center",marginBottom:20,marginTop:-20,fontFamily:"PoppinsBold",color:COLORS.secondary,fontSize:20}}>{userAccountObject?.firstName} {userAccountObject?.lastName}</Text>
                    {/* Favorites */}
                    <TouchableOpacity onPress={()=>{
                        // navigation.navigate("SavedProducts")
                        router.push("/(tabs)/Profile/savedProductsScreen")
                    }} style={{flexDirection:"row",alignItems:"center",marginBottom:15,padding:20,borderRadius:10,backgroundColor:COLORS.accent1}}>
                        <View style={{flexDirection:"row",alignContent:"center",flex:1}}>
                            <FontAwesome name="bookmark" size={28} color="black" />
                            <Text style={{fontFamily:"Poppins",fontSize:20,color:"gray",marginLeft:10}}>Saved Products</Text>
                        </View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                    {/* Profile */}
                    {allowAppAccessReducer&&<TouchableOpacity onPress={()=>{
                        router.push({
                            pathname:"/(tabs)/Profile/userProfileSettings",
                            params:{image:userAccountObject?.profileImage?userAccountObject.profileImage:"https://res.cloudinary.com/primegh/image/upload/v1692658213/sfan_blog_images/zu8htfwhbexietetnfsm.png"}
                        })
                        // navigation.navigate("ViewUserProfile",{image:userAccountObject?.profileImage?userAccountObject.profileImage:"https://res.cloudinary.com/primegh/image/upload/v1692658213/sfan_blog_images/zu8htfwhbexietetnfsm.png"})
                    }} style={{flexDirection:"row",alignItems:"center",marginBottom:15,padding:20,borderRadius:10,backgroundColor:COLORS.accent1}}>
                        <View style={{flexDirection:"row",alignContent:"center",flex:1}}>
                            <Ionicons name="person" size={28} color="black" />
                            <Text style={{fontFamily:"Poppins",fontSize:20,color:"gray",marginLeft:10}}>Profile</Text>
                        </View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>}
                    {/* My Orders */}
                    {allowAppAccessReducer&&<TouchableOpacity onPress={()=>{
                        router.push("/(tabs)/Profile/myOrdersMainScreen")
                        // navigation.navigate("MyOrdersMainScreen")
                    }} style={{flexDirection:"row",alignItems:"center",marginBottom:15,padding:20,borderRadius:10,backgroundColor:COLORS.accent1}}>
                        <View style={{flexDirection:"row",alignContent:"center",flex:1}}>
                            <AntDesign name="shoppingcart" size={32} color="black" />
                            <Text style={{fontFamily:"Poppins",fontSize:20,color:"gray",marginLeft:10}}>My Orders</Text>
                        </View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>}
                    
                    {/* Notifications */}
                    {/* {allowAppAccessReducer&&<TouchableOpacity style={{flexDirection:"row",alignItems:"center",marginBottom:15,padding:20,borderRadius:50,backgroundColor:COLORS.accent4}}>
                        <View style={{flexDirection:"row",alignContent:"center",flex:1}}>
                            <Ionicons name="notifications-circle-outline" size={34} color="black" />
                            <Text style={{fontFamily:"Poppins",fontSize:20,color:"gray",marginLeft:10}}>Notifications</Text>
                        </View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>} */}
                    
                    {/* Settings */}
                    <TouchableOpacity onPress={()=>{
                        router.push({
                            pathname:"/(tabs)/Profile/profileSettingsScreen"
                        })
                        // navigation.navigate("ProfileSettings")
                    }} style={{flexDirection:"row",alignItems:"center",marginBottom:15,padding:20,borderRadius:10,backgroundColor:COLORS.accent1}}>
                        <View style={{flexDirection:"row",alignContent:"center",flex:1}}>
                            <Ionicons name="settings" size={24} color="black" />
                            <Text style={{fontFamily:"Poppins",fontSize:20,color:"gray",marginLeft:10}}>Settings</Text>
                        </View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                {!allowAppAccessReducer&&<Text style={{textAlign:"center",color:"gray",fontFamily:"Poppins",marginTop:20}}>Login of create an account to get more features</Text>}
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileMainScreen