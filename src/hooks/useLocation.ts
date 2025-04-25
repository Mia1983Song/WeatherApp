import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';

// 定義位置座標的類型 (可以根據需要擴充)
export interface LocationCoords {
  latitude: number;
  longitude: number;
}

// 定義 Hook 返回值的類型
interface UseLocationProps {
  location: LocationCoords | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>; // 允許手動觸發定位請求
}

const useLocation = (): UseLocationProps => {
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- 請求地理位置權限 (Android) ---
  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '地理位置權限請求',
            message: '我們需要您的位置來顯示當地天氣。',
            buttonNeutral: '稍後詢問',
            buttonNegative: '取消',
            buttonPositive: '確定',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('地理位置權限已授予');
          return true;
        } else {
          console.log('地理位置權限被拒絕');
          setError('需要地理位置權限才能獲取天氣。');
          return false;
        }
      } catch (err) {
        console.warn(err);
        setError('請求權限時發生錯誤。');
        return false;
      }
    } else {
      // iOS 權限請求通常在 Info.plist 中設定，並在首次呼叫 Geolocation 時觸發
      // 可以使用 react-native-permissions 做更細緻的跨平台處理
      return true; // 假設 iOS 權限已處理或無需顯式請求
    }
  };

  // --- 實際獲取位置的函數 ---
  const getLocation = async () => {
    setLoading(true);
    setError(null);
    setLocation(null);

    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      setLoading(false);
      // error state 已在 requestLocationPermission 中設定
      return;
    }

    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        console.log('Geolocation Success:', position);
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setLoading(false);
      },
      (geoError: GeoError) => {
        console.error('Geolocation Error:', geoError.code, geoError.message);
        setError(`無法獲取位置：${geoError.message} (Code ${geoError.code})`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true, // 盡可能使用高精度 (GPS)
        timeout: 15000, // 15 秒超時
        maximumAge: 10000, // 接受 10 秒內的快取位置
      }
    );
  };

  // --- 允許手動觸發請求的函數 ---
  const requestLocation = async () => {
    await getLocation();
  };

  // --- (可選) Hook 掛載時自動請求位置 ---
  useEffect(() => {
    requestLocation();
  }, []); // 空依賴陣列，僅在首次掛載時執行

  // 返回狀態和方法
  return { location, loading, error, requestLocation };
};

export default useLocation;
