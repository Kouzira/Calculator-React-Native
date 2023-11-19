import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal, Button, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('calculationHistory')
      .then((value) => {
        if (value) {
          setHistory(JSON.parse(value));
        }
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const handleOrientationChange = ({ window: { width, height } }) => {
      setIsLandscape(width > height);
    };

    Dimensions.addEventListener('change', handleOrientationChange);
    return () => {
      Dimensions.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  const calculateResult = () => {
    try {
      const calculatedResult = eval(expression);
      setResult(calculatedResult.toString());
      const calculation = `${expression} = ${calculatedResult}`;
      const newHistory = [...history, calculation];
      setHistory(newHistory);
      AsyncStorage.setItem('calculationHistory', JSON.stringify(newHistory));
    } catch (error) {
      setResult('Error');
    }
  };

  const handleButtonPress = (value) => {
    setExpression(prevExpression => prevExpression + value);
    setResult('');
  };

  const clearHistory = () => {
    setHistory([]);
    AsyncStorage.removeItem('calculationHistory');
  };

  const handleSpecialCalculation = (operation) => {
    let specialResult = '';
    switch (operation) {
      case 'sqrt':
        specialResult = Math.sqrt(parseFloat(expression));
        break;
      case 'pow2':
        specialResult = Math.pow(parseFloat(expression), 2);
        break;
      case 'log10':
        specialResult = Math.log10(parseFloat(expression));
        break;
      default:
        break;
    }
    setResult(specialResult.toString());
  };

  const renderButton = (value) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleButtonPress(value)}
    >
      <Text style={styles.buttonText}>{value}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="0"
        value={expression}
        onChangeText={(text) => setExpression(text)}
        keyboardType="numeric"
      />
      <Text style={styles.result}>{result}</Text>
      <View style={styles.buttons}>
        <View style={styles.row}>
          {renderButton('7')}
          {renderButton('8')}
          {renderButton('9')}
          {renderButton('/')}
        </View>
        <View style={styles.row}>
          {renderButton('4')}
          {renderButton('5')}
          {renderButton('6')}
          {renderButton('*')}
        </View>
        <View style={styles.row}>
          {renderButton('1')}
          {renderButton('2')}
          {renderButton('3')}
          {renderButton('-')}
        </View>
        <View style={styles.row}>
          {renderButton('0')}
          {renderButton('.')}
          <TouchableOpacity
            style={styles.button}
            onPress={calculateResult}
          >
            <Text style={styles.buttonText}>=</Text>
          </TouchableOpacity>
          {renderButton('+')}
        </View>
        {isLandscape && (
          <View style={styles.row}>
            <TouchableOpacity style={styles.button} onPress={() => handleSpecialCalculation('sqrt')}>
              <Text style={styles.buttonText}>√</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleSpecialCalculation('pow2')}>
              <Text style={styles.buttonText}>x²</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleSpecialCalculation('log10')}>
              <Text style={styles.buttonText}>log</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearHistory}
        >
          <Text style={styles.clearButtonText}>C</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => setShowHistoryModal(true)}
        >
          <Text style={styles.historyButtonText}>History</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showHistoryModal}
        animationType="slide"
        onRequestClose={() => setShowHistoryModal(false)}
      >
        <View style={styles.historyModal}>
          <Text style={styles.historyTitle}>History:</Text>
          <FlatList
            data={history}
            renderItem={({ item }) => <Text style={styles.historyItem}>{item}</Text>}
            keyExtractor={(item, index) => index.toString()}
            style={styles.historyList}
          />
          <Button title="Clear History" onPress={clearHistory} />
          <Button title="Close" onPress={() => setShowHistoryModal(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    fontSize: 24,
    textAlign: 'right',
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DDDDDD',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    fontSize: 24,
  },
  historyButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  historyButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  clearButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  clearButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  result: {
    fontSize: 36,
  },
  historyModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyList: {
    flexGrow: 1,
    width: '100%',
  },
  historyItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default Calculator;
