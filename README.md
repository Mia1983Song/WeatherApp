## 🛠️ 環境配置

### 技術棧與版本
```
🔷 React: 19.0.0
🔷 React Native: 0.79.1
🔷 TypeScript: 5.0.4
🔶 Node.js: ≥ 18
```

### 安裝與啟動步驟
1. **安裝 Node.js** ≥ 18
2. **安裝 React Native CLI**
   ```bash
   npm install -g react-native-cli
   ```
3. **建立專案**
   ```bash
   npx @react-native-community/cli init YourProjectName
   ```
4. **啟動開發環境**
   - 啟動 Metro bundler
     ```bash
     npx react-native start
     ```
   - 另一終端機運行 Android 模擬器
     ```bash
     npx react-native run-android
     ```

---

## 🌦️ WeatherApp 專案概述

### 📝 專案描述
使用 React Native 開發的天氣應用，專注於提供簡潔、直觀的氣象資訊。支援 Android 平台，採用 TypeScript 進行開發。

### 📂 專案結構

```
WeatherApp/
├── android/                       # Android 專案文件
│   └── app/
│       └── build.gradle          # Android 應用程式構建配置，管理依賴、SDK版本與打包設定
├── src/
│   ├── api/                      # API 相關功能
│   │   └── weatherApi.ts         # 天氣 API 介面與功能
│   ├── components/               # 可重複使用的元件
│   │   ├── WeatherCard.tsx       # 天氣資訊卡片
│   │   └── SearchBar.tsx         # 搜尋輸入元件
│   ├── hooks/                    # 自定義 React Hooks
│   ├── navigation/               # 導航相關
│   │   └── AppNavigator.tsx      # 應用程式導航設定
│   ├── screens/                  # 主要畫面
│   │   ├── HomeScreen.tsx        # 首頁
│   │   ├── SearchScreen.tsx      # 搜尋頁面
│   │   └── SettingsScreen.tsx    # 設定頁面
│   └── utils/                    # 工具函數
├── App.tsx                       # 應用程式入口
├── index.js                      # React Native 入口
├── package.json                  # 專案依賴配置、腳本命令與版本資訊
├── tsconfig.json                 # TypeScript 編譯器設定，定義編譯選項與類型檢查規則
└── metro.config.js               # Metro 打包工具配置，設定模組解析、轉換與打包選項
```

### ✨ 主要功能
- ✓ 查看當前位置的天氣
- ✓ 搜尋不同城市的天氣資訊
- ✓ 查看天氣詳情（溫度、濕度、風速等）
- ✓ 自定義應用程式設定

### 🔧 技術棧
- **React Native** 0.79.1
- **React Navigation** 7.x
- **TypeScript** 5.x
- **Axios** 用於 API 請求
- **React Native Vector Icons** 圖標套件
- **React Native Geolocation Service** 定位服務
- **AsyncStorage** 資料儲存
- **ESLint + Prettier** 代碼格式化

---

## 📱 主要畫面實現

### 🏠 HomeScreen
首頁顯示預設城市（台北）的天氣資訊：

```typescript
export default function HomeScreen() {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const cityName = 'Taipei';
        try {
            const data = await getWeatherByCity(cityName);
            setWeatherData(data);
        } catch (e) {
            setError('無法讀取天氣資料');
        } finally {
            setLoading(false);
        }
    };
    // ...
}
```

### 🔍 SearchScreen
搜尋頁面允許用戶搜尋特定城市的天氣：

```typescript
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
            setWeatherData(data);
            Keyboard.dismiss(); // 成功搜尋後收起鍵盤
        } catch (e) {
            setError('搜尋失敗，請稍後再試');
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };
    // ...
}
```

### 📊 資料模型與 API 服務

#### WeatherData 介面
```typescript
export interface WeatherData {
    city: string,
    country: string,
    temperature: number,
    description: string,
    icon: string,
    feelsLike: number,
    humidity: number,
    windSpeed: number,
    date: string
}
```

#### weatherApi.ts 服務
```typescript
import axios from "axios";

// API 配置
const API_KEY = 'b2efd7a5092f6c6d0ca57d9f0c3813a1';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// 根據城市名稱獲取天氣資料
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}&lang=zh_tw`
        );
        return formatWeatherData(response.data);
    } catch (error) {
        console.error('獲取城市天氣時出錯:', error);
        throw error;
    }
};

// 根據經緯度獲取天氣資料
export const getWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=zh_tw`
        );
        return formatWeatherData(response.data);
    } catch (error) {
        console.error('獲取位置天氣時出錯:', error);
        throw error;
    }
};
```

---

## 🚀 功能完善計畫

### 🎨 UI/UX 優化

| 元件 | 運用位置 | 功能設計建議 |
|:-----|:---------|:------------|
| `KeyboardAvoidingView` | `SearchScreen` | 鍵盤彈出時自動避開輸入欄位 |
| `Platform` | `SettingsScreen` | 根據平台（iOS/Android）顯示不同設定內容 |
| `TouchableOpacity` | `WeatherCard` | 增加點擊互動，未來可擴展跳轉詳細頁 |
| `ActivityIndicator` | `HomeScreen` / `SearchScreen` | 資料抓取或搜尋時顯示轉圈圈 Loading 狀態 |

### 📍 改進位置服務（Geolocation）
- 使用 `react-native-geolocation-service` 取得用戶當前位置
- 處理 iOS / Android 定位權限申請
- 讀取座標後，自動查詢並更新天氣資訊
- 針對錯誤情境設置提示（如拒絕授權、定位失敗）

### 💾 資料持久化（AsyncStorage）
- 儲存最近搜尋過的城市列表，提升搜尋體驗
- 儲存預設城市設定，開啟 App 自動載入
- 未來可加入「清除搜尋歷史」功能選項
