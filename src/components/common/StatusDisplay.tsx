import React from 'react'
import LoadingIndicator from './LoadingIndicator'
import ErrorDisplay from './ErrorDisplay'

interface StatusDisplayProps {
  isLoading: boolean
  error: string | null
  loadingMessage?: string
  onRetry?: () => void
  retryText?: string
}

export default function StatusDisplay({
  isLoading,
  error,
  loadingMessage,
  onRetry,
  retryText,
}: StatusDisplayProps) {
  if (isLoading) {
    return <LoadingIndicator message={loadingMessage} />
  }

  if (error) {
    return (
      <ErrorDisplay error={error} onRetry={onRetry} retryText={retryText} />
    )
  }

  return null
}
