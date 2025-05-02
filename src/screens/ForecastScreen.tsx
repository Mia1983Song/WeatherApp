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
import { useTheme } from '../contexts/ThemeContext'
import { TemperatureUnit } from '../types/settings'
import StatusDisplay from '../components/common/StatusDisplay'
import FadeIn from '../components/animations/FadeIn'
import SlideIn from '../components/animations/SlideIn'

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
  const { theme } = useTheme() // 使用主題

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
        {
          paddingHorizontal: scale(isSmallDevice ? 12 : 16),
          backgroundColor: theme.colors.background, // 使用主題背景色
        },
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
        <FadeIn duration={600}>
          <View style={styles.container}>
            {/* 標題 - 使用 SlideIn 從上滑入 */}
            <SlideIn direction='down' distance={30} duration={800} delay={100}>
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: responsiveFontSize(isSmallDevice ? 22 : 24),
                    color: theme.colors.text,
                  },
                ]}
              >
                {cityName} 5天預報
              </Text>
            </SlideIn>

            {/* 日期選擇器 - 使用 SlideIn 從左滑入 */}
            <SlideIn direction='left' distance={50} duration={800} delay={300}>
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
                      {
                        backgroundColor:
                          selectedDay === index
                            ? theme.colors.primary
                            : theme.colors.card,
                        borderColor:
                          selectedDay === index
                            ? theme.colors.primary
                            : theme.colors.border,
                      },
                    ]}
                    onPress={() => setSelectedDay(index)}
                  >
                    <Text
                      style={[
                        styles.daySelectorText,
                        {
                          color:
                            selectedDay === index
                              ? 'white'
                              : theme.colors.text + '99',
                        },
                      ]}
                    >
                      {day.displayDate}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </SlideIn>

            {/* 選定日期的詳細預報 - 使用 SlideIn 從右滑入 */}
            {dailyForecasts[selectedDay] && (
              <SlideIn
                direction='right'
                distance={100}
                duration={800}
                delay={500}
              >
                <View
                  style={[
                    styles.forecastDetail,
                    {
                      backgroundColor: theme.colors.card,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.header,
                      { borderBottomColor: theme.colors.border },
                    ]}
                  >
                    <View style={styles.weatherIconContainer}>
                      <Icon
                        name={getWeatherIconName(
                          dailyForecasts[selectedDay].icon
                        )}
                        size={scale(isSmallDevice ? 50 : 60)}
                        color={theme.colors.primary}
                      />
                      <Text
                        style={[
                          styles.weatherDescription,
                          { color: theme.colors.text + '99' },
                        ]}
                      >
                        {dailyForecasts[selectedDay].description}
                      </Text>
                    </View>

                    <View style={styles.temperatureContainer}>
                      <Text
                        style={[styles.maxTemp, { color: theme.colors.text }]}
                      >
                        {dailyForecasts[selectedDay].maxTemp}
                        {dailyForecasts[selectedDay].temperatureUnit}
                      </Text>
                      <Text
                        style={[
                          styles.minTemp,
                          { color: theme.colors.text + '99' },
                        ]}
                      >
                        {dailyForecasts[selectedDay].minTemp}
                        {dailyForecasts[selectedDay].temperatureUnit}
                      </Text>
                    </View>
                  </View>

                  {/* 主要天氣詳情 - 使用 FadeIn 淡入 */}
                  <FadeIn delay={700} duration={800}>
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
                        <Icon
                          name='water-percent'
                          size={scale(24)}
                          color={theme.colors.primary}
                        />
                        <Text
                          style={[
                            styles.detailLabel,
                            { color: theme.colors.text + '99' },
                          ]}
                        >
                          濕度
                        </Text>
                        <Text
                          style={[
                            styles.detailValue,
                            { color: theme.colors.text },
                          ]}
                        >
                          {dailyForecasts[selectedDay].humidity}%
                        </Text>
                      </View>

                      <View style={styles.detailItem}>
                        <Icon
                          name='weather-windy'
                          size={scale(24)}
                          color={theme.colors.primary}
                        />
                        <Text
                          style={[
                            styles.detailLabel,
                            { color: theme.colors.text + '99' },
                          ]}
                        >
                          風速
                        </Text>
                        <Text
                          style={[
                            styles.detailValue,
                            { color: theme.colors.text },
                          ]}
                        >
                          {dailyForecasts[selectedDay].windSpeed} m/s
                        </Text>
                      </View>

                      <View style={styles.detailItem}>
                        <Icon
                          name='weather-pouring'
                          size={scale(24)}
                          color={theme.colors.primary}
                        />
                        <Text
                          style={[
                            styles.detailLabel,
                            { color: theme.colors.text + '99' },
                          ]}
                        >
                          降雨機率
                        </Text>
                        <Text
                          style={[
                            styles.detailValue,
                            { color: theme.colors.text },
                          ]}
                        >
                          {dailyForecasts[selectedDay].pop}%
                        </Text>
                      </View>
                    </View>
                  </FadeIn>

                  {/* 小時預報 - 使用 SlideIn 從左滑入 */}
                  <SlideIn
                    direction='left'
                    distance={70}
                    duration={800}
                    delay={900}
                  >
                    <View
                      style={[
                        styles.hourlyContainer,
                        { borderTopColor: theme.colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.sectionTitle,
                          {
                            color: theme.colors.text,
                            borderLeftColor: theme.colors.primary,
                          },
                        ]}
                      >
                        小時預報
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.hourlyScroll}
                      >
                        {dailyForecasts[selectedDay].items.map(
                          (hourData, index) => (
                            <FadeIn
                              key={index}
                              delay={900 + index * 50}
                              duration={500}
                            >
                              <View style={styles.hourlyItem}>
                                <Text
                                  style={[
                                    styles.hourlyTime,
                                    { color: theme.colors.text + '99' },
                                  ]}
                                >
                                  {formatTime(hourData.dt_txt)}
                                </Text>
                                <Icon
                                  name={getWeatherIconName(
                                    hourData.weather[0].icon
                                  )}
                                  size={scale(isSmallDevice ? 18 : 20)}
                                  color={theme.colors.primary}
                                />
                                <Text
                                  style={[
                                    styles.hourlyTemp,
                                    { color: theme.colors.text },
                                  ]}
                                >
                                  {Math.round(hourData.main.temp)}
                                  {dailyForecasts[selectedDay].temperatureUnit}
                                </Text>
                                <View style={styles.hourlyPop}>
                                  <Icon
                                    name='water'
                                    size={scale(isSmallDevice ? 10 : 12)}
                                    color={
                                      hourData.pop > 0
                                        ? theme.colors.primary
                                        : theme.colors.border
                                    }
                                  />
                                  <Text
                                    style={[
                                      styles.hourlyPopText,
                                      {
                                        color:
                                          hourData.pop > 0
                                            ? theme.colors.primary
                                            : theme.colors.border,
                                      },
                                    ]}
                                  >
                                    {Math.round(hourData.pop * 100)}%
                                  </Text>
                                </View>
                              </View>
                            </FadeIn>
                          )
                        )}
                      </ScrollView>
                    </View>
                  </SlideIn>

                  {/* 天氣資料說明 - 使用 FadeIn 淡入 */}
                  <FadeIn delay={1100} duration={800}>
                    <View
                      style={[
                        styles.infoContainer,
                        { borderTopColor: theme.colors.border },
                      ]}
                    >
                      <View style={styles.infoItem}>
                        <Text
                          style={[
                            styles.infoLabel,
                            { color: theme.colors.text + '99' },
                          ]}
                        >
                          資料來源
                        </Text>
                        <Text
                          style={[
                            styles.infoValue,
                            { color: theme.colors.text },
                          ]}
                        >
                          OpenWeatherMap API
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text
                          style={[
                            styles.infoLabel,
                            { color: theme.colors.text + '99' },
                          ]}
                        >
                          更新時間
                        </Text>
                        <Text
                          style={[
                            styles.infoValue,
                            { color: theme.colors.text },
                          ]}
                        >
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
                  </FadeIn>
                </View>
              </SlideIn>
            )}
          </View>
        </FadeIn>
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
    paddingVertical: scale(16),
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scale(20),
  },
  daySelector: {
    flexDirection: 'row',
    paddingVertical: scale(10),
    marginBottom: scale(20),
  },
  daySelectorItem: {
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    marginRight: scale(10),
    borderWidth: 1,
  },
  daySelectorText: {
    fontSize: responsiveFontSize(14),
  },
  forecastDetail: {
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
  },
  weatherIconContainer: {
    alignItems: 'center',
  },
  weatherDescription: {
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
  },
  minTemp: {
    fontSize: responsiveFontSize(18),
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
    fontSize: responsiveFontSize(12),
    marginTop: scale(4),
  },
  detailValue: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(16),
    marginTop: scale(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: '600',
    marginBottom: scale(10),
    borderLeftWidth: 3,
    paddingLeft: scale(8),
  },
  hourlyContainer: {
    marginTop: scale(16),
    paddingTop: scale(16),
    borderTopWidth: 1,
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
    fontSize: responsiveFontSize(12),
    marginBottom: scale(6),
  },
  hourlyTemp: {
    fontWeight: 'bold',
    fontSize: responsiveFontSize(14),
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
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(4),
  },
  infoLabel: {
    fontSize: responsiveFontSize(12),
  },
  infoValue: {
    fontSize: responsiveFontSize(12),
  },
})
