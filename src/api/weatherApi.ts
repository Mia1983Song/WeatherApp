// 定義天氣資料的介面
export interface WeatherData {
  city: string
  country: string
  temperature: number
  description: string
  icon: string
  feelsLike: number
  humidity: number
  windSpeed: number
  date: string
  temperatureUnit?: string // 新增的溫度單位屬性
}

const API_KEY = 'b2efd7a5092f6c6d0ca57d9f0c3813a1'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// 根據城市名稱獲取天氣資料
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}&lang=zh_tw`
    )

    // 檢查回應狀態
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)

    return formatWeatherData(data)
  } catch (error) {
    console.error('獲取城市天氣時出錯:', error)
    throw error
  }
}

// 根據經緯度獲取天氣資料
export const getWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=zh_tw`
    )

    // 檢查回應狀態
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)

    return formatWeatherData(data)
  } catch (error) {
    console.error('獲取位置天氣時出錯:', error)
    throw error
  }
}

// 格式化 API 返回的數據
const formatWeatherData = (data: any): WeatherData => {
  return {
    city: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    date: new Date(data.dt * 1000).toLocaleDateString('zh-TW'),
  }
}
