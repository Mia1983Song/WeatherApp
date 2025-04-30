import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import { getWeatherByCity, WeatherData } from '../api/weatherApi'
import WeatherCard from '../components/WeatherCard'
import SearchBar from '../components/SearchBar'
import StatusDisplay from '../components/common/StatusDisplay'
import { useSettings } from '../contexts/SettingsContext'
import { applyTemperatureUnit } from '../utils/temperatureUtils'

export default function SearchScreen() {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { settings } = useSettings()

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('請輸入城市名稱')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log(`開始搜尋城市天氣: ${city}`)
      const data = await getWeatherByCity(city.trim())

      if (data) {
        // 處理溫度單位轉換
        const processedData = applyTemperatureUnit(
          data,
          settings.temperatureUnit
        )

        setWeatherData(processedData)
        Keyboard.dismiss() // 成功搜尋後收起鍵盤
        console.log(`成功獲取 ${city} 的天氣資料`)
      } else {
        setError('查無此城市的天氣資料')
        setWeatherData(null)
      }
    } catch (e) {
      console.error('搜尋失敗:', e)
      let errorMessage = '搜尋失敗，請稍後再試'

      if (e instanceof Error) {
        if (e.message.includes('network') || e.message.includes('Network')) {
          errorMessage = '網路連線錯誤，請檢查網路設定'
        } else if (e.message.includes('404')) {
          errorMessage = '找不到該城市，請檢查拼寫'
        }
      }

      setError(errorMessage)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    if (city.trim()) {
      handleSearch()
    } else {
      setCity('')
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Text style={styles.title}>搜尋城市天氣</Text>

      {/* 使用 SearchBar 元件，完全符合其介面定義 */}
      <SearchBar
        value={city}
        onChangeText={setCity}
        onSubmit={handleSearch}
        loading={loading}
      />

      {/* 使用狀態顯示元件 */}
      <StatusDisplay
        isLoading={loading}
        error={error}
        loadingMessage='正在獲取天氣資料...'
        onRetry={handleRetry}
        retryText='重試'
      />

      {/* 天氣資料內容 */}
      {!loading && !error && weatherData && (
        <View style={styles.weatherContainer}>
          <WeatherCard
            weatherData={weatherData}
            temperatureUnit={weatherData.temperatureUnit}
          />

          <TouchableOpacity
            style={styles.newSearchButton}
            onPress={() => {
              setCity('')
              setWeatherData(null)
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.newSearchButtonText}>搜尋其他城市</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  weatherContainer: {
    flex: 1,
    marginTop: 16,
    alignItems: 'center',
  },
  newSearchButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0066cc',
    borderRadius: 8,
  },
  newSearchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})
