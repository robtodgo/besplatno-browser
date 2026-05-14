import React, { useRef, useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useMobileTabStore } from '../stores/tabStore';
import { normalizeUrl } from '@besplatno/shared';

export default function HomeScreen({ navigation }: any) {
  const { tabs, activeTabId, updateActiveTab } = useMobileTabStore();
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  
  const webViewRef = useRef<WebView>(null);
  const [urlInput, setUrlInput] = useState(activeTab.url);

  const handleNavigate = () => {
    const normalized = normalizeUrl(urlInput);
    setUrlInput(normalized);
    updateActiveTab({ url: normalized });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Адресная строка */}
      <View style={styles.addressBar}>
        <TextInput
          style={styles.input}
          value={urlInput}
          onChangeText={setUrlInput}
          onSubmitEditing={handleNavigate}
          placeholder="Поиск или адрес"
          placeholderTextColor="#fff8"
          autoCapitalize="none"
          keyboardType="url"
        />
        <TouchableOpacity style={styles.goButton} onPress={handleNavigate}>
          <Text style={styles.goButtonText}>GO</Text>
        </TouchableOpacity>
      </View>

      {/* Браузер */}
      <WebView
        ref={webViewRef}
        source={{ uri: activeTab.url }}
        style={styles.webview}
        onNavigationStateChange={(navState) => {
          setUrlInput(navState.url);
          updateActiveTab({ url: navState.url, title: navState.title });
        }}
      />

      {/* Нижняя панель управления */}
      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => webViewRef.current?.goBack()}>
          <Text style={styles.navIcon}>◀</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => webViewRef.current?.goForward()}>
          <Text style={styles.navIcon}>▶</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Bookmarks')}>
          <Text style={styles.navIcon}>⭐</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.navIcon}>🕒</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { /* Вкладки */ }}>
          <View style={styles.tabBadge}>
            <Text style={styles.tabCount}>{tabs.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8C00',
  },
  addressBar: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 14,
  },
  goButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  goButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  webview: {
    flex: 1,
  },
  bottomBar: {
    height: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navIcon: {
    fontSize: 20,
    color: '#FF8C00',
  },
  tabBadge: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
});
