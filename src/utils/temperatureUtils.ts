import { WeatherData } from '../api/weatherApi'
import { TemperatureUnit } from '../types/settings'

// 基本溫度轉換函數
export const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9) / 5 + 32)
}

export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return Math.round(((fahrenheit - 32) * 5) / 9)
}

// 擴展函數以支援 WeatherData 和 WeatherDetailData
export function applyTemperatureUnit<T extends WeatherData>(
  data: T | null,
  unit: TemperatureUnit = TemperatureUnit.CELSIUS
): T | null {
  if (!data) return null

  const processedData = { ...data } as T

  if (unit === TemperatureUnit.FAHRENHEIT) {
    processedData.temperature = celsiusToFahrenheit(data.temperature)
    processedData.feelsLike = celsiusToFahrenheit(data.feelsLike)
    processedData.temperatureUnit = '°F'
  } else {
    processedData.temperatureUnit = '°C'
  }

  return processedData
}
