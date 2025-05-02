// src/components/animations/FadeIn.tsx
import React, { useEffect, useRef } from 'react'
import { Animated, ViewProps } from 'react-native'

interface FadeInProps extends ViewProps {
  duration?: number
  delay?: number
  children: React.ReactNode
}

export default function FadeIn({
  duration = 500,
  delay = 0,
  children,
  style,
  ...props
}: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true, // 使用原生驅動提高性能
    }).start()
  }, [opacity, duration, delay])

  return (
    <Animated.View style={[{ opacity }, style]} {...props}>
      {children}
    </Animated.View>
  )
}
