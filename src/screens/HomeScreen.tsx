import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getWeatherByCity, WeatherData } from '../api/weatherApi';
import WeatherCard from '../components/WeatherCard';

export default function HomeScreen() {
    // [currentValue, setterFunction] = useState(initValue)
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect 主要用途：
    // 1.Component 初始化 時做某些事（比如從 API 抓資料）
    // 2.特定狀態（State）變更時，觸發副作用（Side Effect）
    // 3.Component 卸載（Unmount）時，清理（Cleanup）資源（例如解除監聽、清除 timer）
    // 第二個參數是依賴陣列，控制重新執行的時機

    // 元件掛載 (componentDidMount)
    useEffect(() => {
        console.log('元件掛載完成');

        fetchData();

        // 元件卸載 (componentWillUnmount)
        return () => {
            console.log('元件即將卸載');
            // 清理訂閱、計時器等資源
        };
    }, []); // 空依賴陣列表示只執行一次

    // 資料更新 (componentDidUpdate)
    useEffect(() => {
        if (weatherData) {
            console.log('資料已更新:', weatherData);
        }
    }, [weatherData]); // 依賴於 weatherData，當 weatherData 變化時執行

    const fetchData = async () => {
        const cityName = 'Taipei';

        try {
            const data = await getWeatherByCity(cityName);
            if (data) {
                setWeatherData(data);
            } else {
                console.log("No Data");
            }
        } catch (e) {
            setError('無法讀取天氣資料');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>首頁</Text>

            {/* Conditional Rendering */}
            {error && <Text style={styles.error}>{error}</Text>}
            {weatherData ? <WeatherCard weatherData={weatherData} /> : null}
        </View>
    );
}

// 樣式
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5'
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    error: {
        color: 'red'
    }
});