import { View, Text,ScrollView,TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { Switch } from 'react-native-paper';

const NotificationSettingsScreen = () => {

    // const navigation = useNavigation()
    
    const [couponsAndSalesPromotion,setCouponsAndSalesPromotion] = useState(false)
    const [recommendations,setRecommendations] = useState(false)
    const [messages,setMessages] = useState(false)
    const [subscribers,setSubscribers] = useState(false)
    const [loginAndLogout,setLoginAndLogout] = useState(false)

    return (
        <SafeAreaView style={{flex:1,alignItems:"center",backgroundColor:"white"}}>
            <ScrollView style={{width:"90%"}} contentContainerStyle={{ paddingBottom: 100}} showsVerticalScrollIndicator={false}>
                <View style={{marginVertical:15,flexDirection:"row",justifyContent:"center",position:"relative"}}>
                    {/* <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                    }} style={{position:"absolute",left:0}}>
                        <Entypo name="chevron-left" size={30} color="#333" />
                    </TouchableOpacity> */}
                    <Text style={{fontFamily:"Poppins",fontSize:18,color:"#333"}}>Notification Settings</Text>
                </View>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:15,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <Ionicons name="person-circle-outline" size={30} color="#333" /> */}
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Coupons & Sales Promotion</Text>
                    </View>
                    <View>
                        <Switch value={couponsAndSalesPromotion} color={COLORS.redOrange} onValueChange={()=>setCouponsAndSalesPromotion(!couponsAndSalesPromotion)}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:15,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <Ionicons name="person-circle-outline" size={30} color="#333" /> */}
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Recommendations</Text>
                    </View>
                    <View>
                        <Switch value={recommendations} color={COLORS.redOrange} onValueChange={()=>setRecommendations(!recommendations)}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:15,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <Ionicons name="person-circle-outline" size={30} color="#333" /> */}
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Messages</Text>
                    </View>
                    <View>
                        {/* <AntDesign name="right" size={24} color="#333" /> */}
                        <Switch value={messages} color={COLORS.redOrange} onValueChange={()=>setMessages(!messages)}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:15,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <Ionicons name="person-circle-outline" size={30} color="#333" /> */}
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Subscribers</Text>
                    </View>
                    <View>
                        <Switch value={subscribers} color={COLORS.redOrange} onValueChange={()=>setSubscribers(!subscribers)}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:"row",alignItems:"center",backgroundColor:COLORS.accent4,padding:15,borderRadius:50,marginBottom:20}}>
                    <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                        {/* <Ionicons name="person-circle-outline" size={30} color="#333" /> */}
                        <Text style={{marginHorizontal:10,fontFamily:"Poppins",fontSize:18,color:"#333"}}>Login & logout</Text>
                    </View>
                    <View>
                        <Switch value={loginAndLogout} color={COLORS.redOrange} onValueChange={()=>setLoginAndLogout(!loginAndLogout)}/>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationSettingsScreen