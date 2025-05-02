import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { WeatherData } from '../api/weatherApi'
import {
  scale,
  isSmallDevice,
  isLargeDevice,
  responsiveFontSize,
  useDimensions,
} from '../utils/responsive'
import FadeIn from './animations/FadeIn'
import SlideIn from './animations/SlideIn'
import ScaleBounce from '../components/animations/ScaleBounce'
import { useTheme } from '../contexts/ThemeContext'

interface WeatherCardProps {
  weatherData: WeatherData
  temperatureUnit?: string
  delay?: number
}

export default function WeatherCard({
  weatherData,
  temperatureUnit = '°C', // 預設為攝氏度
  delay = 0,
}: WeatherCardProps) {
  // 獲取當前維度資訊
  const dimensions = useDimensions()
  const { width } = dimensions.window
  const isLandscape = dimensions.window.width > dimensions.window.height

  // 使用主題
  const { theme } = useTheme()

  return (
    <FadeIn duration={700} delay={delay}>
      <SlideIn direction='right' duration={800} delay={delay} distance={80}>
        <ScaleBounce
          initialScale={0.9}
          finalScale={1}
          delay={delay + 200}
          tension={30}
          friction={8}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.card,
                padding: scale(isSmallDevice ? 15 : 20),
                marginHorizontal: scale(isSmallDevice ? 10 : 20),
              },
            ]}
          >
            <View style={styles.headerContainer}>
              <Text
                style={[
                  styles.location,
                  {
                    fontSize: responsiveFontSize(isSmallDevice ? 16 : 18),
                    color: theme.colors.text,
                  },
                ]}
              >
                {weatherData.city}, {weatherData.country}
              </Text>
              <Text
                style={[
                  styles.date,
                  {
                    fontSize: responsiveFontSize(isSmallDevice ? 12 : 14),
                    color: theme.colors.text + '99', // 半透明文字
                  },
                ]}
              >
                {weatherData.date}
              </Text>
            </View>

            {/* 根據屏幕方向調整佈局 */}
            <View
              style={[
                styles.weatherContainer,
                isLandscape && { alignItems: 'flex-start' },
              ]}
            >
              <Text
                style={[
                  styles.temperature,
                  {
                    fontSize: responsiveFontSize(isSmallDevice ? 36 : 42),
                    color: theme.colors.text,
                  },
                ]}
              >
                {weatherData.temperature}
                {temperatureUnit}
              </Text>
              <Image
                style={[
                  styles.weatherIcon,
                  {
                    width: scale(isSmallDevice ? 80 : 100),
                    height: scale(isSmallDevice ? 80 : 100),
                  },
                ]}
                source={{
                  uri: `https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`,
                }}
              />
            </View>

            <Text
              style={[
                styles.description,
                {
                  fontSize: responsiveFontSize(isSmallDevice ? 14 : 16),
                  color: theme.colors.text,
                },
              ]}
            >
              {weatherData.description}
            </Text>

            <View
              style={[
                styles.detailsContainer,
                {
                  flexDirection:
                    isSmallDevice && !isLandscape ? 'column' : 'row',
                  alignItems:
                    isSmallDevice && !isLandscape ? 'stretch' : 'center',
                  borderTopColor: theme.colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.detailItem,
                  isSmallDevice &&
                    !isLandscape && {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.text + '99' },
                  ]}
                >
                  體感溫度
                </Text>
                <Text
                  style={[styles.detailValue, { color: theme.colors.text }]}
                >
                  {weatherData.feelsLike}
                  {temperatureUnit}
                </Text>
              </View>

              <View
                style={[
                  styles.detailItem,
                  isSmallDevice &&
                    !isLandscape && {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                    },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.text + '99' },
                  ]}
                >
                  濕度
                </Text>
                <Text
                  style={[styles.detailValue, { color: theme.colors.text }]}
                >
                  {weatherData.humidity}%
                </Text>
              </View>

              <View
                style={[
                  styles.detailItem,
                  isSmallDevice &&
                    !isLandscape && {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    },
                ]}
              >
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.text + '99' },
                  ]}
                >
                  風速
                </Text>
                <Text
                  style={[styles.detailValue, { color: theme.colors.text }]}
                >
                  {weatherData.windSpeed} m/s
                </Text>
              </View>
            </View>
          </View>
        </ScaleBounce>
      </SlideIn>
    </FadeIn>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: scale(550), // 限制最大寬度，適合平板
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(15),
  },
  location: {
    fontWeight: 'bold',
  },
  date: {
    // 使用主題顏色，樣式在 JSX 中動態設定
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperature: {
    fontWeight: 'bold',
    // 使用主題顏色，樣式在 JSX 中動態設定
  },
  weatherIcon: {
    // 尺寸在 JSX 中動態設定
  },
  description: {
    textAlign: 'center',
    marginVertical: scale(10),
    // 使用主題顏色，樣式在 JSX 中動態設定
  },
  detailsContainer: {
    justifyContent: 'space-between',
    marginTop: scale(15),
    borderTopWidth: 1,
    paddingTop: scale(15),
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: responsiveFontSize(12),
    marginBottom: 5,
    // 使用主題顏色，樣式在 JSX 中動態設定
  },
  detailValue: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    // 使用主題顏色，樣式在 JSX 中動態設定
  },
})
