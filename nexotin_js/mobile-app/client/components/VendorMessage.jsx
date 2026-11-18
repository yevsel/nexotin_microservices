import { View, Text, StyleSheet, Image, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';

const VendorMessage = ({ message }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const hasText = !!message.text;
  const hasImage = !!message.image;

  return (
    <>
      <View style={styles.container}>
        {hasImage && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: message.image }}
              style={styles.image}
              resizeMode="cover"
            />
          </Pressable>
        )}
        {hasText && <Text style={styles.messageText}>{message.text}</Text>}
        <Text style={styles.timeText}>{moment(message.createdAt).format('h:mm A')}</Text>
      </View>

      {/* Modal to show full-size image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <Image
              source={{ uri: message.image }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default VendorMessage;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 0,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 6,
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 10,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#555',
    textAlign: 'right',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});
