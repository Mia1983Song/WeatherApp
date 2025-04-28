import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { HomeStackParamList } from '../navigation/HomeStack'
import {
  scale,
  responsiveFontSize,
  isSmallDevice,
  isLargeDevice,
  useDimensions,
} from '../utils/responsive'
import { getWeatherDetail, WeatherDetailData } from '../api/weatherApi'
import { useSettings } from '../contexts/SettingsContext'
import { TemperatureUnit } from '../types/settings'

type WeatherDetailRouteProp = RouteProp<HomeStackParamList, 'WeatherDetail'>

export default function WeatherDetailScreen() {
  // 讀取路由參數
  const routeProp = useRoute<WeatherDetailRouteProp>()
  const { cityId, cityName } = routeProp.params

  // 狀態管理
  const [detailData, setDetailData] = useState<WeatherDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 獲取設定
  const { settings } = useSettings()

  // 獲取螢幕尺寸信息
  const dimensions = useDimensions()
  const isLandscape = dimensions.window.width > dimensions.window.height

  // 獲取詳細資料
  useEffect(() => {
    const fetchDetailData = async () => {
      setLoading(true)
      try {
        const data = await getWeatherDetail(cityName)
        setDetailData(data)
        setError(null)
      } catch (err) {
        console.error('獲取詳細資料失敗:', err)
        setError('無法獲取天氣詳情，請稍後再試')
      } finally {
        setLoading(false)
      }
    }

    fetchDetailData()
  }, [cityId])

  // 格式化時間
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 根據溫度單位轉換溫度
  const formatTemperature = (celsius: number) => {
    if (settings.temperatureUnit === TemperatureUnit.FAHRENHEIT) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`
    }
    return `${Math.round(celsius)}°C`
  }

  // 取得 UV 指數描述
  const getUVIDescription = (uvi: number) => {
    if (uvi <= 2) return '低 (無危險)'
    if (uvi <= 5) return '中等 (需要防護)'
    if (uvi <= 7) return '高 (需要加強防護)'
    if (uvi <= 10) return '非常高 (需要額外防護)'
    return '極端 (避免外出)'
  }

  // 載入中顯示
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#007AFF' />
        <Text style={styles.loadingText}>載入天氣詳情中...</Text>
      </View>
    )
  }

  // 錯誤顯示
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  // 無資料
  if (!detailData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>無法取得天氣詳情</Text>
      </View>
    )
  }

  // 構建詳情項目
  const detailItems = [
    {
      label: '日出時間',
      value: formatTime(detailData.sunrise),
      icon: '🌅',
    },
    {
      label: '日落時間',
      value: formatTime(detailData.sunset),
      icon: '🌇',
    },
    {
      label: '溫度',
      value: `${formatTemperature(
        detailData.temperature
      )} (體感 ${formatTemperature(detailData.feelsLike)})`,
      icon: '🌡️',
    },
    {
      label: '濕度',
      value: `${detailData.humidity}%`,
      icon: '💧',
    },
    {
      label: '大氣壓力',
      value: `${detailData.pressure} hPa`,
      icon: '🔄',
    },
    {
      label: '能見度',
      value: `${detailData.visibility / 1000} 公里`,
      icon: '👁️',
    },
    {
      label: '雲量',
      value: `${detailData.clouds}%`,
      icon: '☁️',
    },
    {
      label: '風速',
      value: `${detailData.windSpeed} m/s`,
      icon: '💨',
    },
    {
      label: '紫外線指數',
      value: `${detailData.uvi} (${getUVIDescription(detailData.uvi)})`,
      icon: '☀️',
    },
    // 條件性增加降雨/降雪數據
    ...(detailData.rain && detailData.rain['1h']
      ? [
          {
            label: '過去1小時降雨量',
            value: `${detailData.rain['1h']} mm`,
            icon: '🌧️',
          },
        ]
      : []),
    ...(detailData.snow && detailData.snow['1h']
      ? [
          {
            label: '過去1小時降雪量',
            value: `${detailData.snow['1h']} mm`,
            icon: '❄️',
          },
        ]
      : []),
  ]

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingHorizontal: scale(isSmallDevice ? 12 : 16) },
      ]}
    >
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            { fontSize: responsiveFontSize(isSmallDevice ? 22 : 24) },
          ]}
        >
          {cityName} 天氣詳情
        </Text>

        <View style={styles.mainInfoContainer}>
          <Text style={styles.condition}>{detailData.description}</Text>
          <Text style={styles.mainTemp}>
            {formatTemperature(detailData.temperature)}
          </Text>
        </View>

        {/* 根據屏幕方向調整詳情區域的佈局 */}
        <View
          style={[
            styles.detailsContainer,
            isLandscape && {
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            },
          ]}
        >
          {detailItems.map((item, index) => (
            <View
              key={index}
              style={[
                styles.detailCard,
                isLandscape && {
                  width: isLargeDevice ? '30%' : '45%',
                  marginHorizontal: scale(8),
                },
              ]}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.note}>
          資料最後更新時間:{' '}
          {new Date().toLocaleDateString('zh-TW', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingVertical: scale(16),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: scale(12),
    fontSize: responsiveFontSize(16),
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: scale(20),
  },
  errorText: {
    fontSize: responsiveFontSize(16),
    color: '#d32f2f',
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: scale(20),
    textAlign: 'center',
    color: '#212121',
  },
  mainInfoContainer: {
    alignItems: 'center',
    marginBottom: scale(20),
  },
  condition: {
    fontSize: responsiveFontSize(18),
    color: '#424242',
    marginBottom: scale(8),
  },
  mainTemp: {
    fontSize: responsiveFontSize(42),
    fontWeight: 'bold',
    color: '#212121',
  },
  detailsContainer: {
    width: '100%',
    marginTop: scale(10),
    marginBottom: scale(20),
  },
  detailCard: {
    backgroundColor: 'white',
    padding: scale(16),
    borderRadius: scale(12),
    marginBottom: scale(12),
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: scale(12),
  },
  icon: {
    fontSize: responsiveFontSize(24),
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: responsiveFontSize(14),
    color: '#757575',
    marginBottom: scale(4),
  },
  detailValue: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#212121',
  },
  note: {
    marginTop: scale(10),
    color: '#757575',
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
  },
})
