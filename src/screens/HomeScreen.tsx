import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  getWeatherByCity,
  getWeatherByCoords,
  WeatherData,
} from '../api/weatherApi'
import WeatherCard from '../components/WeatherCard'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { HomeStackParamList } from '../navigation/HomeStack'
import useLocation from '../hooks/useLocation'
import { useSettings } from '../contexts/SettingsContext'
import { TemperatureUnit } from '../types/settings'

// 定義導航 props 類型
type HomeScreenNavigationProp = NavigationProp<HomeStackParamList, 'Home'>

export default function HomeScreen() {
  // 基本狀態
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 獲取設定
  const { settings } = useSettings()

  // 位置相關狀態 - 使用設定中的預設值
  const [usingCurrentLocation, setUsingCurrentLocation] = useState<boolean>(
    settings.useCurrentLocationByDefault
  )

  // 使用位置 Hook - 根據設定決定是否自動請求
  const {
    location,
    loading: locationLoading,
    error: locationError,
    requestLocation,
  } = useLocation(settings.useCurrentLocationByDefault)

  // 獲取導航對象
  const navigation = useNavigation<HomeScreenNavigationProp>()

  // 元件掛載時檢查設定
  useEffect(() => {
    // 當設定變更時，更新位置使用模式
    setUsingCurrentLocation(settings.useCurrentLocationByDefault)
  }, [settings.useCurrentLocationByDefault])

  // 當位置狀態或設定變更時獲取天氣資料
  useEffect(() => {
    fetchData()

    return () => {
      // 清理工作（如果需要）
    }
  }, [
    location,
    usingCurrentLocation,
    settings.defaultCity,
    settings.temperatureUnit,
  ])

  // 攝氏轉華氏的輔助函數
  const celsiusToFahrenheit = (celsius: number): number => {
    return Math.round((celsius * 9) / 5 + 32)
  }

  // 資料獲取函數
  const fetchData = async () => {
    //if (loading) return // 避免重複請求

    setLoading(true)
    setError(null)

    try {
      let data

      if (location && usingCurrentLocation) {
        // 使用當前位置獲取天氣資料
        console.log(
          `使用當前位置獲取天氣：${location.latitude}, ${location.longitude}`
        )
        data = await getWeatherByCoords(location.latitude, location.longitude)
      } else {
        // 使用預設城市
        const cityName = settings.defaultCity.name
        console.log(`使用預設城市獲取天氣：${cityName}`)
        data = await getWeatherByCity(cityName)
      }

      // 轉換溫度單位（如果需要）
      if (settings.temperatureUnit === TemperatureUnit.FAHRENHEIT && data) {
        // 轉換溫度單位
        data.temperature = celsiusToFahrenheit(data.temperature)
        data.feelsLike = celsiusToFahrenheit(data.feelsLike)
        // 設定單位標記
        data.temperatureUnit = '°F'
      } else if (data) {
        data.temperatureUnit = '°C'
      }

      if (data) {
        setWeatherData(data)
      } else {
        setError('獲取天氣資料失敗')
      }
    } catch (e) {
      console.error('獲取天氣資料出錯:', e)
      setError('無法讀取天氣資料')
    } finally {
      setLoading(false)
    }
  }

  // 切換位置模式
  const toggleLocationMode = () => {
    if (!usingCurrentLocation) {
      if (location) {
        setUsingCurrentLocation(true)
      } else if (locationError) {
        Alert.alert(
          '位置服務錯誤',
          `無法獲取您的位置：${locationError}\n要再試一次嗎？`,
          [
            { text: '取消', style: 'cancel' },
            {
              text: '再試一次',
              onPress: () => {
                requestLocation()
                setUsingCurrentLocation(true)
              },
            },
          ]
        )
      } else {
        requestLocation()
        setUsingCurrentLocation(true)
      }
    } else {
      setUsingCurrentLocation(false)
    }
  }

  // 跳轉到詳情頁面
  const handleViewDetails = () => {
    if (weatherData) {
      navigation.navigate('WeatherDetail', {
        cityId: weatherData.city.toLowerCase(),
        cityName: weatherData.city,
      })
    }
  }

  // 跳轉到預報頁面
  const handleViewForecast = () => {
    if (weatherData) {
      navigation.navigate('Forecast', {
        cityId: weatherData.city.toLowerCase(),
        cityName: weatherData.city,
      })
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>天氣資訊</Text>

      {/* 位置切換按鈕 */}
      <TouchableOpacity
        style={styles.locationButton}
        onPress={toggleLocationMode}
      >
        <Text>{usingCurrentLocation ? '使用當前位置' : '使用預設城市'}</Text>
      </TouchableOpacity>

      {/* 顯示當前使用的預設城市 */}
      {!usingCurrentLocation && (
        <Text style={styles.cityInfo}>
          預設城市: {settings.defaultCity.name}, {settings.defaultCity.country}
        </Text>
      )}

      {/* 載入中提示 */}
      {(loading || (locationLoading && usingCurrentLocation)) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#007AFF' />
          <Text>
            {locationLoading && usingCurrentLocation
              ? '正在取得位置...'
              : '載入天氣資料...'}
          </Text>
        </View>
      )}

      {/* 錯誤提示 */}
      {(error || (locationError && usingCurrentLocation)) &&
        !loading &&
        !locationLoading && (
          <View>
            <Text style={styles.error}>
              {usingCurrentLocation && locationError ? locationError : error}
            </Text>
            <TouchableOpacity onPress={fetchData}>
              <Text>重試</Text>
            </TouchableOpacity>
          </View>
        )}

      {/* 天氣卡片 - 傳遞溫度單位 */}
      {weatherData && !loading && !locationLoading && (
        <WeatherCard
          weatherData={weatherData}
          temperatureUnit={
            settings.temperatureUnit === TemperatureUnit.CELSIUS ? '°C' : '°F'
          }
        />
      )}

      {/* 詳情和預報按鈕 */}
      {weatherData && !loading && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
            <Text style={styles.buttonText}>查看詳細資訊</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleViewForecast}>
            <Text style={styles.buttonText}>查看未來預報</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

// 保留原有樣式，僅添加必要的新樣式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  locationButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
  },
  cityInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
})
