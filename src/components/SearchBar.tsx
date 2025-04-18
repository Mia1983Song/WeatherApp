import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

// SearchBar 是 無狀態(Stateless)的，由父元件(SearchScreen)控制行為
// 不自己保存資料（state），完全靠外部傳入的 props，來決定自己要渲染什麼內容

// 型別別名（Type Alias）: 用來定義一個物件的形狀（properties 與 types），特別是用來描述元件的 props
type SearchBarProps = { // 定義一個叫 SearchBarProps 的「型別」，裡面是一個物件
    value: string; // 搜尋欄位的文字內容
    onChangeText: (text: string) => void; // 文字變更要呼叫的方法
    onSubmit: () => void; // 按搜尋時要呼叫的方法
    loading?: boolean;
    // 搜尋中按鈕會變成 搜尋中... 並且 Button disabled，防止重複觸發 API
};

export default function SearchBar({ value, onChangeText, onSubmit, loading = false }: SearchBarProps) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="請輸入城市名稱"
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
            />
            <Button title={loading ? '搜尋中...' : '搜尋'} onPress={onSubmit} disabled={loading} />
        </View>
    );
}

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
});
