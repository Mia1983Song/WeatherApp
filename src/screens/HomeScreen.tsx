import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
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
import { applyTemperatureUnit } from '../utils/temperatureUtils'
import StatusDisplay from '../components/common/StatusDisplay'

// 定義導航 props 類型
type HomeScreenNavigationProp = NavigationProp<HomeStackParamList, 'Home'>

export default function HomeScreen() {
  // 基本狀態
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(true)
  const [weatherError, setWeatherError] = useState<string | null>(null)

  // 獲取設定
  const { settings } = useSettings()

  // 使用位置 Hook - 根據設定決定是否自動請求
  const { location, isLoadingLocation, locationErrorMessage, requestLocation } =
    useLocation(settings.useCurrentLocationByDefault)

  // 位置相關狀態 - 使用設定中的預設值
  const [usingCurrentLocation, setUsingCurrentLocation] = useState<boolean>(
    settings.useCurrentLocationByDefault
  )

  // 獲取導航對象
  const navigation = useNavigation<HomeScreenNavigationProp>()

  // 同步位置使用模式與設定
  useEffect(() => {
    if (usingCurrentLocation !== settings.useCurrentLocationByDefault) {
      console.log('同步位置使用設定：', settings.useCurrentLocationByDefault)
      setUsingCurrentLocation(settings.useCurrentLocationByDefault)
    }
  }, [settings.useCurrentLocationByDefault])

  // 當位置狀態或設定變更時獲取天氣資料
  useEffect(() => {
    console.log('資料相關依賴變更，準備獲取最新天氣')

    // 檢查是否有有效的資料來源
    const canFetchData =
      (usingCurrentLocation && location) || // 位置模式且有位置
      (!usingCurrentLocation && settings.defaultCity.name) // 城市模式且有城市

    if (canFetchData) {
      console.log('開始獲取天氣資料')
      fetchData()
    } else {
      console.log('無有效資料來源，跳過獲取')
    }
  }, [
    location,
    usingCurrentLocation,
    settings.defaultCity.name,
    settings.temperatureUnit,
  ])

  // 資料獲取函數
  const fetchData = async () => {
    setIsLoadingWeather(true)
    setWeatherError(null)

    try {
      let data: WeatherData | null = null

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

      const processedData = applyTemperatureUnit(data, settings.temperatureUnit)
      setWeatherData(processedData)
    } catch (e) {
      console.error('獲取天氣資料出錯:', e)
      setWeatherError('無法讀取天氣資料')
    } finally {
      setIsLoadingWeather(false)
    }
  }

  // 切換位置模式
  const toggleLocationMode = () => {
    if (!usingCurrentLocation) {
      if (location) {
        setUsingCurrentLocation(true)
      } else if (locationErrorMessage) {
        Alert.alert(
          '位置服務錯誤',
          `無法獲取您的位置：${locationErrorMessage}\n要再試一次嗎？`,
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

  // 提取天氣內容顯示為函數
  const renderWeatherContent = () => {
    if (
      !weatherData ||
      isLoadingWeather ||
      (isLoadingLocation && usingCurrentLocation)
    ) {
      return null
    }

    return (
      <>
        <WeatherCard
          weatherData={weatherData}
          temperatureUnit={
            settings.temperatureUnit === TemperatureUnit.CELSIUS ? '°C' : '°F'
          }
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleViewDetails}>
            <Text style={styles.buttonText}>查看詳細資訊</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleViewForecast}>
            <Text style={styles.buttonText}>查看未來預報</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

  // 決定要顯示的錯誤訊息
  const currentError =
    usingCurrentLocation && locationErrorMessage
      ? locationErrorMessage
      : weatherError

  // 計算是否處於載入狀態
  const isLoading =
    isLoadingWeather || (isLoadingLocation && usingCurrentLocation)

  // 決定載入訊息
  const loadingMessage =
    isLoadingLocation && usingCurrentLocation
      ? '正在取得位置...'
      : '載入天氣資料...'

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

      {/* 使用 StatusDisplay 元件顯示載入和錯誤狀態 */}
      <StatusDisplay
        isLoading={isLoading}
        error={currentError}
        loadingMessage={loadingMessage}
        onRetry={fetchData}
      />

      {/* 顯示天氣內容 */}
      {renderWeatherContent()}
    </View>
  )
}

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
