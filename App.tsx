import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// SafeAreaView: 確保 iPhone 瀏海（Notch）或 Android 的狀態列不會擋住畫面
// AppNavigator: 把 Navigation (Tabs + Screens) 整個掛進來，讓 App 可以切換畫面

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* TODO: 未來可以在這裡加上 Provider，例如 ThemeProvider / ContextProvider */}
      <AppNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 保證 SafeAreaView 佔滿整個螢幕，避免出現空白
  },
});