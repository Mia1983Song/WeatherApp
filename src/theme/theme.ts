import { DefaultTheme, DarkTheme } from '@react-navigation/native'

// 主題類型
export type ThemeType = 'light' | 'dark' | 'system'

// 淺色主題 - 擴展 DefaultTheme
export const lightTheme = {
  ...DefaultTheme,
  // 自定義屬性
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
    },
  },
}

// 深色主題 - 擴展 DarkTheme
export const darkTheme = {
  ...DarkTheme,
  // 自定義屬性
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  textVariants: {
    header: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
    },
  },
}

// 為 TypeScript 提供自定義主題的類型
export type AppTheme = typeof lightTheme
