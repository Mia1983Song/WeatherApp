import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
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
import { applyTemperatureUnit } from '../utils/temperatureUtils'
import StatusDisplay from '../components/common/StatusDisplay'

type WeatherDetailRouteProp = RouteProp<HomeStackParamList, 'WeatherDetail'>

export default function WeatherDetailScreen() {
  // 讀取路由參數
  const routeProp = useRoute<WeatherDetailRouteProp>()
  const { cityId, cityName } = routeProp.params

  // 狀態管理
  const [detailData, setDetailData] = useState<WeatherDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // 獲取設定
  const { settings } = useSettings()

  // 獲取螢幕尺寸信息
  const dimensions = useDimensions()
  const isLandscape = dimensions.window.width > dimensions.window.height

  // 獲取詳細資料
  const fetchDetailData = async () => {
    setLoading(true)
    try {
      const data = await getWeatherDetail(cityName)
      // 使用 applyTemperatureUnit 處理溫度單位
      const processedData = applyTemperatureUnit(data, settings.temperatureUnit)
      setDetailData(processedData)
      setError(null)
    } catch (err) {
      console.error('獲取詳細資料失敗:', err)
      setError('無法獲取天氣詳情，請稍後再試')
    } finally {
      setLoading(false)
      setRefreshing(false) // 重設重新整理狀態
    }
  }

  useEffect(() => {
    fetchDetailData()
  }, [cityId, settings.temperatureUnit])

  // 處理下拉重新整理
  const onRefresh = () => {
    setRefreshing(true)
    fetchDetailData()
  }

  // 格式化時間
  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 取得 UV 指數描述
  const getUVIDescription = (uvi: number) => {
    if (uvi <= 2) return '低 (無危險)'
    if (uvi <= 5) return '中等 (需要防護)'
    if (uvi <= 7) return '高 (需要加強防護)'
    if (uvi <= 10) return '非常高 (需要額外防護)'
    return '極端 (避免外出)'
  }

  // 構建詳情項目函數 (只有在資料存在時調用)
  const buildDetailItems = (data: WeatherDetailData) => [
    {
      label: '日出時間',
      value: formatTime(data.sunrise),
      icon: '🌅',
    },
    {
      label: '日落時間',
      value: formatTime(data.sunset),
      icon: '🌇',
    },
    {
      label: '溫度',
      value: `${data.temperature}${data.temperatureUnit} (體感 ${data.feelsLike}${data.temperatureUnit})`,
      icon: '🌡️',
    },
    {
      label: '濕度',
      value: `${data.humidity}%`,
      icon: '💧',
    },
    {
      label: '大氣壓力',
      value: `${data.pressure} hPa`,
      icon: '🔄',
    },
    {
      label: '能見度',
      value: `${data.visibility / 1000} 公里`,
      icon: '👁️',
    },
    {
      label: '雲量',
      value: `${data.clouds}%`,
      icon: '☁️',
    },
    {
      label: '風速',
      value: `${data.windSpeed} m/s`,
      icon: '💨',
    },
    {
      label: '紫外線指數',
      value: `${data.uvi} (${getUVIDescription(data.uvi)})`,
      icon: '☀️',
    },
    // 條件性增加降雨/降雪數據
    ...(data.rain && data.rain['1h']
      ? [
          {
            label: '過去1小時降雨量',
            value: `${data.rain['1h']} mm`,
            icon: '🌧️',
          },
        ]
      : []),
    ...(data.snow && data.snow['1h']
      ? [
          {
            label: '過去1小時降雪量',
            value: `${data.snow['1h']} mm`,
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* 使用 StatusDisplay 顯示載入和錯誤狀態 */}
      <StatusDisplay
        isLoading={loading}
        error={error}
        loadingMessage='載入天氣詳情中...'
      />

      {!loading && !error && detailData && (
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
              {detailData.temperature}
              {detailData.temperatureUnit}
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
            {buildDetailItems(detailData).map((item, index) => (
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
      )}
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
