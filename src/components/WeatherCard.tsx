import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { WeatherData } from '../api/weatherApi';

interface WeatherCardProps {
    weatherData: WeatherData
};

export default function WeatherCard({ weatherData }: WeatherCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.headerContainer}>
                <Text style={styles.location}>
                    {weatherData.city}, {weatherData.country}
                </Text>
                <Text style={styles.date}>{weatherData.date}</Text>
            </View>

            <View style={styles.weatherContainer}>
                <Text style={styles.temperature}>{weatherData.temperature}°C</Text>
                <Image
                    style={styles.weatherIcon}
                    source={{
                        uri: `https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`
                    }}
                />
            </View>

            <Text style={styles.description}>{weatherData.description}</Text>

            <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>體感溫度</Text>
                    <Text style={styles.detailValue}>{weatherData.feelsLike}°C</Text>
                </View>

                <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>濕度</Text>
                    <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
                </View>

                <View style={styles.detailItem}>
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
        borderRadius: 20,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    location: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    weatherContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    temperature: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#333',
    },
    weatherIcon: {
        width: 100,
        height: 100,
    },
    description: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
})