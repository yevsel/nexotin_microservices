import { View, Text,TouchableOpacity,ScrollView,Alert,Modal,Dimensions,TextInput } from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyVendorMessages,removeUserObject } from '../Actions';
import { useSelector,useDispatch } from 'react-redux';
import { router } from 'expo-router';
const ProfileSettings = ({setLoggedIn}) => {


    const allowAppAccessReducer = useSelector(state=>state.allowAppAccessReducer)
    
    // console.log("AS",allowAppAccessReducer)
    const dispatch = useDispatch()
    // const navigation = useNavigation()
    const [modalVisible, setModalVisible] = useState(false);
    const {width,height} = Dimensions.get("screen")
    const [password,setPassword] = useState("")
    const [sendingReq,setSendingReq] = useState(false)
    // const [deletionRes]
    const [deletionResponse,setDeletionResponse] = useState("Enter your password to continue this process.")

    const sendDeletionRequest = async(token,password)=>{   
        // console.log("D",token)
        setDeletionResponse("Enter your password to continue this process.")
        setSendingReq(true)
        try {
            const res = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/account-deletion",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({token,password})
                
            })
            const data = await res.json()
            setDeletionResponse(data.msg)
            if(data.msg==="Your request was made successfully, your account should be deleted in any moment."){
                setTimeout(()=>{
                    setModalVisible(false)
                    AsyncStorage.removeItem("accountObject").then(()=>{
                        AsyncStorage.removeItem("token").then(()=>{
                            setLoggedIn(false)
                        }).catch(err=>console.log(err.message))
                    }).catch(err=>console.log(err.message))
                },1000)
            }
            setSendingReq(false)
        } catch (error) {
            setSendingReq(false)
        }
    }
    
    if(!allowAppAccessReducer){
        return(
            <SafeAreaView style={{height,alignItems:"center",backgroundColor:"white"}}>
                <ScrollView style={{width:"90%"}} contentContainerStyle={{ paddingBottom: 100}} showsVerticalScrollIndicator={false}>
                        <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                            <TouchableOpacity onPress={()=>{
                                router.back()
                                // navigation.goBack()
                            }} style={{position:"absolute",left:0}}>
                                <Entypo name="chevron-left" size={30} color="#333" />
                            </TouchableOpacity>
                            <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Settings</Text>
                        </View>
                        
                        <TouchableOpacity onPress={()=>{
                            // setLoggedIn(false)
                            
                            router.push("/(onboarding)")
                        
                        // navigation.navigate("FAQMainScreen")
                            }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent1,padding:20,borderRadius:10,marginBottom:20}}>
                                <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                                    {/* <MaterialCommunityIcons name="frequently-asked-questions" size={26} color="#333" /> */}
                                    <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Login</Text>
                                </View>
                                <View>
                                    <Entypo name="chevron-right" size={24} color="black" />
                            </View>
                </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{height,alignItems:"center",backgroundColor:"white"}}>
             <Modal
                style={{backgroundColor:"blue"}}
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                //   Alert.alert('Modal has been closed.');
                  setModalVisible(false);
            }}>
                <View style={{flex: 1,
                    justifyContent: 'flex-start',
                    
                    alignItems: 'center',
                    marginTop: 150,
                    // backgroundColor:""
                    }}>
                    <View style={{
                        width:320,
                        height:230,
                        margin: 10,
                        backgroundColor: 'white',
                        borderRadius: 15,
                        padding: 15,
                        alignItems: 'center',
                        shadowColor: '#000',
                        justifyContent:"center",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5,
                      }}>
                        <Text style={{fontFamily:"PoppinsBold",textAlign:"center"}}>{deletionResponse}</Text>
                        <TextInput secureTextEntry={true} multiline={false} onChangeText={(e)=>{
                            setPassword(e)
                            setDeletionResponse("Enter your password to continue this process.")
                        }}  style={{backgroundColor:"white",marginBottom:20,fontSize:18,borderWidth:1,paddingHorizontal:15,borderColor:"#ccc",borderRadius:10,height:60,marginTop:20,width:290}}/>
                        <View style={{flexDirection:"row",width:290,gap:5}}>
                            <TouchableOpacity onPress={()=>setModalVisible(false)} style={{flex:1,padding:10}}>
                                <Text style={{textAlign:"center",fontFamily:"Poppins"}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={sendingReq} onPress={()=>{
                                AsyncStorage.getItem("userToken").then(data=>{
                                    // console.log("DAD",JSON.parse(data))
                                    sendDeletionRequest(JSON.parse(data),password)
                                    // console.log("PASSWORD",password)
                                })
                            }}  style={{flex:1,padding:10,borderWidth:1,borderColor:"red",borderRadius:10,backgroundColor:"pink",alignItems:"center"}}>
                                <Text style={{textAlign:"center",color:"red",fontFamily:"Poppins"}}>{sendingReq?<ActivityIndicator size={13} color='red'/>:"Continue"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
            
            </Modal>
            <ScrollView style={{width:"90%"}} contentContainerStyle={{ paddingBottom: 100}} showsVerticalScrollIndicator={false}>
                <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                    <TouchableOpacity onPress={()=>{
                        router.back()
                        // navigation.goBack()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity>
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Settings</Text>
                </View>
                {/* Options */}
                {/* <TouchableOpacity onPress={()=>{
                    navigation.navigate("NotificationSettingsScreen")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent1,padding:20,borderRadius:10,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <Ionicons name="notifications-circle-outline" size={30} color="#333" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Notifications Settings</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={()=>{
                    router.push({
                        pathname:"/(tabs)/Profile/faqMainScreen"
                    })
                    // navigation.navigate("FAQMainScreen")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent1,padding:20,borderRadius:10,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <MaterialCommunityIcons name="frequently-asked-questions" size={26} color="#333" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>FAQ</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    router.push({
                        pathname:"/(tabs)/Profile/supportMainScreen"
                    })
                    // navigation.navigate("SupportMainScreen")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent1,padding:20,borderRadius:10,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <AntDesign name="questioncircleo" size={24} color="#333" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Support</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    // console.log("TERMS AND POLICIES")
                    router.push({
                        pathname:"/(tabs)/Profile/termsAndPoliciesScreen"
                    })
                    // navigation.navigate("TermsAndPolicies")
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent1,padding:20,borderRadius:10,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <AntDesign name="questioncircleo" size={24} color="#333" /> */}
                        <MaterialIcons name="policy" size={24} color="black" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Terms & Policies</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color={COLORS.secondary} />
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent1,padding:20,borderRadius:10,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <MaterialIcons name="feedback" size={24} color="#333" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Ratings & Feedback</Text>
                    </View>
                    <View>
                        <Entypo name="chevron-right" size={24} color="black" />
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={()=>{
                    Alert.alert("Reset password","Once you are logged out, go to the forgot password page and follow instructions to reset your password.",[
                        {
                            text:"Reset password",
                            style:"destructive",
                            onPress:()=>{
                                AsyncStorage.removeItem("userAccountObject").then(()=>{
                                    AsyncStorage.removeItem("userToken").then(()=>{
                                        setLoggedIn(false)
                                        // navigation.navigate("")
                                    }).catch(err=>console.log(err.message))
                                }).catch(err=>console.log(err.message))
                            }
                        },{
                            text:"Cancel",
                            style:"cancel",
                        }
                    ])
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent1,padding:20,borderRadius:10,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <AntDesign name="unlock" size={30} color="#333" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Reset Password</Text>
                    </View>
                    <View>
                        {/* <Entypo name="chevron-right" size={24} color="black" /> */}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    Alert.alert("Logout","Are you sure you want to logout?",[
                        {
                            text:"Yes",
                            style:"destructive",
                            onPress:()=>{
                                
                                AsyncStorage.removeItem("userAccountObject").then(()=>{
                                    AsyncStorage.removeItem("userToken").then(()=>{
                                        dispatch(removeUserObject())
                                        dispatch(emptyVendorMessages())
                                        // setLoggedIn(false)
                                        router.push("/(onboarding)")
                                    }).catch(err=>console.log(err.message))
                                }).catch(err=>console.log(err.message))
                            }
                        },{
                            text:"No",
                            style:"cancel",
                        }
                    ])
                    
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent1,padding:20,borderRadius:10,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <MaterialCommunityIcons name="logout" size={30} color="#333" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Logout</Text>
                    </View>
                    <View>
                        {/* <Entypo name="chevron-right" size={24} color="black" /> */}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{
                    setModalVisible(true)
                }} style={{flexDirection:"row",alignItems:"center",backgroundColor:"orangered",padding:20,borderRadius:10,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        <MaterialCommunityIcons name="account-cancel" size={30} color="white" />
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"white"}}>Delete account</Text>
                    </View>
                    <View>
                        {/* <Entypo name="chevron-right" size={24} color="black" /> */}
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProfileSettings