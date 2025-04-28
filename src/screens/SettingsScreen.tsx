import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native'
import { useSettings } from '../contexts/SettingsContext'
import { TemperatureUnit, AVAILABLE_CITIES, City } from '../types/settings'
import {
  scale,
  responsiveFontSize,
  isSmallDevice,
  isLargeDevice,
  useDimensions,
} from '../utils/responsive'

export default function SettingsScreen() {
  const {
    settings,
    isLoading,
    setDefaultCity,
    setTemperatureUnit,
    setUseCurrentLocationByDefault,
  } = useSettings()

  const [cityModalVisible, setCityModalVisible] = useState(false)

  // 監聽螢幕變化
  const dimensions = useDimensions()
  const isLandscape = dimensions.window.width > dimensions.window.height

  // 切換溫度單位
  const toggleTemperatureUnit = async () => {
    const newUnit =
      settings.temperatureUnit === TemperatureUnit.CELSIUS
        ? TemperatureUnit.FAHRENHEIT
        : TemperatureUnit.CELSIUS
    await setTemperatureUnit(newUnit)
  }

  // 切換是否預設使用當前位置
  const toggleUseCurrentLocation = async () => {
    await setUseCurrentLocationByDefault(!settings.useCurrentLocationByDefault)
  }

  // 選擇預設城市
  const selectCity = async (city: City) => {
    await setDefaultCity(city)
    setCityModalVisible(false)
  }

  // 載入中狀態
  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { padding: scale(isSmallDevice ? 16 : 20) },
        ]}
      >
        <ActivityIndicator size='large' color='#007AFF' />
        <Text
          style={{
            marginTop: scale(12),
            fontSize: responsiveFontSize(isSmallDevice ? 14 : 16),
          }}
        >
          載入設定中...
        </Text>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: scale(isSmallDevice ? 12 : 16),
      }}
    >
      <Text
        style={[
          styles.title,
          { fontSize: responsiveFontSize(isSmallDevice ? 22 : 28) },
        ]}
      >
        應用程式設定
      </Text>

      <View
        style={[
          styles.settingsContainer,
          isLandscape &&
            isLargeDevice && {
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            },
        ]}
      >
        {/* 預設城市設定 */}
        <View
          style={[
            styles.sectionContainer,
            isLandscape && isLargeDevice && { width: '48%' },
            {
              padding: scale(isSmallDevice ? 12 : 16),
              marginBottom: scale(isSmallDevice ? 12 : 20),
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { fontSize: responsiveFontSize(isSmallDevice ? 16 : 18) },
            ]}
          >
            預設城市
          </Text>
          <Text
            style={[
              styles.description,
              { fontSize: responsiveFontSize(isSmallDevice ? 13 : 14) },
            ]}
          >
            當不使用當前位置時，將顯示此城市的天氣
          </Text>

          <TouchableOpacity
            style={[
              styles.citySelector,
              {
                paddingVertical: scale(isSmallDevice ? 10 : 12),
                marginTop: scale(8),
              },
            ]}
            onPress={() => setCityModalVisible(true)}
          >
            <Text
              style={{ fontSize: responsiveFontSize(isSmallDevice ? 14 : 16) }}
            >
              {settings.defaultCity.name}, {settings.defaultCity.country}
            </Text>
            <Text
              style={{
                fontSize: responsiveFontSize(isSmallDevice ? 14 : 16),
                color: '#007AFF',
              }}
            >
              變更
            </Text>
          </TouchableOpacity>
        </View>

        {/* 溫度單位設定 */}
        <View
          style={[
            styles.sectionContainer,
            isLandscape && isLargeDevice && { width: '48%' },
            {
              padding: scale(isSmallDevice ? 12 : 16),
              marginBottom: scale(isSmallDevice ? 12 : 20),
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { fontSize: responsiveFontSize(isSmallDevice ? 16 : 18) },
            ]}
          >
            溫度單位
          </Text>
          <View style={styles.settingRow}>
            <Text
              style={{ fontSize: responsiveFontSize(isSmallDevice ? 14 : 16) }}
            >
              使用攝氏溫度 (°C)
            </Text>
            <Switch
              value={settings.temperatureUnit === TemperatureUnit.CELSIUS}
              onValueChange={toggleTemperatureUnit}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={
                settings.temperatureUnit === TemperatureUnit.CELSIUS
                  ? '#007AFF'
                  : '#f4f3f4'
              }
            />
          </View>
        </View>

        {/* 位置設定 */}
        <View
          style={[
            styles.sectionContainer,
            {
              padding: scale(isSmallDevice ? 12 : 16),
              marginBottom: scale(isSmallDevice ? 12 : 20),
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { fontSize: responsiveFontSize(isSmallDevice ? 16 : 18) },
            ]}
          >
            位置設定
          </Text>
          <View style={styles.settingRow}>
            <Text
              style={{ fontSize: responsiveFontSize(isSmallDevice ? 14 : 16) }}
            >
              預設使用當前位置
            </Text>
            <Switch
              value={settings.useCurrentLocationByDefault}
              onValueChange={toggleUseCurrentLocation}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={
                settings.useCurrentLocationByDefault ? '#007AFF' : '#f4f3f4'
              }
            />
          </View>
          <Text
            style={[
              styles.description,
              { fontSize: responsiveFontSize(isSmallDevice ? 13 : 14) },
            ]}
          >
            啟用後，應用程式將在啟動時嘗試使用您的當前位置
          </Text>
        </View>
      </View>

      {/* 城市選擇模態視窗 */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={cityModalVisible}
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              {
                width: isLargeDevice ? '70%' : '85%',
                maxHeight: isLandscape ? '80%' : '70%',
                padding: scale(isSmallDevice ? 16 : 20),
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { fontSize: responsiveFontSize(isSmallDevice ? 18 : 20) },
              ]}
            >
              選擇預設城市
            </Text>

            <FlatList
              data={AVAILABLE_CITIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    item.id === settings.defaultCity.id &&
                      styles.selectedCityItem,
                    { paddingVertical: scale(isSmallDevice ? 10 : 12) },
                  ]}
                  onPress={() => selectCity(item)}
                >
                  <Text
                    style={[
                      styles.cityItemText,
                      item.id === settings.defaultCity.id &&
                        styles.selectedCityText,
                      { fontSize: responsiveFontSize(isSmallDevice ? 14 : 16) },
                    ]}
                  >
                    {item.name}, {item.country}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  marginTop: scale(isSmallDevice ? 16 : 20),
                  padding: scale(isSmallDevice ? 10 : 12),
                },
              ]}
              onPress={() => setCityModalVisible(false)}
            >
              <Text
                style={[
                  styles.closeButtonText,
                  { fontSize: responsiveFontSize(isSmallDevice ? 14 : 16) },
                ]}
              >
                取消
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  settingsContainer: {
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: scale(24),
    color: '#212121',
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: scale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: scale(12),
    color: '#212121',
  },
  description: {
    color: '#757575',
    marginVertical: scale(8),
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(8),
  },
  citySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: scale(8),
    paddingHorizontal: scale(12),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: scale(12),
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: scale(16),
    textAlign: 'center',
  },
  cityItem: {
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedCityItem: {
    backgroundColor: '#e3f2fd',
  },
  cityItemText: {
    color: '#333',
  },
  selectedCityText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  closeButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: scale(8),
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: '600',
  },
})
