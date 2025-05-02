import React from 'react'
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import AppNavigator from './src/navigation/AppNavigator'
import { SettingsProvider } from './src/contexts/SettingsContext'
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext'

// 包裝應用程式以使用主題
const ThemedApp = () => {
  const { theme, isDark } = useTheme()

  return (
    <NavigationContainer theme={theme}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
        />
        <AppNavigator />
      </SafeAreaView>
    </NavigationContainer>
  )
}

// 主應用程式元件
export default function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </SettingsProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
