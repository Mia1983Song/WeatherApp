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

interface WeatherCardProps {
  weatherData: WeatherData
  temperatureUnit?: string
}

export default function WeatherCard({
  weatherData,
  temperatureUnit = '°C', // 預設為攝氏度
}: WeatherCardProps) {
  // 獲取當前維度資訊
  const dimensions = useDimensions()
  const { width } = dimensions.window
  const isLandscape = dimensions.window.width > dimensions.window.height

  return (
    <View
      style={[
        styles.card,
        {
          padding: scale(isSmallDevice ? 15 : 20),
          marginHorizontal: scale(isSmallDevice ? 10 : 20),
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text
          style={[
            styles.location,
            { fontSize: responsiveFontSize(isSmallDevice ? 16 : 18) },
          ]}
        >
          {weatherData.city}, {weatherData.country}
        </Text>
        <Text
          style={[
            styles.date,
            { fontSize: responsiveFontSize(isSmallDevice ? 12 : 14) },
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
            { fontSize: responsiveFontSize(isSmallDevice ? 36 : 42) },
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
          { fontSize: responsiveFontSize(isSmallDevice ? 14 : 16) },
        ]}
      >
        {weatherData.description}
      </Text>

      <View
        style={[
          styles.detailsContainer,
          {
            flexDirection: isSmallDevice && !isLandscape ? 'column' : 'row',
            alignItems: isSmallDevice && !isLandscape ? 'stretch' : 'center',
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
          <Text style={styles.detailLabel}>體感溫度</Text>
          <Text style={styles.detailValue}>
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
          <Text style={styles.detailLabel}>濕度</Text>
          <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
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
          <Text style={styles.detailLabel}>風速</Text>
          <Text style={styles.detailValue}>{weatherData.windSpeed} m/s</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
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
    color: '#333',
  },
  date: {
    color: '#666',
  },
  weatherContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperature: {
    fontWeight: 'bold',
    color: '#333',
  },
  weatherIcon: {
    // 尺寸在 JSX 中動態設定
  },
  description: {
    color: '#333',
    textAlign: 'center',
    marginVertical: scale(10),
  },
  detailsContainer: {
    justifyContent: 'space-between',
    marginTop: scale(15),
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: scale(15),
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: responsiveFontSize(12),
    color: '#666',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: '#333',
  },
})
