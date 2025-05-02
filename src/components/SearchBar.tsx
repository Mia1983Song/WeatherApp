import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'

type SearchBarProps = {
  value: string // 搜尋欄位的文字內容
  onChangeText: (text: string) => void // 文字變更要呼叫的方法
  onSubmit: () => void // 按搜尋時要呼叫的方法
  loading?: boolean // 搜尋中按鈕會變成 搜尋中... 並且 Button disabled，防止重複觸發 API
  autoFocus?: boolean
}

// 定義可暴露給父組件的方法
export interface SearchBarHandle {
  focus: () => void
  clear: () => void
}

// 使用 forwardRef 包裝元件
const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>(
  (
    { value, onChangeText, onSubmit, loading = false, autoFocus = false },
    ref
  ) => {
    // 創建對 TextInput 的內部引用
    const inputRef = useRef<TextInput>(null)

    // 使用 useImperativeHandle 暴露方法給父元件
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus()
      },
      clear: () => {
        // 使用 onChangeText 更新父元件的 state 值
        onChangeText('')
        // 同時清除 input 元件本身
        inputRef.current?.clear()
      },
    }))

    return (
      <View style={styles.container}>
        <TextInput
          ref={inputRef} // 綁定內部 ref
          style={styles.input}
          placeholder='請輸入城市名稱'
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          returnKeyType='search'
          autoFocus={autoFocus}
        />
        <Button
          title={loading ? '搜尋中...' : '搜尋'}
          onPress={onSubmit}
          disabled={loading}
        />
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    marginRight: 8,
  },
})

export default SearchBar
