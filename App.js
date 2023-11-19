import React, {useState} from 'react';
import {Text, TextInput, View} from 'react-native';

function my_eval(t) {
	result = "error!";
	try {
		result = eval(t);
	} catch(error) {};
	return result;
}


const PizzaTranslator = () => {
  const [text, setText] = useState('');
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
    </View>
  );
};

export default PizzaTranslator;
