/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef} from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import {Spacer} from './uiUtils';
import {Column, Row} from './components';
import sizes from './src/styles/sizes';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import PickPhotoDrawer from './src/components/PickPhotoDrawer';

const App = () => {
  const drawerEl = useRef<PickPhotoDrawer>(null);

  return (
    <View style={{backgroundColor: 'gray', flex: 1}}>
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1, backgroundColor: '#F2F7FA'}}
        onPress={() => drawerEl.current!.startDisappearAnimation()}
      />
      <PickPhotoDrawer
        data={[
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
        ]}
        ref={drawerEl}>
        <Row
          alignCenter
          style={{
            height: 63,
            paddingHorizontal: sizes.padding,
            backgroundColor: 'white',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (drawerEl.current) {
                drawerEl.current.startAppearAnimation();
              }
            }}>
            <Icon name="paperclip" size={21} color="#958FAA" />
          </TouchableOpacity>
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
      </PickPhotoDrawer>
    </View>
  );
};

const styles = StyleSheet.create({});

export default App;
