import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightTheme, darkTheme, ThemeType, AppTheme } from '../theme/theme'

interface ThemeContextType {
  theme: AppTheme
  themeType: ThemeType
  setThemeType: (type: ThemeType) => void
  isDark: boolean
}

// 定義 Provider Props 介面
interface ThemeProviderProps {
  children: ReactNode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme()
  const [themeType, setThemeType] = useState<ThemeType>('system')

  useEffect(() => {
    // 從 AsyncStorage 讀取已儲存的主題設定
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeType')
        if (savedTheme) {
          setThemeType(savedTheme as ThemeType)
        }
      } catch (error) {
        console.error('Failed to load theme', error)
      }
    }

    loadTheme()
  }, [])

  // 當主題變更時儲存到 AsyncStorage
  const handleThemeChange = async (newTheme: ThemeType) => {
    try {
      await AsyncStorage.setItem('themeType', newTheme)
      setThemeType(newTheme)
    } catch (error) {
      console.error('Failed to save theme', error)
    }
  }

  // 決定當前使用的主題
  const getCurrentTheme = (): AppTheme => {
    if (themeType === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme
    }
    return themeType === 'dark' ? darkTheme : lightTheme
  }

  const theme = getCurrentTheme()
  const isDark = theme.dark

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeType,
        setThemeType: handleThemeChange,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// 自定義 Hook 方便在元件中使用
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
