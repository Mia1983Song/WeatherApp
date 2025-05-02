import React, { useEffect, useRef } from 'react'
import { Animated, ViewProps } from 'react-native'

interface ScaleBounceProps extends ViewProps {
  initialScale?: number
  finalScale?: number
  duration?: number
  delay?: number
  tension?: number // 控制彈簧拉力
  friction?: number // 控制彈簧阻力
  useNativeDriver?: boolean
  children: React.ReactNode
}

export default function ScaleBounce({
  initialScale = 0,
  finalScale = 1,
  duration = 500,
  delay = 0,
  tension = 40, // 默認彈簧拉力，值越大彈跳越強
  friction = 7, // 默認阻力，值越小彈跳次數越多
  useNativeDriver = true,
  children,
  style,
  ...props
}: ScaleBounceProps) {
  // 創建縮放動畫值
  const scale = useRef(new Animated.Value(initialScale)).current

  useEffect(() => {
    // 使用 Animated.spring 創建彈性效果
    const animation = Animated.spring(scale, {
      toValue: finalScale,
      tension, // 彈簧拉力
      friction, // 彈簧阻力
      useNativeDriver,
      // 在較舊版本的 RN 中可能需要設置 duration
      // 但在較新版本中，彈簧動畫不使用 duration
    })

    // 延遲後開始動畫
    const timeout = setTimeout(() => {
      animation.start()
    }, delay)

    // 清理功能
    return () => {
      clearTimeout(timeout)
      animation.stop()
    }
  }, [scale, finalScale, tension, friction, delay, useNativeDriver])

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  )
}
