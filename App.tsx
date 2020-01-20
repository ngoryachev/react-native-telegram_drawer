/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef, useEffect, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Spacer} from './uiUtils';
import {Row} from './components';
import sizes from './src/styles/sizes';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import PickPhotoDrawer from './src/components/PickPhotoDrawer';
import CameraRoll, {
  PhotoIdentifier,
  PhotoIdentifiersPage,
} from '@react-native-community/cameraroll';
import {READ_STORAGE, requestPermission} from './src/utils/permissions';

const App = () => {
  const drawerEl = useRef<PickPhotoDrawer>(null);
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  useEffect(() => {
    requestPermission(READ_STORAGE)
      .then(() =>
        CameraRoll.getPhotos({
          first: 60,
          assetType: 'Photos',
        }),
      )
      .then((r: PhotoIdentifiersPage) => {
        setPhotos(r.edges);
      });
  }, []);

  const keyboardBehaviour: any = Platform.select({
    ios: 'padding',
    android: undefined,
  });

  return (
    <KeyboardAvoidingView
      style={{backgroundColor: 'gray', flex: 1}}
      behavior={keyboardBehaviour}>
      <TouchableOpacity
        activeOpacity={1}
        style={{flex: 1, backgroundColor: '#F2F7FA'}}
        onPress={() => drawerEl.current!.startDisappearAnimation()}
      />
      <PickPhotoDrawer data={photos} ref={drawerEl}>
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
                Keyboard.dismiss();
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({});

export default App;
