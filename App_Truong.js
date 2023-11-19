import React, {useState} from 'react';
import {Text, TextInput, View, TouchableOpacity, Date} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Tạo ra nút bấm
const MyButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

//Tính toán biểu thức
function my_eval(t) {
	result = "error!";
	try {
		result = eval(t);
	} catch(error) {};
	return result;
}

const PizzaTranslator = () => {
  const [text, setText] = useState('');
  const [storedTEXT, setStoredText] = useState('');
  const handleButtonPress = () => {
    storeData(text);
  };
  const handleButton2Press = () => {
    getData();
  };

  const storeData = async (newData) => {
    try {
      const ArrayStr = await AsyncStorage.getItem('hist');
      const currentArray = ArrayStr ? JSON.parse(ArrayStr) : [];
      currentArray.push(newData);
      await AsyncStorage.setItem('hist', JSON.stringify(currentArray));
      console.log('Luu thanh cong!');
    } catch (error) {
      console.error('Luu ko thanh cong', error);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('hist');
      if (value !== null) {
        const valueArray = JSON.parse(value);
	const valueArray_reversed = valueArray.reverse();
	const joinStr = valueArray_reversed.join('\n');
        setStoredText(joinStr); //in ra ca cai mang
      }
    } catch (error) {
      console.error('Loi!', error);
    }
  };

  return (
    <View style={{padding: 10}}>
      <TextInput
        style={{height: 100}}
        placeholder="Type here to calculate!"
        onChangeText={newText => setText(newText)}
        defaultValue={text}
      />
      <Text style={{padding: 10, fontSize: 42}}>
        {my_eval(text)}
      </Text>
      <MyButton onPress={handleButtonPress} title="Save to history" />
      <MyButton onPress={handleButton2Press} title="Show history" />
      <Text style={{padding: 10, fontSize: 32}}>
        {storedTEXT}
      </Text>
    </View>
  );
};

export default PizzaTranslator;
