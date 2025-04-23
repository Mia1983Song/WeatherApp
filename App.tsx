import React from 'react';
import {
  SafeAreaView, // 確保內容會在裝置的安全區域內顯示，避免被瀏海、圓角、底部操作列等裝置特性遮擋
  StyleSheet,
  StatusBar // 狀態列是指在手機螢幕最頂部的那一條區域，它通常用來顯示網路訊號強度、時間、電池電量…等，系統層級的資訊
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        {/* StatusBar 可以用來控制頂部狀態列的外觀 */}
        <StatusBar
          barStyle="dark-content" // 控制內容顏色 (圖示、文字)
          backgroundColor="#FFFFFF" // 控制背景色 (主要影響 Android)
        // translucent={false} // Android 是否沉浸式 (預設可能為 true)
        // hidden={false} // 是否隱藏狀態列
        />
        <AppNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 保證 SafeAreaView 佔滿整個螢幕，避免出現空白
  },
});