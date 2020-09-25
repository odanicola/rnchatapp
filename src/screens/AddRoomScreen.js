import React , { useState }from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Title } from 'react-native-paper';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import firestore from '@react-native-firebase/firestore';

export default function AddRoomScreen({ navigation }) {
    const [roomName, setRoomName] = useState('');
    /**
     * Create a new Firestore collection to save threads
     */
    function handleButtonPress() {
        console.log('masuk')
        console.log(roomName)
        if (roomName.length > 0) {
        firestore()
            .collection('THREADS')
            .add({
                name: roomName,
                latestMessage: {
                    text: `You have joined the room ${roomName}.`,
                    createdAt: new Date().getTime()
                }
            })
            .then(docRef => {
                console.log(docRef)
                docRef.collection('MESSAGES').add({
                    text: `You have joined the room ${roomName}.`,
                    createdAt: new Date().getTime(),
                    system: true
                });
                navigation.navigate('Home');
            });
        }
    }

    return (
        <View style={styles.rootContainer}>
        <View style={styles.closeButtonContainer}>
            <IconButton
            icon='close-circle'
            size={36}
            color='#6646ee'
            onPress={() => navigation.goBack()}
            />
        </View>
        <View style={styles.innerContainer}>
            <Title style={styles.title}>Create a new chat room</Title>
            <FormInput
            labelName='Room Name'
            value={roomName}
            onChangeText={(text) => setRoomName(text)}
            clearButtonMode='while-editing'
            />
            <FormButton
            title='Create'
            modeValue='contained'
            labelStyle={styles.buttonLabel}
            onPress={() => handleButtonPress()}
            disabled={roomName.length === 0}
            />
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    closeButtonContainer: {
      position: 'absolute',
      top: 30,
      right: 0,
      zIndex: 1,
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 10,
      color: 'black'
    },
    buttonLabel: {
      fontSize: 22,
    },
});