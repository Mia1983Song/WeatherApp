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
  isLoadingLocation: boolean
  locationErrorMessage: string | null
  requestLocation: () => Promise<void> // 允許手動觸發定位請求
}

const useLocation = (autoRequest = false): UseLocationProps => {
  const [location, setLocation] = useState<LocationCoords | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false)
  const [locationErrorMessage, setLocationErrorMessage] = useState<
    string | null
  >(null)

  // 獲取對應平台的位置權限
  const getLocationPermission = () => {
    return Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      default: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    })
  }

  // 請求位置權限
  const getLocation = async () => {
    setIsLoadingLocation(true)
    setLocationErrorMessage(null)

    try {
      const permission = getLocationPermission()
      const permissionStatus = await check(permission)

      // 處理不同的權限狀態
      if (permissionStatus === RESULTS.UNAVAILABLE) {
        throw new Error('此裝置不支援位置服務')
      } else if (permissionStatus === RESULTS.DENIED) {
        const result = await request(permission)
        if (result !== RESULTS.GRANTED) {
          throw new Error('需要位置權限才能獲取當前位置')
        }
      } else if (permissionStatus === RESULTS.BLOCKED) {
        throw new Error('位置權限已被永久拒絕，請在系統設定中啟用')
      } else if (permissionStatus !== RESULTS.GRANTED) {
        throw new Error('無法獲取位置權限')
      }

      // 權限已獲取，請求位置
      return new Promise<void>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position: GeoPosition) => {
            console.log('Geolocation Success:', position)
            const { latitude, longitude } = position.coords
            setLocation({ latitude, longitude })
            resolve()
          },
          (geoError: GeoError) => {
            console.error('Geolocation Error:', geoError.code, geoError.message)
            reject(
              new Error(
                `無法獲取位置：${geoError.message} (Code ${geoError.code})`
              )
            )
          },
          {
            enableHighAccuracy: true, // 盡可能使用高精度 (GPS)
            timeout: 15000, // 15 秒超時
            maximumAge: 10000, // 接受 10 秒內的快取位置
          }
        )
      })
    } catch (error) {
      console.warn('位置服務錯誤:', error)

      let errorMsg = '獲取位置時發生錯誤'
      if (error instanceof Error) {
        errorMsg = error.message || errorMsg
      }

      setLocationErrorMessage(errorMsg)
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // 自動請求邏輯保持不變
  useEffect(() => {
    console.log('useLocation掛載時，判斷是否自動請求<用戶定位>')
    if (autoRequest) {
      getLocation()
    }
  }, [])

  return {
    location,
    isLoadingLocation,
    locationErrorMessage,
    requestLocation: getLocation,
  }
}

export default useLocation
