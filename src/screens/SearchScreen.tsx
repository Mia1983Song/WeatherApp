import { StyleSheet, Text, View, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { getWeatherByCity, WeatherData } from '../api/weatherApi';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';

export default function SearchScreen() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!city.trim()) {
            setError('請輸入城市名稱');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await getWeatherByCity(city.trim());
            if (data) {
                setWeatherData(data);
                Keyboard.dismiss(); // 成功搜尋後收起鍵盤
            } else {
                setError('查無此城市的天氣資料');
                setWeatherData(null);
            }
        } catch (e) {
            console.error('搜尋失敗:', e);
            setError('搜尋失敗，請稍後再試');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>搜尋城市天氣</Text>

            <SearchBar
                value={city}
                onChangeText={setCity}
                onSubmit={handleSearch}
                loading={loading}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            {weatherData && <WeatherCard weatherData={weatherData} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    error: {
        color: 'red',
        marginTop: 8,
        textAlign: 'center',
    },
});
