import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import WeatherDetailScreen from '../screens/WeatherDetailScreen'
import ForecastScreen from '../screens/ForecastScreen'

// 定義此 Stack 中可用的參數類型
export type HomeStackParamList = {
  Home: undefined
  WeatherDetail: { cityId: string; cityName: string }
  Forecast: { cityId: string; cityName: string }
}

const Stack = createNativeStackNavigator<HomeStackParamList>()

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: true, // 確保 Stack 中的頁面顯示標題欄
        headerStyle: {
          backgroundColor: '#5091e6', // 與 Tab 的活動顏色保持一致
        },
        headerTintColor: '#fff', // 標題文字為白色
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{ title: '今日天氣' }}
      />
      <Stack.Screen
        name='WeatherDetail'
        component={WeatherDetailScreen}
        options={({ route }) => ({
          title: `${route.params.cityName} 詳細資訊`,
        })}
      />
      <Stack.Screen
        name='Forecast'
        component={ForecastScreen}
        options={({ route }) => ({
          title: `${route.params.cityName} 未來預報`,
        })}
      />
    </Stack.Navigator>
  )
}
