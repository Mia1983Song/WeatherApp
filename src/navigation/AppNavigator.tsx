import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

// 定義每個 Tab 對應的參數型別
export type RootTabParamList = {
    Home: undefined;
    Search: undefined;
    Settings: undefined;
};

// 建立 Tab 實例
const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Search') {
                            iconName = focused ? 'search' : 'search-outline';
                        } else if (route.name === 'Settings') {
                            iconName = focused ? 'settings' : 'settings-outline';
                        }

                        // 確保 iconName 不為 undefined
                        return <Icon name={iconName || 'help-circle'} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#5091e6',
                    tabBarInactiveTintColor: 'gray',
                })}
            >
                {/* 各個分頁 */}
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: '首頁' }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    options={{ title: '搜尋' }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ title: '設定' }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
