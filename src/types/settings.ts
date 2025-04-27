// 溫度單位選項
export enum TemperatureUnit {
  CELSIUS = 'celsius',
  FAHRENHEIT = 'fahrenheit',
}

// 預設城市選項 (可以擴展)
export interface City {
  id: string
  name: string
  country: string
}

// 所有可用的預設城市
export const AVAILABLE_CITIES: City[] = [
  { id: 'taipei', name: 'Taipei', country: 'TW' },
  { id: 'tokyo', name: 'Tokyo', country: 'JP' },
  { id: 'new_york', name: 'New York', country: 'US' },
  { id: 'london', name: 'London', country: 'GB' },
  { id: 'sydney', name: 'Sydney', country: 'AU' },
]

// 設定結構
export interface AppSettings {
  defaultCity: City
  temperatureUnit: TemperatureUnit
  useCurrentLocationByDefault: boolean
}

// 預設設定
export const DEFAULT_SETTINGS: AppSettings = {
  defaultCity: AVAILABLE_CITIES[0], // Taipei
  temperatureUnit: TemperatureUnit.CELSIUS,
  useCurrentLocationByDefault: false,
}
