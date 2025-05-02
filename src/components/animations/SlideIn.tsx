// src/components/animations/SlideIn.tsx
import React, { useEffect, useRef } from 'react'
import { Animated, ViewProps } from 'react-native'

// 定義可滑入的方向
export type SlideDirection = 'left' | 'right' | 'up' | 'down'

interface SlideInProps extends ViewProps {
  direction?: SlideDirection
  distance?: number
  duration?: number
  delay?: number
  children: React.ReactNode
}

export default function SlideIn({
  direction = 'up',
  distance = 50,
  duration = 500,
  delay = 0,
  children,
  style,
  ...props
}: SlideInProps) {
  // 根據方向創建初始位移值
  const translateX = useRef(
    new Animated.Value(
      direction === 'left' ? distance : direction === 'right' ? -distance : 0
    )
  ).current

  const translateY = useRef(
    new Animated.Value(
      direction === 'up' ? distance : direction === 'down' ? -distance : 0
    )
  ).current

  // 創建透明度動畫值
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // 同時運行位移和透明度動畫
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start()
  }, [translateX, translateY, opacity, duration, delay])

  return (
    <Animated.View
      style={[
        {
          opacity,
          transform: [{ translateX }, { translateY }],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  )
}
