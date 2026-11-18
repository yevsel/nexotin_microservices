import React, { useContext, useState } from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet,TouchableWithoutFeedback,Keyboard,Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ActivityIndicator, TextInput } from 'react-native-paper'
import { supabaseClient } from '../utils/supabase-client'
import { ParentContext } from '../context/ParentContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
const ReportButton = () => {
  const [visible, setVisible] = useState(false)
  const [selectedReason, setSelectedReason] = useState(null)

const [otherText, setOtherText] = useState('')

const [loading,setLoading] = useState(false)

  const {receiverEmail} = useContext(ParentContext)

  const reasons = [
    'Misleading claim',
    'Inappropriate, abusive act',
    'Other',
  ]

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={{ marginRight: 16 }}>
        <Ionicons name="alert-circle-outline" size={24} color="red" />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="fade"
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
      <TouchableWithoutFeedback
    onPress={() => {
      Keyboard.dismiss()
    }}
  >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Report vendor</Text>

            {reasons.map((reason, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedReason(reason)}
                style={[
                  styles.option,
                  selectedReason === reason && styles.selectedOption
                ]}
              >
                <Text>{reason}</Text>
              </TouchableOpacity>
            ))}
            
                {selectedReason === 'Other' && (
                <TextInput
                  mode="outlined"
                  label="Please specify"
                  placeholder="Type your reason here..."
                  multiline
                  numberOfLines={1}
                  style={{ backgroundColor: 'white' }}
                  value={otherText}
                  onChangeText={setOtherText}
                />
              )}

            <TouchableOpacity
            style={[styles.option, { backgroundColor: '#f5f5f5' }]}
            onPress={() => {
              Alert.alert(
                "Block Vendor",
                "Are you sure you want to block this vendor?",
                [
                  {
                    text: "Cancel",
                    style: "cancel"
                  },
                  {
                    text: "Block",
                    style: "destructive",
                    onPress: async () => {
                      const userData = await AsyncStorage.getItem("userAccountObject");
                      const senderEmail = JSON.parse(userData).email;
                      const receiver = receiverEmail;
          
                      console.log("SENDER", senderEmail);
                      console.log("RECEIVER", receiver);
          
                      // Uncomment to run your block logic
                      const { data, error } = await supabaseClient.rpc("delete_messages_between_emails", {
                        senderemail: senderEmail,
                        receiveremail: receiver
                      });
                      console.log("D",data,"E",error)
                      if(!error){
                        router.push("/(tabs)/Messages")
                        }
          
                      setVisible(false); // Close modal after block
                    }
                  }
                ]
              );
            }}
          >
            <Text style={{ color: 'red' }}>Block this vendor</Text>
          </TouchableOpacity>

            <View style={{flexDirection:"row",width:"100%",justifyContent:"space-between"}}>
                <TouchableOpacity
                  style={[{marginTop: 10,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: 'center',width:"47%",borderWidth:1,borderColor:"#FF5722"}]}
                  onPress={() => {
                    setVisible(false)
                  }}
                >
                  <Text style={{color:"#FF5722",fontWeight:"bold"}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!(selectedReason || otherText || !loading)}
                  style={[styles.sendButton,{width:"47%"}]}
                  onPress={async() => {
                    if (selectedReason || otherText) {  
                      setLoading(true)
                      const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE + "/api/report-vendor", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ report: otherText + selectedReason })
                      })
                  
                      const d = await response.json()
                      
                      setOtherText("")
                      setSelectedReason("")
                    
                      Alert.alert("Report Sent", d.msg || "Thank you for your feedback.")
                      setLoading(false)
                      setVisible(false)
                    }else{
                    
                    }
                    // setVisible(false)
                  }}
                >
                  {
                    loading?<ActivityIndicator color='white' size={20}/>:
                  <Text style={styles.sendButtonText}>Send report</Text>
                  }
                </TouchableOpacity>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedOption: {
    borderColor: '#1E88E5',
    backgroundColor: '#E3F2FD',
  },
  sendButton: {
    marginTop: 10,
    backgroundColor: '#FF5722',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})

export default ReportButton
