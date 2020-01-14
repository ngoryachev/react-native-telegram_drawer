/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {createTextStyle, Filler} from './uiUtils';
import {Row} from './components';
import sizes from './src/styles/sizes';

const App = () => {
  return (
    <View style={{backgroundColor: 'gray', flex: 1}}>
      <Filler />
      <Row
        alignCenter
        style={{
          height: 30,
          backgroundColor: 'white',
          paddingHorizontal: sizes.padding,
        }}>
        <Text style={{...createTextStyle({s: 1}), flex: 1}}>
          Добавить подпись
        </Text>
      </Row>
    </View>
  );
};

const styles = StyleSheet.create({});

export default App;
