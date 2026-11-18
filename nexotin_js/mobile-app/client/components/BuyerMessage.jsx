import { View, Text, StyleSheet, Image, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import moment from 'moment';
// import useAccountObject from '../hooks/accountObject';
import useUserAccountObject from '../hooks/useUserAccountObject';

const BuyerMessage = ({ message }) => {
  const { user } = useUserAccountObject();

  const [modalVisible, setModalVisible] = useState(false);

  const hasText = !!message.text;
  const hasImage = !!message.image;

  return (
    <>
      <View style={hasImage && !hasText ? styles.imageOnlyContainer : styles.container}>
        {hasImage && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              source={{ uri: message.image }}
              style={styles.image}
              resizeMode="contain"
            />
          </Pressable>
        )}

        {hasText && <Text style={styles.messageText}>{message.text}</Text>}

        <Text style={styles.timeText}>
          {moment(message.createdAt).format('h:mm A')}
        </Text>
      </View>

      {/* Fullscreen Image Modal */}
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

export default BuyerMessage;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 0,
    maxWidth: '80%',
  },
  imageOnlyContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#f5f5f5',
    padding: 6,
    borderRadius: 12,
    marginVertical: 4,
    marginHorizontal: 12,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 6,
    alignSelf: 'flex-end',
  },
  timeText: {
    fontSize: 11,
    color: 'white',
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
