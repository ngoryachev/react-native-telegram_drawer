import React from 'react';
import {GestureResponderEvent, StyleProp, TextStyle, View} from 'react-native';

export const Spacer = ({w = 0, h = 0}: {w?: number; h?: number}) => (
  <View style={{height: h, width: w}} />
);

export const Filler = ({}) => <View style={{flex: 1}} />;

type TextStyleProps = {
  s: 1 | 2 | 3 | 4 | 5 | 6;
  c?: 'w' | 'b' | 'g';
  center?: boolean;
};

const sizes = {
  1: 10,
  2: 12,
  3: 16,
  4: 20,
  5: 26,
  6: 32,
};

export const createTextStyle = ({s, c, center}: TextStyleProps): {} => {
  const size = sizes[s];

  const color = c === 'w' ? 'white' : 'black';
  const ret: StyleProp<TextStyle> = {
    fontSize: size,
    color: color,
    textAlign: typeof center === 'boolean' ? 'center' : 'left',
  };

  return ret as {};
};

export const centerStyle: {} = {justifyContent: 'center', alignItems: 'center'};

export type TouchableOpacityCallback = (
  event: GestureResponderEvent,
) => void | null;
