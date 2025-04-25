import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'

import HomeScreen from '../screens/HomeScreen'
import SearchScreen from '../screens/SearchScreen'
import SettingsScreen from '../screens/SettingsScreen'

// 集中定義導航路由及其所需參數
export type RootTabParamList = {
  Home: undefined
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
          if (route.name === 'Home') {
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
        // 如果 Tab 內還有 Stack，可能需要隱藏 Tab 的 header
        //headerShown: false,
      })}
    >
      {/* 各個分頁 */}
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{ title: '首頁' }}
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
