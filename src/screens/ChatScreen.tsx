import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import CameraRoll, {
  PhotoIdentifier,
  PhotoIdentifiersPage,
} from '@react-native-community/cameraroll';
import PickPhotoDrawer from '../..//src/components/PickPhotoDrawer';
import {Spacer} from '../../uiUtils';
import {Row} from '../../components';
import sizes from '../../src/styles/sizes';
import {READ_STORAGE, requestPermission} from '../utils/permissions';

const ChatScreen = () => {
  const drawerEl = useRef<PickPhotoDrawer>(null);
  const [photos, setPhotos] = useState<PhotoIdentifier[]>([]);
  const [message, setMessage] = useState<string>('');

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

  const handleClickOutside = () => {
    drawerEl.current!.startDisappearAnimation();
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={styles.containerStyle}
      behavior={keyboardBehaviour}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.fillerStyle}
        onPress={handleClickOutside}
      />
      <PickPhotoDrawer data={photos} ref={drawerEl}>
        <Row alignCenter style={styles.inputContainer}>
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
            style={styles.inputStyle}
            onChangeText={text => setMessage(text)}
            value={message}
          />
          <TouchableOpacity onPress={() => setMessage('')}>
            <IconEvil name="sc-telegram" size={25} color="#958FAA" />
          </TouchableOpacity>
        </Row>
      </PickPhotoDrawer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 16,
    color: '#3D3737',
    flex: 1,
    fontFamily: 'Source Sans Pro',
  },
  inputContainer: {
    height: 63,
    paddingHorizontal: sizes.padding,
    backgroundColor: 'white',
  },
  fillerStyle: {flex: 1, backgroundColor: '#F2F7FA'},
  containerStyle: {backgroundColor: 'gray', flex: 1},
});

export default ChatScreen;
