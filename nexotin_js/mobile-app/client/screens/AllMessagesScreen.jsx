import { View, Text,Dimensions, StatusBar, ScrollView,FlatList, TouchableOpacity} from 'react-native'
import React,{useEffect,useCallback, useState, useContext} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device"
import { COLORS } from '../constants/theme';
import { useSelector,useDispatch } from 'react-redux';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EachMessage from '../components/EachMessage';
import {addVendorMessageToMessages,addBulkVendorDetails,resetMessages,enableCanSearchVendorAccountSwitch,disableCanSearchVendorAccountSwitch} from "../Actions"
import { supabaseClient } from '../utils/supabase-client';
import { router, usePathname } from 'expo-router';
import { ParentContext } from '../context/ParentContext';
import useUserAccountObject from '../hooks/useUserAccountObject';

export default function AllMessagesScreen({setLoggedIn,loggedIn}) {
    
    const {allMessages,setAllMessages,setDialogue,setMessageParameters} = useContext(ParentContext)
    
    const path = usePathname()
    // console.log("PATH",path)
    const enableCanSearchVendorAccountReducer = useSelector(state=>state.enableCanSearchVendorAccountReducer)
    const selectedVendorToChatReducer = useSelector(state=>state.selectedVendorToChatReducer)
    const dispatch = useDispatch()
    const allVendorMessagesReducer = useSelector(state=>state.allVendorMessagesReducer)
    const messagesReducer = useSelector(state=>state.messagesReducer)
    const userObjectReducer = useSelector(state=>state.userObjectReducer)
    const [isEmpty,setIsEmpty] = useState(false)
    const isFocussed = path==="/Messages"?true:false
    
    const [emptyM,setEmptyM] = useState(false)
    
    
    const [trigger,setTrigger] = useState(false)
    


    
    const get_latest_messages = async()=>{
            const {data,error} = await supabaseClient.rpc("get_all_latest_messages",{
                senderemail:userObjectReducer.email
            })
            if(data.length===0){
                setEmptyM(true)
            }else{
                setEmptyM(false)
            }
            if(error){
                console.log("ERROR",error)
            }else{
                // console.log("DATA FROM DB",data)
                setAllMessages(data)
                // dispatch(addBulkVendorDetails(data))
            }
        }
    
    useEffect(()=>{
        const subscribe = supabaseClient.channel('chat_insert_channel')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_table' },
          (payload) => {
            if( payload.new.sender_email===userObjectReducer.email){
                console.log("New message",payload)
              }
          }
        )
        .subscribe()
        
        return()=>{
          subscribe.unsubscribe()
        }
      },[])
    
    useEffect(() => {
        setDialogue([])
        setMessageParameters()
        if (isFocussed) {
            get_latest_messages()
        } 
    }, [isFocussed])
    

    const [loading,setLoading] = useState(true)
    const [canAccess,setCanAccess] = useState(false)
    
    const {height} = Dimensions.get("screen")
    const {user} = useUserAccountObject()
    useEffect(()=>{
        if(user){
            setCanAccess(true)
        }
    },[user])
    
    if(!canAccess){
        return(
            <SafeAreaView style={{flex:1,backgroundColor:"white",justifyContent:"center",alignItems:"center"}} backgroundColor="white">
                <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
                <View style={{alignItems:"center"}}>
                    <Text style={{fontFamily:"Poppins",fontSize:20,color:"#333"}}>Log in to access this feature.</Text>
                    <LottieView style={{width:500,height:250}} autoPlay source={require("../lottieAnimations/login_animation.json")} loop/>
                    
                    <TouchableOpacity onPress={()=>{
                        // setLoggedIn(false)
                        router.push("/(onboarding)")
                    }} style={{width:170,alignItems:"center",justifyContent:"center",borderRadius:50,height:55,backgroundColor:COLORS.redOrange}}>
                        <Text style={{fontFamily:"Poppins",fontSize:17,color:"white"}}>Log in</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }else{
        return (
            <SafeAreaView backgroundColor="white" style={{alignItems:"center"}}>
                <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
                <Text style={{fontFamily:"PoppinsBold",fontSize:30,color:COLORS.secondary,marginVertical:30}}>Messages</Text>
                {emptyM===true?
                <View style={{alignItems:"center",backgroundColor:"white",height:"100%"}}>
                    {/* <Text style={{fontFamily:"Poppins",fontSize:20,color:"#333"}}>No messages</Text> */}
                    <LottieView style={{width:500,height:250}} autoPlay source={require("../lottieAnimations/empty_mail.json")}/>
                    {/* <LottieView style={{width:500,height:250}} autoPlay source={require("../lottieAnimations/login_animation.json")} loop/> */}
                </View>
                :<FlatList
                    contentContainerStyle={{paddingBottom:300}} 
                    style={{width:"100%",height:height,backgroundColor:"white"}}
                    data={allMessages}
                    keyExtractor={(item)=>item.id}
                    renderItem={({item,index})=>{
                        
                        return(
                            <EachMessage key={index} email={item.receiver_email} image={item.vendor_image} name={item.vendor_name} time={item.created_at} message={item.text}/>
                        )
                    }}
                    />}
            </SafeAreaView>
    )
    }

}