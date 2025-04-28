import { Dimensions, PixelRatio, ScaledSize } from 'react-native'
import { useState, useEffect } from 'react'

// 獲取螢幕尺寸
export const { width, height } = Dimensions.get('window')

// 裝置尺寸判斷
export const isSmallDevice = width < 375
export const isMediumDevice = width >= 375 && width < 768
export const isLargeDevice = width >= 768

// 方向判斷
export const isPortrait = height > width
export const isLandscape = width > height

// 基準設計尺寸
const baseWidth = 375 // 基於 iPhone X 設計
const baseHeight = 812

// 尺寸縮放函數
export const scale = (size: number) => (width / baseWidth) * size
export const verticalScale = (size: number) => (height / baseHeight) * size
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor

// 字體大小響應處理
export const responsiveFontSize = (size: number) => {
  const newSize = size * (width / baseWidth)
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

// 定義螢幕尺寸變更事件的參數類型
interface DimensionsChangeEvent {
  window: ScaledSize
  screen: ScaledSize
}

// 監聽螢幕尺寸變化 Hook
export function useDimensions() {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  })

  useEffect(() => {
    // 使用明確的參數類型
    const onChange = ({ window, screen }: DimensionsChangeEvent) => {
      setDimensions({ window, screen })
    }

    const subscription = Dimensions.addEventListener('change', onChange)

    return () => subscription.remove()
  }, [])

  return dimensions
}
