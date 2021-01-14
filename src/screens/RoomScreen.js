import React, { useState, useEffect } from 'react';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function RoomScreen() {
  const [messages, setMessages] = useState([
    /**
     * Mock message data
     */
    // example of system message
    {
      _id: 0,
      text: 'New room created.',
      createdAt: new Date().getTime(),
      system: true
    },
    // example of chat message
    {
      _id: 1,
      text: 'Henlo!',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'Test User'
      }
    }
  ]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('THREADS')
      .doc('00001')
      .onSnapshot(documentSnapshot => {
        console.log('User data: ', documentSnapshot.data());
      });

      return () => subscriber();
  },['00001'])

  async function getCollection () {
    const usersCollection = await firestore().collection('THREADS').get();
    console.log(usersCollection)
  }

  // helper method that is sends a message
  function handleSend(newMessage = []) {
    setMessages(GiftedChat.append(messages, newMessage));
  }

  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#6646ee' />
      </View>
    );
  }

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#6646ee' />
        </View>
      </Send>
    );
  }

  function renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: '#6646ee'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
      />
    );
  }

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <IconButton icon='chevron-double-down' size={36} color='#6646ee' />
      </View>
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => handleSend(newMessage)}
      user={{ _id: 1 }}
      renderBubble={renderBubble}
      placeholder='Type your message here...'
      showUserAvatar
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottomComponent={scrollToBottomComponent}
      renderLoading={renderLoading}
    />
  );
}

const styles = StyleSheet.create({
    sendingContainer: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    bottomComponentContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});