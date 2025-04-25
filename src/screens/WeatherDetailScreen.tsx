import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RouteProp, useRoute } from '@react-navigation/native'
import { HomeStackParamList } from '../navigation/HomeStack'

type WeatherDetailRouteProp = RouteProp<HomeStackParamList, 'WeatherDetail'>;

export default function WeatherDetailScreen() {
    // 讀取路由參數
    const routeProp = useRoute<WeatherDetailRouteProp>();
    const { cityId, cityName } = routeProp.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>天氣詳情頁面</Text>
            <Text style={styles.text}>城市 ID: {cityId}</Text>
            <Text style={styles.text}>城市名稱: {cityName}</Text>

            {/* 實際應用中會根據這些參數獲取更多資料 */}
            <Text style={styles.note}>More Data</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
    },
    note: {
        marginTop: 30,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
})