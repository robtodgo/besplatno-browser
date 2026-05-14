import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function BookmarkScreen() {
  const bookmarks = [
    { id: '1', title: 'Yahoo!', url: 'https://search.yahoo.com' },
    { id: '2', title: 'Google', url: 'https://google.com' },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.url}>{item.url}</Text>
          </TouchableOpacity>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  url: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
