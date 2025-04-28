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

export interface WeatherDetailData extends WeatherData {
  sunrise: number // 日出時間 (UNIX 時間戳)
  sunset: number // 日落時間 (UNIX 時間戳)
  pressure: number // 大氣壓力 (hPa)
  visibility: number // 能見度 (公尺)
  clouds: number // 雲量 (%)
  uvi: number // 紫外線指數
  rain?: { '1h'?: number; '3h'?: number } // 降雨量 (mm)
  snow?: { '1h'?: number; '3h'?: number } // 降雪量 (mm)
}

// 獲取指定城市的詳細天氣資料
export const getWeatherDetail = async (
  city: string
): Promise<WeatherDetailData> => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}&lang=zh_tw`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return formatDetailWeatherData(data)
  } catch (error) {
    console.error('獲取天氣詳情時出錯:', error)
    throw error
  }
}

// 格式化詳細天氣資料
const formatDetailWeatherData = (data: any): WeatherDetailData => {
  return {
    ...formatWeatherData(data), // 包含基本數據
    sunrise: data.sys.sunrise,
    sunset: data.sys.sunset,
    pressure: data.main.pressure,
    visibility: data.visibility,
    clouds: data.clouds.all,
    uvi: data.uvi || 0, // 某些API響應可能不包含此字段
    rain: data.rain || {},
    snow: data.snow || {},
  }
}

// 定義預報資料介面
export interface ForecastData {
  list: ForecastItem[]
  city: {
    name: string
    country: string
  }
}

export interface ForecastItem {
  dt: number // 時間戳 (Unix timestamp)
  main: {
    temp: number // 溫度
    feels_like: number // 體感溫度
    temp_min: number // 最低溫度
    temp_max: number // 最高溫度
    humidity: number // 濕度
    pressure: number // 氣壓
  }
  weather: [
    {
      description: string // 天氣描述
      icon: string // 天氣圖標代碼
    }
  ]
  wind: {
    speed: number // 風速
  }
  clouds: {
    all: number // 雲量 (%)
  }
  pop: number // 降水機率
  rain?: {
    '3h'?: number // 3小時降雨量
  }
  dt_txt: string // 日期時間文字格式
}

// 獲取城市未來5天預報
export const getForecastByCity = async (
  city: string
): Promise<ForecastData> => {
  try {
    const encodedCity = encodeURIComponent(city)
    const url = `${BASE_URL}/forecast?q=${encodedCity}&units=metric&appid=${API_KEY}&lang=zh_tw`
    console.log('Forecast 請求 URL:', url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log(
      'Forecast 回應資料 (部分):',
      JSON.stringify(data).substring(0, 200) + '...'
    )

    return data
  } catch (error) {
    console.error('獲取天氣預報時出錯:', error)
    throw error
  }
}
