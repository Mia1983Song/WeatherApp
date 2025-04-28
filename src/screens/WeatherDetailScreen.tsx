import { StyleSheet, Text, View, ScrollView } from 'react-native'
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

type WeatherDetailRouteProp = RouteProp<HomeStackParamList, 'WeatherDetail'>

export default function WeatherDetailScreen() {
  // 讀取路由參數
  const routeProp = useRoute<WeatherDetailRouteProp>()
  const { cityId, cityName } = routeProp.params

  // 獲取螢幕尺寸信息
  const dimensions = useDimensions()
  const isLandscape = dimensions.window.width > dimensions.window.height

  // 模擬更多天氣詳情數據
  const detailItems = [
    { label: '日出時間', value: '06:23 AM' },
    { label: '日落時間', value: '18:45 PM' },
    { label: '大氣壓力', value: '1012 hPa' },
    { label: '能見度', value: '10 公里' },
    { label: '雲量', value: '20%' },
    { label: '紫外線指數', value: '中等 (3)' },
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

        <Text
          style={[
            styles.text,
            { fontSize: responsiveFontSize(isSmallDevice ? 16 : 18) },
          ]}
        >
          城市 ID: {cityId}
        </Text>

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
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.note, { fontSize: responsiveFontSize(14) }]}>
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
  title: {
    fontWeight: 'bold',
    marginBottom: scale(20),
    textAlign: 'center',
  },
  text: {
    marginBottom: scale(10),
  },
  detailsContainer: {
    width: '100%',
    marginTop: scale(20),
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
  },
  detailLabel: {
    fontSize: responsiveFontSize(14),
    color: '#666',
    marginBottom: scale(4),
  },
  detailValue: {
    fontSize: responsiveFontSize(18),
    fontWeight: '600',
    color: '#333',
  },
  note: {
    marginTop: scale(10),
    color: '#666',
    textAlign: 'center',
  },
})
