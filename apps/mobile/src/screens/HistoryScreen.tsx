import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function HistoryScreen() {
  const history = [
    { id: '1', title: 'Поиск в Yahoo!', time: '10:30' },
    { id: '2', title: 'Официальный сайт', time: '09:15' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#333',
  },
  time: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
});
