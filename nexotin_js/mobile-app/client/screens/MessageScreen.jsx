import { View,TouchableOpacity,StatusBar,Alert,KeyboardAvoidingView, Platform } from 'react-native'

import React,{useEffect,useCallback,useState, useContext} from 'react'
import { GiftedChat,Bubble, Send,Composer } from 'react-native-gifted-chat'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../constants/theme'
import { Feather } from '@expo/vector-icons';
import { supabaseClient} from "../utils/supabase-client"
import { useSelector,useDispatch } from 'react-redux'
import { addMessage,resetMessages,addBulkMessages } from '../Actions'
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Device from "expo-device"
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname,useLocalSearchParams } from 'expo-router';
import { ParentContext } from '../context/ParentContext';
import useUserAccountObject from '../hooks/useUserAccountObject';

export default function MessageScreen() {

  // const localData = useLocalSearchParams()
  
  
  const {setDialogue,dialogue,receiverEmail} = useContext(ParentContext)
  
  const router = useLocalSearchParams()
  
  const {messageParameters,setMessageParameters} = useContext(ParentContext)


  const alertVendorOfMessage = async()=>{
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/message/alert-vendor",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({vendorEmail:messageParameters?messageParameters.email:router.email})
      })
      const res = await response.json()
    } catch (error) { 
      console.log("ERROR ALERTING USER",error.message)
    }
  }
  
    const messagesReducer = useSelector(state=>state.messagesReducer)
    const userObjectReducer = useSelector(state=>state.userObjectReducer)
    
    const isFocussed = usePathname()==="/Messages/messageScreen"?true:false
    

    const dispatch = useDispatch()
    
    const [sound, setSound] = useState();
    
    const {user} = useUserAccountObject()

    
    const [canAccessScreen,setCanAccessScreen] = useState(false)
    const [senderInformation,setSenderInformation] = useState(null)

    async function playSuccess() {
    //   console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync( require("../assets/sounds/tap.mp3"))
      ;
      setSound(sound);
  
    //   console.log('Playing Sound');
      await sound.playAsync();
    }
    
    
    
useEffect(() => {
  const channel = supabaseClient
    .channel('chat_insert_channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chat_table' },
      (payload) => {
        playSuccess();
        setDialogue(prev => [...prev, payload.new.accepted_format]);
      }
    )
    .subscribe();

  return () => {
    supabaseClient.removeChannel(channel);
  };
}, []);

  const getAllMessagesBetweenVendorAndClient = async()=>{
    try {
      const {data,error} = await supabaseClient.from("chat_table").select("*")
      .eq("sender_email",userObjectReducer.email)
      .eq("receiver_email", router.email)
      .order("created_at", { ascending: false });
      
      if(error){
        return console.log("ERROR",error)
      }
      const a_f = data.map(m=>m.accepted_format)
      console.log("AF",a_f)
      setDialogue(a_f)
    } catch (error) {
      console.log("BULK ERROR",error)
    }
  }

  useEffect(() => {
    AsyncStorage.getItem("userAccountObject").then(userData=>{
      if (!isFocussed) {
        
        setDialogue([])
      } else {
        if(messageParameters===undefined){
          getAllMessagesBetweenVendorAndClient()
        }
        else if(messageParameters.addMessageByImages===false){
          // console.log("WAVE",messageParameters)
          const dataToSend = JSON.parse(messageParameters.dataToSend)
          const finalObject = {
            sender_email:JSON.parse(userData).email,
            receiver_email:messageParameters.email,
            text:"Hello 👋",
            metadata:{"_id":JSON.parse(userData).email,"avatar":JSON.parse(userData).profileImage?JSON.parse(userData).profileImage:"https://cdn-icons-png.flaticon.com/512/149/149071.png"},
            accepted_format:dataToSend,
            cus_name:JSON.parse(userData).firstName + " "+JSON.parse(userData).lastName,
            cus_image:JSON.parse(userData).profileImage?JSON.parse(userData).profileImage:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
            vendor_name: messageParameters.vendor_name,
            vendor_image: messageParameters.vendor_image
          }
          
          supabaseClient.from("chat_table").insert(finalObject).then(d=>{}).catch(er=>console.log("ER",er))
          setMessageParameters()
          alertVendorOfMessage()
        }
        else if(messageParameters.addMessageByImages===true){
          // console.log("IMA",messageParameters)
          const dataToSend = JSON.parse(messageParameters.dataToSend)
          const finalObject = {
            sender_email:JSON.parse(userData).email,
            receiver_email:messageParameters.email,
            text:"📷Hello is this product available",
            metadata:{"_id":JSON.parse(userData).email,"avatar":JSON.parse(userData).profileImage?JSON.parse(userData).profileImage:"https://cdn-icons-png.flaticon.com/512/149/149071.png"},
            accepted_format:dataToSend,
            cus_name:JSON.parse(userData).firstName + " "+JSON.parse(userData).lastName,
            cus_image:JSON.parse(userData).profileImage?JSON.parse(userData).profileImage:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
            vendor_name: messageParameters.vendor_name,
            vendor_image: messageParameters.vendor_image
          }
          supabaseClient.from("chat_table").insert(finalObject).then(d=>{}).catch(er=>console.log("ER",er))
          setMessageParameters()
          alertVendorOfMessage()
        }
      }
    })
   
    
}, [isFocussed])
      
      const renderSend = (props) => {
        return (
          <Send {...props}>
            <View>
              <Feather 
                name="send"
                style={{marginBottom: 5, marginRight: 10}}
                size={30}
                color={COLORS.redOrange}
              />
            </View>
          </Send>
        );
      };
      const scrollToBottomComponent = () => {
        return(
          <FontAwesome name='angle-double-down' size={22} color='#333' />
        );
      }
      
      
      
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#333",
            paddingHorizontal:5,
            paddingVertical:2
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };
      

      return (
            <SafeAreaView style={{flex:1,backgroundColor:"white"}}>
              <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
                  <GiftedChat
                    messages={dialogue}
                    multiline
                    scrollToBottom
                    alwaysShowSend
                    renderSend={renderSend}
                    placeholder='Type your message'
                    onSend={async messages =>{
                      try{
                          if(user){
                            
                            const dataToSend = {
                              senderEmail: user.email,
                              receiverEmail:messageParameters?messageParameters.email:router.email,
                              message: messages[0].text,
                              metadata:messages[0].user,
                              acceptedFormat:messages[0],
                              name:user.firstName + " "+user.lastName,
                              image:user.profileImage?user.profileImage:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            console.log("TO send",dataToSend)
                            const {data,error} = await supabaseClient.from("chat_table").insert({
                              sender_email:dataToSend.senderEmail,
                              receiver_email:dataToSend.receiverEmail,
                              text:dataToSend.message,
                              metadata:dataToSend.metadata,
                              accepted_format:dataToSend.acceptedFormat,
                              cus_name:dataToSend.name,
                              cus_image:dataToSend.image,
                              vendor_name:router.name,
                              vendor_image:router.image
                            })
                          }
                          alertVendorOfMessage()
                       
                      }catch(err){
                        // console.log("ER",err)
                      }
                    }}
                    scrollToBottomComponent={scrollToBottomComponent}
                    renderBubble={renderBubble}
                    user={{
                      _id: userObjectReducer.email,
                      name:userObjectReducer.firstName+ " " + userObjectReducer.lastName,
                      avatar:userObjectReducer.profileImage?userObjectReducer.profileImage:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }}
                  />

        </SafeAreaView>
      )
}