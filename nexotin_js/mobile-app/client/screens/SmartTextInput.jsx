import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const SUGGESTED_REPLIES = ['Okay!', 'Thanks!', 'Talk soon.', 'Sounds good!'];

const emojiMap = {
  ':smile:': '😄',
  ':heart:': '❤️',
  ':thumbsup:': '👍',
  ':cry:': '😢',
  ':fire:': '🔥',
};

export default function SmartInput() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const parsed = parseEmoji(input);
    setMessages([...messages, parsed]);
    setInput('');
  };

  const parseEmoji = (text) => {
    return text.replace(/:\w+:/g, (match) => emojiMap[match] || match);
  };

  const onSuggestedReply = (text) => {
    const parsed = parseEmoji(text);
    setMessages([...messages, parsed]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messageBox}>
        {messages.map((msg, idx) => (
          <Text key={idx} style={styles.message}>
            {msg}
          </Text>
        ))}
      </ScrollView>

      {/* Suggested Replies */}
      <View style={styles.suggestions}>
        <FlatList
          data={SUGGESTED_REPLIES}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSuggestedReply(item)}
              style={styles.chip}
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Input + Send */}
      <View style={{}}>
          <View >
            <TextInput
              placeholder="Type a message... try :smile:"
              value={input}
              onChangeText={setInput}
              multiline
              style={styles.input}
            />
            
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Feather name="send" size={20} color="#fff" />
            </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  messageBox: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
    alignSelf: 'flex-start',
  },
  suggestions: {
    marginBottom: 8,
  },
  chip: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  chipText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f9f9f9',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#1976D2',
    marginLeft: 8,
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
