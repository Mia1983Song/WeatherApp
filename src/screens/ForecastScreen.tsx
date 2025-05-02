import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { HomeStackParamList } from '../navigation/HomeStack'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  scale,
  responsiveFontSize,
  isSmallDevice,
  isLargeDevice,
  useDimensions,
} from '../utils/responsive'
import {
  getForecastByCity,
  ForecastData,
  ForecastItem,
} from '../api/weatherApi'
import { useSettings } from '../contexts/SettingsContext'
import { TemperatureUnit } from '../types/settings'
import StatusDisplay from '../components/common/StatusDisplay'

type ForecastRouteProp = RouteProp<HomeStackParamList, 'Forecast'>

// 每日摘要預報介面
interface DayForecast {
  date: string // 日期 YYYY-MM-DD
  displayDate: string // 顯示用日期格式
  items: ForecastItem[] // 當天所有預報項目
  maxTemp: number
  minTemp: number
  description: string
  icon: string
  pop: number // 降水機率
  humidity: number
  windSpeed: number
  temperatureUnit: string
}

export default function ForecastScreen() {
  // 路由參數
  const routeProp = useRoute<ForecastRouteProp>()
  const { cityId, cityName } = routeProp.params

  // 狀態管理
  const [forecastData, setForecastData] = useState<ForecastData | null>(null)
  const [dailyForecasts, setDailyForecasts] = useState<DayForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  // 獲取設定
  const { settings } = useSettings()

  // 螢幕尺寸資訊
  const dimensions = useDimensions()
  const isLandscape = dimensions.window.width > dimensions.window.height

  // 獲取預報資料
  const fetchForecastData = async () => {
    setLoading(true)
    try {
      const data = await getForecastByCity(cityName)
      setForecastData(data)

      // 處理每日預報資料
      const dailyData = processDailyForecast(data)
      setDailyForecasts(dailyData)

      setError(null)
    } catch (err) {
      console.error('獲取預報資料失敗:', err)
      setError('無法獲取天氣預報，請稍後再試')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchForecastData()
  }, [cityName, settings.temperatureUnit])

  // 處理下拉重新整理
  const onRefresh = () => {
    setRefreshing(true)
    fetchForecastData()
  }

  // 處理 API 回傳的資料，將其整理為每日預報
  const processDailyForecast = (data: ForecastData): DayForecast[] => {
    if (!data || !data.list) return []

    // 按日期分組
    const dailyMap = new Map<string, ForecastItem[]>()

    data.list.forEach((item) => {
      // 獲取日期（不包含時間）
      const date = item.dt_txt.split(' ')[0]

      if (!dailyMap.has(date)) {
        dailyMap.set(date, [])
      }

      dailyMap.get(date)?.push(item)
    })

    // 處理每日資料
    const processedDailyData: DayForecast[] = []

    dailyMap.forEach((items, date) => {
      // 計算最高溫和最低溫
      const maxTemp = Math.round(
        Math.max(...items.map((item) => item.main.temp_max))
      )
      const minTemp = Math.round(
        Math.min(...items.map((item) => item.main.temp_min))
      )

      // 尋找中午左右的資料作為代表
      const midDayItem =
        items.find((item) => {
          const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0])
          return hour >= 12 && hour <= 14
        }) || items[0] // 如果找不到中午的資料，使用第一筆

      // 計算平均降水機率
      const avgPop =
        items.reduce((acc, item) => acc + item.pop, 0) / items.length

      // 計算平均濕度
      const avgHumidity = Math.round(
        items.reduce((acc, item) => acc + item.main.humidity, 0) / items.length
      )

      // 計算平均風速
      const avgWindSpeed = Number(
        (
          items.reduce((acc, item) => acc + item.wind.speed, 0) / items.length
        ).toFixed(1)
      )

      const displayDate = new Date(date).toLocaleDateString('zh-TW', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })

      processedDailyData.push({
        date,
        displayDate,
        items,
        maxTemp,
        minTemp,
        description: midDayItem.weather[0].description,
        icon: midDayItem.weather[0].icon,
        pop: Math.round(avgPop * 100),
        humidity: avgHumidity,
        windSpeed: avgWindSpeed,
        temperatureUnit:
          settings.temperatureUnit === TemperatureUnit.CELSIUS ? '°C' : '°F',
      })
    })

    return processedDailyData
  }

  // 獲取天氣圖標名稱
  const getWeatherIconName = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      '01d': 'weather-sunny',
      '01n': 'weather-night',
      '02d': 'weather-partly-cloudy',
      '02n': 'weather-night-partly-cloudy',
      '03d': 'weather-cloudy',
      '03n': 'weather-cloudy',
      '04d': 'weather-cloudy',
      '04n': 'weather-cloudy',
      '09d': 'weather-pouring',
      '09n': 'weather-pouring',
      '10d': 'weather-rainy',
      '10n': 'weather-rainy',
      '11d': 'weather-lightning',
      '11n': 'weather-lightning',
      '13d': 'weather-snowy',
      '13n': 'weather-snowy',
      '50d': 'weather-fog',
      '50n': 'weather-fog',
    }

    return iconMap[iconCode] || 'weather-cloudy'
  }

  // 格式化時間
  const formatTime = (dtTxt: string) => {
    const time = dtTxt.split(' ')[1].slice(0, 5)
    return time
  }

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
      <StatusDisplay
        isLoading={loading}
        error={error}
        loadingMessage='載入天氣預報中...'
        onRetry={fetchForecastData}
      />

      {!loading && !error && dailyForecasts.length > 0 && (
        <View style={styles.container}>
          <Text
            style={[
              styles.title,
              { fontSize: responsiveFontSize(isSmallDevice ? 22 : 24) },
            ]}
          >
            {cityName} 5天預報
          </Text>

          {/* 日期選擇器 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
          >
            {dailyForecasts.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.daySelectorItem,
                  selectedDay === index && styles.selectedDayItem,
                ]}
                onPress={() => setSelectedDay(index)}
              >
                <Text
                  style={[
                    styles.daySelectorText,
                    selectedDay === index && styles.selectedDayText,
                  ]}
                >
                  {day.displayDate}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 選定日期的詳細預報 */}
          {dailyForecasts[selectedDay] && (
            <View style={styles.forecastDetail}>
              <View style={styles.header}>
                <View style={styles.weatherIconContainer}>
                  <Icon
                    name={getWeatherIconName(dailyForecasts[selectedDay].icon)}
                    size={scale(isSmallDevice ? 50 : 60)}
                    color='#007AFF' // 使用與 HomeScreen 按鈕相同的藍色
                  />
                  <Text style={styles.weatherDescription}>
                    {dailyForecasts[selectedDay].description}
                  </Text>
                </View>

                <View style={styles.temperatureContainer}>
                  <Text style={styles.maxTemp}>
                    {dailyForecasts[selectedDay].maxTemp}
                    {dailyForecasts[selectedDay].temperatureUnit}
                  </Text>
                  <Text style={styles.minTemp}>
                    {dailyForecasts[selectedDay].minTemp}
                    {dailyForecasts[selectedDay].temperatureUnit}
                  </Text>
                </View>
              </View>

              {/* 主要天氣詳情 */}
              <View
                style={[
                  styles.detailsGrid,
                  isLandscape &&
                    isLargeDevice && {
                      justifyContent: 'flex-start',
                    },
                ]}
              >
                <View style={styles.detailItem}>
                  <Icon name='water-percent' size={scale(24)} color='#007AFF' />
                  <Text style={styles.detailLabel}>濕度</Text>
                  <Text style={styles.detailValue}>
                    {dailyForecasts[selectedDay].humidity}%
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Icon name='weather-windy' size={scale(24)} color='#007AFF' />
                  <Text style={styles.detailLabel}>風速</Text>
                  <Text style={styles.detailValue}>
                    {dailyForecasts[selectedDay].windSpeed} m/s
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Icon
                    name='weather-pouring'
                    size={scale(24)}
                    color='#007AFF'
                  />
                  <Text style={styles.detailLabel}>降雨機率</Text>
                  <Text style={styles.detailValue}>
                    {dailyForecasts[selectedDay].pop}%
                  </Text>
                </View>
              </View>

              {/* 小時預報 */}
              <View style={styles.hourlyContainer}>
                <Text style={styles.sectionTitle}>小時預報</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.hourlyScroll}
                >
                  {dailyForecasts[selectedDay].items.map((hourData, index) => (
                    <View key={index} style={styles.hourlyItem}>
                      <Text style={styles.hourlyTime}>
                        {formatTime(hourData.dt_txt)}
                      </Text>
                      <Icon
                        name={getWeatherIconName(hourData.weather[0].icon)}
                        size={scale(isSmallDevice ? 18 : 20)}
                        color='#007AFF'
                      />
                      <Text style={styles.hourlyTemp}>
                        {Math.round(hourData.main.temp)}
                        {dailyForecasts[selectedDay].temperatureUnit}
                      </Text>
                      <View style={styles.hourlyPop}>
                        <Icon
                          name='water'
                          size={scale(isSmallDevice ? 10 : 12)}
                          color={hourData.pop > 0 ? '#007AFF' : '#d0d0d0'}
                        />
                        <Text
                          style={[
                            styles.hourlyPopText,
                            { color: hourData.pop > 0 ? '#007AFF' : '#d0d0d0' },
                          ]}
                        >
                          {Math.round(hourData.pop * 100)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* 天氣資料說明 */}
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>資料來源</Text>
                  <Text style={styles.infoValue}>OpenWeatherMap API</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>更新時間</Text>
                  <Text style={styles.infoValue}>
                    {new Date().toLocaleString('zh-TW', {
                      hour: '2-digit',
                      minute: '2-digit',
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingVertical: scale(16),
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scale(20),
    color: '#212121',
  },
  daySelector: {
    flexDirection: 'row',
    paddingVertical: scale(10),
    marginBottom: scale(20),
  },
  daySelectorItem: {
    backgroundColor: 'white',
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    marginRight: scale(10),
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDayItem: {
    backgroundColor: '#007AFF', // 使用與 HomeScreen 按鈕相同的藍色
    borderColor: '#007AFF',
  },
  daySelectorText: {
    color: '#757575',
    fontSize: responsiveFontSize(14),
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  forecastDetail: {
    backgroundColor: 'white',
    borderRadius: scale(12),
    padding: scale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(20),
    paddingBottom: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weatherIconContainer: {
    alignItems: 'center',
  },
  weatherDescription: {
    color: '#757575',
    fontSize: responsiveFontSize(14),
    marginTop: scale(8),
    textAlign: 'center',
  },
  temperatureContainer: {
    alignItems: 'flex-end',
  },
  maxTemp: {
    fontSize: responsiveFontSize(32),
    fontWeight: 'bold',
    color: '#212121',
  },
  minTemp: {
    fontSize: responsiveFontSize(18),
    color: '#757575',
    marginTop: scale(4),
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(20),
  },
  detailItem: {
    alignItems: 'center',
    width: '30%',
  },
  detailLabel: {
    color: '#757575',
    fontSize: responsiveFontSize(12),
    marginTop: scale(4),
  },
  detailValue: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(16),
    color: '#212121',
    marginTop: scale(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    color: '#212121',
    marginBottom: scale(10),
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    paddingLeft: scale(8),
  },
  hourlyContainer: {
    marginTop: scale(16),
    paddingTop: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  hourlyScroll: {
    paddingVertical: scale(10),
  },
  hourlyItem: {
    alignItems: 'center',
    marginRight: scale(20),
    width: scale(50),
  },
  hourlyTime: {
    color: '#757575',
    fontSize: responsiveFontSize(12),
    marginBottom: scale(6),
  },
  hourlyTemp: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(14),
    color: '#212121',
    marginTop: scale(6),
  },
  hourlyPop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scale(4),
  },
  hourlyPopText: {
    fontSize: responsiveFontSize(10),
    marginLeft: scale(2),
  },
  infoContainer: {
    marginTop: scale(20),
    paddingTop: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(4),
  },
  infoLabel: {
    color: '#757575',
    fontSize: responsiveFontSize(12),
  },
  infoValue: {
    color: '#212121',
    fontSize: responsiveFontSize(12),
  },
})
