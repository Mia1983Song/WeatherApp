import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  retryText?: string
}

export default function ErrorDisplay({
  error,
  onRetry,
  retryText = '重試',
}: ErrorDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#666',
    fontWeight: '500',
  },
})
