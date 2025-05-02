import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { useTheme } from '../../contexts/ThemeContext'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

interface LoadingIndicatorProps {
  message?: string
  size?: 'small' | 'large'
  color?: string
  type?: 'sun' | 'cloud' | 'rain' | 'standard'
}

export default function LoadingIndicator({
  message = '載入中...',
  size = 'large',
  color,
  type = 'sun',
}: LoadingIndicatorProps) {
  const { theme } = useTheme()

  // 若未提供顏色，使用主題主色調
  const indicatorColor = color || theme.colors.primary

  // 確定尺寸數值
  const sizeValue = size === 'large' ? 48 : 24

  // 創建旋轉動畫值
  const rotation = useRef(new Animated.Value(0)).current

  // 創建脈動動畫值
  const pulse = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // 旋轉循環動畫
    const spinAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    )

    // 脈動循環動畫
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )

    // 開始動畫
    spinAnimation.start()
    pulseAnimation.start()

    // 清理函數
    return () => {
      spinAnimation.stop()
      pulseAnimation.stop()
    }
  }, [])

  // 將動畫值轉換為旋轉角度
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  // 根據類型選擇圖標
  const getIconName = () => {
    switch (type) {
      case 'sun':
        return 'weather-sunny'
      case 'cloud':
        return 'weather-cloudy'
      case 'rain':
        return 'weather-pouring'
      case 'standard':
      default:
        return 'loading'
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        {/* 主要圖標 - 會脈動 */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: pulse }],
            },
          ]}
        >
          <Icon name={getIconName()} size={sizeValue} color={indicatorColor} />
        </Animated.View>

        {/* 背景旋轉環 */}
        <Animated.View
          style={[
            styles.ring,
            {
              width: sizeValue * 1.8,
              height: sizeValue * 1.8,
              borderWidth: sizeValue / 15,
              borderColor: `${indicatorColor}15`,
              borderTopColor: indicatorColor,
              transform: [{ rotate: spin }],
            },
          ]}
        />
      </View>

      {message && (
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
  },
  iconContainer: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    borderRadius: 100,
    position: 'absolute',
    zIndex: 1,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
})
