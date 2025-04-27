import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service'
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'

// 定義位置座標的類型
export interface LocationCoords {
  latitude: number
  longitude: number
}

// 定義 Hook 返回值的類型
interface UseLocationProps {
  location: LocationCoords | null
  loading: boolean
  error: string | null
  requestLocation: () => Promise<void> // 允許手動觸發定位請求
}

const useLocation = (autoRequest = false): UseLocationProps => {
  const [location, setLocation] = useState<LocationCoords | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // 獲取對應平台的位置權限
  const getLocationPermission = () => {
    return Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      default: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    })
  }

  // 請求位置權限
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const permission = getLocationPermission()
      const permissionStatus = await check(permission)

      switch (permissionStatus) {
        case RESULTS.UNAVAILABLE:
          setError('此裝置不支援位置服務')
          return false

        case RESULTS.DENIED:
          // 用戶尚未決定，請求權限
          const result = await request(permission)
          return result === RESULTS.GRANTED

        case RESULTS.BLOCKED:
          // 用戶已永久拒絕權限
          setError('位置權限已被永久拒絕，請在系統設定中啟用')
          return false

        case RESULTS.GRANTED:
          return true

        default:
          return false
      }
    } catch (err) {
      console.warn('請求權限時發生錯誤:', err)
      setError('請求權限時發生錯誤')
      return false
    }
  }

  // 獲取位置
  const getLocation = async () => {
    setLoading(true)
    setError(null)
    setLocation(null)

    const hasPermission = await requestLocationPermission()

    if (!hasPermission) {
      setLoading(false)
      return
    }

    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        console.log('Geolocation Success:', position)
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        setLoading(false)
      },
      (geoError: GeoError) => {
        console.error('Geolocation Error:', geoError.code, geoError.message)
        setError(`無法獲取位置：${geoError.message} (Code ${geoError.code})`)
        setLoading(false)
      },
      {
        enableHighAccuracy: true, // 盡可能使用高精度 (GPS)
        timeout: 15000, // 15 秒超時
        maximumAge: 10000, // 接受 10 秒內的快取位置
      }
    )
  }

  // 手動請求位置的函數
  const requestLocation = async () => {
    await getLocation()
  }

  // 如果設定為自動請求，則在 Hook 掛載時請求位置
  useEffect(() => {
    if (autoRequest) {
      requestLocation()
    }
  }, [])

  return { location, loading, error, requestLocation }
}

export default useLocation
