import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import ReportButton from '../components/ReportButton';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLocalSearchParams } from 'expo-router';
import BuyerMessage from '../components/BuyerMessage';
import useUserAccountObject from '../hooks/useUserAccountObject';
import { ParentContext } from '../context/ParentContext';
import { useContext } from 'react';
import { supabaseClient } from '../utils/supabase-client';
import VendorMessage from '../components/VendorMessage';
import uuid from 'react-native-uuid';
import PickImageButton from '../components/PickImageButton';
import { router as nav } from 'expo-router';
const MessageScreen = () => {
  const router = useLocalSearchParams()

  const {user} = useUserAccountObject()
  
  const {messageParameters, setMessageParameters} = useContext(ParentContext)

  
  const [dialogue, setDialogue] = useState([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  
  const [pickedImage, setPickedImage] = useState(null);
  const [stringImage, setStringImage] = useState(null)
  const [sound, setSound] = useState();
  
  
  const uploadBase64ImageToCloudinary = async (base64Data) => {
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/deaijqucs/upload`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            file: base64Data,
            upload_preset: 'profile_images',
          }),
        });
      const image = await response.json()
      return image.secure_url
    } catch (error) {
      console.log('Upload error:', error.message);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [16,9],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const base64String = result.assets[0].base64;
      
      setPickedImage(imageUri);
      setStringImage(`data:image/jpeg;base64,${base64String}`);
    }
  };

  async function playSuccess() {
    const { sound } = await Audio.Sound.createAsync(require("../assets/sounds/tap.mp3"));
    setSound(sound);
    await sound.playAsync();
  }

  const alertVendorOfMessage = async() => {
    // console.log("ALERT",messageParameters ? messageParameters.email : router.email)
    try {
      const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE + "/api/message/alert-vendor", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({vendorEmail: messageParameters ? messageParameters.email : router.email})
      })
      const res = await response.json()
      // console.log("RES",res)
    } catch (error) { 
      console.log("ERROR ALERTING USER", error.message)
    }
  }

 

  // Fixed: Get messages between vendor and client with proper bidirectional filtering
  const getAllMessagesBetweenVendorAndClient = async() => {
    if (!user) return;
    
    const senderEmail = user.email;
    const receiverEmail = messageParameters?.email || router.email;
    
    try {
      const {data, error} = await supabaseClient
        .from("chat_table")
        .select("*")
        .or(
          `and(sender_email.eq.${senderEmail},receiver_email.eq.${receiverEmail}),` +
          `and(sender_email.eq.${receiverEmail},receiver_email.eq.${senderEmail})`
        )
        .order("created_at", { ascending: false })
        .limit(20); // Load more initial messages
        
      if (error) {
        console.log("ERROR", error);
        return;
      }
      
      // Reverse to get chronological order (oldest first)
      const sorted = data.reverse();
      const acceptedFormats = sorted.map(m => m.accepted_format);
      
      setDialogue(acceptedFormats);
      
      // Check if we have fewer messages than requested (no more to load)
      if (data.length < 20) {
        setHasMoreMessages(false);
      }
      
    } catch (error) {
      console.log("BULK ERROR", error);
    }
  }

  // Fixed: Load more messages with proper pagination
  const getMessagesBefore = async (senderEmail, receiverEmail, beforeTimestamp) => {
    if (isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    
    try {
      const { data, error } = await supabaseClient
        .from('chat_table')
        .select('id, sender_email, receiver_email, accepted_format, created_at')
        .or(
          `and(sender_email.eq.${senderEmail},receiver_email.eq.${receiverEmail}),` +
          `and(sender_email.eq.${receiverEmail},receiver_email.eq.${senderEmail})`
        )
        .lt('created_at', beforeTimestamp)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('ERROR loading more messages:', error);
        return;
      }

      if (data.length === 0) {
        setHasMoreMessages(false);
        return;
      }

      // Reverse to chronological order and extract accepted_format
      const newMessages = data.reverse().map(m => m.accepted_format);
      
      // Prepend older messages to the beginning of the array
      setDialogue(prev => [...newMessages, ...prev]);
      
      // Check if we got fewer messages than requested
      if (data.length < 20) {
        setHasMoreMessages(false);
      }
      
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Load initial messages
  useEffect(() => {
    if (user) {
      getAllMessagesBetweenVendorAndClient();
    }
  }, [user]);

  // Fixed: Real-time message subscription
  useEffect(() => {
    if (!user) return;
    
    const senderEmail = user.email;
    const receiverEmail = messageParameters?.email || router.email;
    
    const channel = supabaseClient
      .channel('chat_insert_channel')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'chat_table'
        },
        (payload) => {
          const newMessage = payload.new;
          
          // Only add message if it's part of this conversation
          if (
            (newMessage.sender_email === senderEmail && newMessage.receiver_email === receiverEmail) ||
            (newMessage.sender_email === receiverEmail && newMessage.receiver_email === senderEmail)
          ) {
            playSuccess();
            // setDialogue(prev => [...prev, newMessage.accepted_format]);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [user, messageParameters, router]);

  const [input, setInput] = useState('');
  const scrollViewRef = useRef();
  const textInputRef = useRef();

  // Auto-scroll to bottom for new messages
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // Listen for keyboard events
  useEffect(() => {
    const keyboardDidShow = () => {
      scrollToBottom();
    };

    const keyboardDidHide = () => {
      // Optional: you can add behavior when keyboard hides
    };

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Fixed: Scroll handling with proper throttling
  const isLoadingRef = useRef(false);
  
  const handleScroll = useCallback(({ nativeEvent }) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const isAtTop = contentOffset.y <= 50; // Increased threshold for better UX
    
    if (isAtTop && !isLoadingRef.current && hasMoreMessages && dialogue.length > 0) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, dialogue.length]);
  
  const loadMoreMessages = useCallback(() => {
    if (isLoadingRef.current || !hasMoreMessages || dialogue.length === 0) return;
    
    isLoadingRef.current = true;
    
    const oldestMessage = dialogue[0];
    if (oldestMessage && oldestMessage.createdAt && user) {
      const senderEmail = user.email;
      const receiverEmail = messageParameters?.email || router.email;
      
      getMessagesBefore(senderEmail, receiverEmail, oldestMessage.createdAt)
        .finally(() => {
          // Reset loading flag after a delay to prevent rapid consecutive calls
          setTimeout(() => {
            isLoadingRef.current = false;
          }, 500);
        });
    } else {
      isLoadingRef.current = false;
    }
  }, [dialogue, user, messageParameters, router, hasMoreMessages]);

  const sendMessage = () => {
    if (input.trim()) {
      handleSendMessage(input)
      setInput('');
      scrollToBottom();
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (dialogue.length > 0) {
      scrollToBottom();
    }
  }, [dialogue.length, scrollToBottom]);

  // Handle TextInput focus
  const handleTextInputFocus = () => {
    scrollToBottom();
  };

  // Handle TextInput press (for additional responsiveness)
  const handleTextInputPress = () => {
    scrollToBottom();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50} // tweak if needed
      >
        
        {/* Header */}
        
        <View
          style={{
            height: 70,
            width: '100%',
            backgroundColor: 'white',
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}
        >
        {/* Left section: Back button */}
        <TouchableOpacity
          onPress={() => nav.push("/(tabs)/Messages")} // Adjust based on your router
          style={{
            padding: 8,
            marginRight: 8,
          }}
        >
          <Entypo name="chevron-left" size={30} color="#333" />
        </TouchableOpacity>

  {/* Middle section: Image and Name */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Image
          source={{ uri: router.image?router.image:messageParameters?.vendor_image }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
          }}
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: '600',
            color: '#222',
          }}
          numberOfLines={1}
        >
          {router.name?router.name:messageParameters?.vendor_name}
        </Text>
      </View>
      
      <ReportButton/>
    </View>
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{ 
            paddingBottom: 20,
            paddingTop: isLoadingMore ? 40 : 20 // Add space for loading indicator
          }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={100} // Reduced frequency to improve performance
        >
          {/* Loading indicator at top */}
          {isLoadingMore && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading more messages...</Text>
            </View>
          )}
          
          {/* No more messages indicator */}
          {!hasMoreMessages && dialogue.length > 20 && (
            <View style={styles.loadingContainer}>
              <Text style={styles.noMoreText}>No more messages</Text>
            </View>
          )}
          
          {dialogue.map((msg, index) => (
            msg.user._id === user?.email ? (
              <BuyerMessage message={msg} key={`${msg._id}-${index}`} />
            ) : (
              <VendorMessage message={msg} key={`${msg._id}-${index}`} />
            )
          ))}
        </ScrollView>
        
        <View style={styles.inputContainer}>
          <PickImageButton 
          pickedImage={pickedImage}
          onPickImage={pickImage}
          onRemoveImage={() => setPickedImage(null)}/>
          <TextInput
            ref={textInputRef}
            placeholder="Type your message..."
            value={input}
            onChangeText={setInput}
            style={styles.input}
            onSubmitEditing={sendMessage}
            onFocus={handleTextInputFocus}
            onPressIn={handleTextInputPress}
            multiline={false}
            returnKeyType="send"
          />
          <TouchableOpacity 
              onPress={sendMessage}
              style={{
                backgroundColor: COLORS.accent4,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                height: 40,
                width: 40,
                borderRadius: 20,
              }}
            >
              <Feather
                name="send"
                size={20}
                color={COLORS.redOrange}
                style={{ marginBottom: 0, marginRight: 0 }}
              />
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  message: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 8,
    lineHeight: 18,
    fontSize: 17
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  noMoreText: {
    color: '#999',
    fontSize: 12,
  },
});