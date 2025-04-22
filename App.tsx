import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// SafeAreaView: 確保內容會在裝置的安全區域內顯示，避免被瀏海、圓角、底部操作列等裝置特性遮擋
// AppNavigator: 把 Navigation (Tabs + Screens) 整個掛進來，讓 App 可以切換畫面
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AppNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 保證 SafeAreaView 佔滿整個螢幕，避免出現空白
  },
});