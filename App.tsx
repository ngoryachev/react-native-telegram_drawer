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
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Filler, Spacer} from './uiUtils';
import {Circle, Column, Row} from './components';
import sizes from './src/styles/sizes';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import PickPhotoDrawer from './src/components/PickPhotoDrawer';

const App = () => {
  return (
    <View style={{backgroundColor: 'gray', flex: 1}}>
      <Filler />
      <Column>
        <Row
          alignCenter
          style={{
            height: 63,
            paddingHorizontal: sizes.padding,
          }}>
          <Icon name="paperclip" size={21} color="#958FAA" />
          <Spacer w={31} />
          <TextInput
            placeholderTextColor="#958FAA"
            placeholder="Сообщение..."
            style={{
              fontSize: 16,
              color: '#3D3737',
              flex: 1,
              fontFamily: 'Source Sans Pro',
            }}
          />
          <IconEvil name="sc-telegram" size={25} color="#958FAA" />
        </Row>
        <View style={{width: '100%', height: 1, backgroundColor: '#F1F1F1'}} />
        <Row
          alignCenter
          style={{
            height: 50,
            backgroundColor: 'white',
            paddingHorizontal: sizes.padding,
          }}>
          <Icon name="angle-left" size={21} color="#958FAA" />
          <Spacer w={4} />
          <Text
            style={{
              fontSize: 16,
              color: '#777777',
              flex: 1,
              fontFamily: 'Source Sans Pro',
            }}>
            назад
          </Text>
          <Filler />
          <Circle size={40} color="#3D3737">
            <Icon name="microphone" size={16} color="white" />
          </Circle>
        </Row>
      </Column>
      <PickPhotoDrawer data={[1, 2, 3, 4]} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default App;
