import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Khi component được tạo, lấy lịch sử từ AsyncStorage
    retrieveHistory();
  }, []);

  const retrieveHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('calculatorHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error retrieving history:', error);
    }
  };

  const storeHistory = async (newHistory) => {
    try {
      // Lưu lịch sử vào AsyncStorage
      await AsyncStorage.setItem('calculatorHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error storing history:', error);
    }
  };

  const handleCalculate = () => {
    try {
      const calculatedResult = eval(expression);
      setResult(`Result: ${calculatedResult}`);
      const currentTime = new Date();
      const newHistoryItem = {
        expression,
        result: calculatedResult,
        time: currentTime.toLocaleTimeString(),
      };
      const newHistory = [newHistoryItem, ...history.slice(0, 9)];
      setHistory(newHistory);
      storeHistory(newHistory);
    } catch (error) {
      setResult('Error');
    }
  };

  const renderHistoryItem = ({ item }) => (
    <Text style={styles.historyItem}>{`${item.expression} = ${item.result} (${item.time})`}</Text>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter expression"
        value={expression}
        onChangeText={(text) => setExpression(text)}
      />
      <Button title="Calculate" onPress={handleCalculate} />
      <Text style={styles.result}>{result}</Text>
      <Text style={styles.historyTitle}>Calculation History:</Text>
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 60,
    padding: 8,
    width: '100%',
  },
  result: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyItem: {
    fontSize: 16,
  },
});
