import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

interface LoadingIndicatorProps {
  message?: string
  size?: 'small' | 'large'
  color?: string
}

export default function LoadingIndicator({
  message = '載入中...',
  size = 'large',
  color = '#007AFF',
}: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
})
