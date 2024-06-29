import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [item, setItem] = useState('');
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Items')
      .onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((documentSnapshot) => {
          items.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        setItems(items);
      });

    return () => unsubscribe();
  }, []);

  const addItem = () => {
    if (editingId) {
      firestore().collection('Items').doc(editingId).update({
        name: item,
      });
      setEditingId(null);
    } else {
      firestore().collection('Items').add({
        name: item,
      });
    }
    setItem('');
  };

  const editItem = (id, name) => {
    setItem(name);
    setEditingId(id);
  };

  const deleteItem = (id) => {
    firestore().collection('Items').doc(id).delete();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={item}
        onChangeText={setItem}
        placeholder="Enter item"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title={editingId ? 'Update Item' : 'Add Item'} onPress={addItem} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Text>{item.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title="Edit" onPress={() => editItem(item.id, item.name)} />
              <Button title="Delete" onPress={() => deleteItem(item.id)} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default App;
