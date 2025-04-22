import {
    StyleSheet,
    Text,
    View,
    Keyboard, // 用於控制和管理行動裝置上的虛擬鍵盤行為
    Platform, // 用於針對不同平台設定不同行為
    KeyboardAvoidingView, // 鍵盤彈出時自動避開輸入區域
    ActivityIndicator, // 資料抓取或搜尋時顯示轉圈圈 Loading 狀態
    TouchableOpacity // 按下時淡出（opacity 降低），釋放時淡入
} from 'react-native';
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

    const handleRetry = () => {
        setError(null);
        setCity('');
    };

    return (
        // KeyboardAvoidingView 用於自動調整畫面位置，避免鍵盤遮擋輸入區域
        // behavior 屬性根據平台(Platform)不同而設定不同的行為模式
        // keyboardVerticalOffset 設定垂直偏移量，考慮到狀態列和標題列的高度
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <Text style={styles.title}>搜尋城市天氣</Text>

            <SearchBar
                value={city}
                onChangeText={setCity}
                onSubmit={handleSearch}
                loading={loading}
            />

            {/* 錯誤訊息顯示區域 */}
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={handleRetry}
                        activeOpacity={0.7} // 設定按下時的透明度
                    >
                        <Text style={styles.retryButtonText}>重試</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 使用條件渲染，顯示載入中狀態或天氣資料 */}
            {loading ? (
                // ActivityIndicator 用於顯示載入中的旋轉圖示
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0066cc" />
                    <Text style={styles.loadingText}>正在獲取天氣資料...</Text>
                </View>
            ) : weatherData ? (
                <View style={styles.weatherContainer}>
                    <WeatherCard weatherData={weatherData} />
                    {/* 使用 TouchableOpacity 提供「搜尋其他城市」按鈕，增加操作便利性 */}
                    <TouchableOpacity
                        style={styles.newSearchButton}
                        onPress={() => {
                            setCity('');
                            setWeatherData(null);
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.newSearchButtonText}>搜尋其他城市</Text>
                    </TouchableOpacity>
                </View>
            ) : null}
        </KeyboardAvoidingView>
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
    errorContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
    error: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
    retryButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#666',
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    weatherContainer: {
        flex: 1,
        marginTop: 16,
        alignItems: 'center',
    },
    newSearchButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#0066cc',
        borderRadius: 8,
    },
    newSearchButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});