import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { List, Divider } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';

export default function HomeScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firestore()
        .collection('THREADS')
        .onSnapshot((querySnapshot) => {
            const threads = querySnapshot.docs.map((documentSnapshot) => {
                return {
                _id: documentSnapshot.id,
                // give defaults
                name: '',
                ...documentSnapshot.data(),
                };
            });
            // console.log(threads)
            setThreads(threads);

            if (loading) {
                setLoading(false);
            }
        });

        /**
         * unsubscribe listener
         */
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={threads}
                keyExtractor={item => item._id}
                ItemSeparatorComponent={() => <Divider />}
                renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Room', { thread: item })}
                >
                    <List.Item
                    title={item.name}
                    description='Item description'
                    titleNumberOfLines={1}
                    titleStyle={styles.listTitle}
                    descriptionStyle={styles.listDescription}
                    descriptionNumberOfLines={1}
                    />
                </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
    },
    listTitle: {
        color: 'black',
        fontSize: 22,
    },
    listDescription: {
        fontSize: 16,
        color: 'black'
    },
});