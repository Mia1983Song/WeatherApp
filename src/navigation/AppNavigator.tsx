import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'
import { NavigatorScreenParams } from '@react-navigation/native'

// 引入 HomeStack - 這是一個使用 Stack Navigator 的巢狀導航組件
// 允許在首頁標籤內有多個頁面可以堆疊導航
import HomeStack, { HomeStackParamList } from './HomeStack'
//import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen'
import SettingsScreen from '../screens/SettingsScreen'

// 集中定義導航路由及其所需參數
export type RootTabParamList = {
  // Home 路由現在對應的是一個 Navigator，其內部參數由 HomeStackParamList 定義
  HomeStack: NavigatorScreenParams<HomeStackParamList>
  Search: undefined
  Settings: undefined // undefined 表示這些路由在被導航到時，不需要 任何參數
}

const Tab = createBottomTabNavigator<RootTabParamList>()

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          // 根據路由名稱設定圖示
          // Ionicons 提供了 "filled" 和 "outline" 兩種樣式，可根據選中狀態切換
          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline'
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline'
          }
          return (
            <Icon name={iconName || 'help-circle'} size={size} color={color} />
          )
        },
        tabBarActiveTintColor: '#5091e6', // 選中時的顏色
        tabBarInactiveTintColor: 'gray', // 未選中時的顏色
        // 注意：當 Tab 內還有 Stack 時，通常會隱藏 Tab 的 header 以避免重複顯示標題
        headerShown: route.name !== 'HomeStack',
      })}
    >
      {/* 底部標籤頁定義 */}
      {/* 首頁標籤 - 使用 HomeStack 而不是單一頁面，支持巢狀導航 */}
      <Tab.Screen
        name='HomeStack' // 路由名稱，在導航時使用
        component={HomeStack} // 指向 HomeStack 導航器
        options={{ tabBarLabel: '首頁' }} // 在標籤上顯示的文字
      />
      <Tab.Screen
        name='Search'
        component={SearchScreen}
        options={{ title: '搜尋' }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{ title: '設定' }}
      />
    </Tab.Navigator>
  )
}
