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

export default function SettingsScreen() {
  const {
    settings,
    isLoading,
    setDefaultCity,
    setTemperatureUnit,
    setUseCurrentLocationByDefault,
  } = useSettings()

  const [cityModalVisible, setCityModalVisible] = useState(false)

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#007AFF' />
        <Text style={styles.loadingText}>載入設定中...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>應用程式設定</Text>

      {/* 預設城市選擇 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>預設城市</Text>
        <Text style={styles.description}>
          當不使用當前位置時，將顯示此城市的天氣
        </Text>

        <TouchableOpacity
          style={styles.citySelector}
          onPress={() => setCityModalVisible(true)}
        >
          <Text style={styles.cityText}>
            {settings.defaultCity.name}, {settings.defaultCity.country}
          </Text>
          <Text style={styles.cityAction}>變更</Text>
        </TouchableOpacity>
      </View>

      {/* 溫度單位選擇 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>溫度單位</Text>
        <View style={styles.settingRow}>
          <Text>使用攝氏溫度 (°C)</Text>
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

      {/* 使用當前位置設定 */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>位置設定</Text>
        <View style={styles.settingRow}>
          <Text>預設使用當前位置</Text>
          <Switch
            value={settings.useCurrentLocationByDefault}
            onValueChange={toggleUseCurrentLocation}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={
              settings.useCurrentLocationByDefault ? '#007AFF' : '#f4f3f4'
            }
          />
        </View>
        <Text style={styles.description}>
          啟用後，應用程式將在啟動時嘗試使用您的當前位置
        </Text>
      </View>

      {/* 城市選擇模態視窗 */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={cityModalVisible}
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>選擇預設城市</Text>

            <FlatList
              data={AVAILABLE_CITIES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    item.id === settings.defaultCity.id &&
                      styles.selectedCityItem,
                  ]}
                  onPress={() => selectCity(item)}
                >
                  <Text
                    style={[
                      styles.cityItemText,
                      item.id === settings.defaultCity.id &&
                        styles.selectedCityText,
                    ]}
                  >
                    {item.name}, {item.country}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCityModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>取消</Text>
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#616161',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#212121',
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#212121',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    marginVertical: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  citySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  cityText: {
    fontSize: 16,
  },
  cityAction: {
    fontSize: 14,
    color: '#007AFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cityItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedCityItem: {
    backgroundColor: '#e3f2fd',
  },
  cityItemText: {
    fontSize: 16,
  },
  selectedCityText: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
})
