import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  AppSettings,
  DEFAULT_SETTINGS,
  City,
  TemperatureUnit,
} from '../types/settings'

// 定義 Context 的類型
interface SettingsContextType {
  settings: AppSettings
  isLoading: boolean
  setDefaultCity: (city: City) => Promise<void>
  setTemperatureUnit: (unit: TemperatureUnit) => Promise<void>
  setUseCurrentLocationByDefault: (use: boolean) => Promise<void>
}

// 創建 Context
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
)

// AsyncStorage 的 Key
const SETTINGS_STORAGE_KEY = '@WeatherApp:settings'

// Provider 元件
interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 載入設定
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettingsJson = await AsyncStorage.getItem(
          SETTINGS_STORAGE_KEY
        )

        if (storedSettingsJson) {
          const storedSettings = JSON.parse(storedSettingsJson) as AppSettings
          setSettings(storedSettings)
        }
      } catch (error) {
        console.error('載入設定時發生錯誤:', error)
        // 如果發生錯誤，使用預設設定
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // 儲存設定到 AsyncStorage
  const saveSettings = async (newSettings: AppSettings) => {
    try {
      const settingsJson = JSON.stringify(newSettings)
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, settingsJson)
      setSettings(newSettings)
    } catch (error) {
      console.error('儲存設定時發生錯誤:', error)
    }
  }

  // 設定預設城市
  const setDefaultCity = async (city: City) => {
    const newSettings = { ...settings, defaultCity: city }
    await saveSettings(newSettings)
  }

  // 設定溫度單位
  const setTemperatureUnit = async (unit: TemperatureUnit) => {
    const newSettings = { ...settings, temperatureUnit: unit }
    await saveSettings(newSettings)
  }

  // 設定是否預設使用當前位置
  const setUseCurrentLocationByDefault = async (use: boolean) => {
    const newSettings = { ...settings, useCurrentLocationByDefault: use }
    await saveSettings(newSettings)
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        setDefaultCity,
        setTemperatureUnit,
        setUseCurrentLocationByDefault,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

// 自定義 Hook 讓元件能方便地使用 SettingsContext
export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
