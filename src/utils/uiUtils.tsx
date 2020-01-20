import React from 'react';
import {GestureResponderEvent, StyleProp, TextStyle, View, ViewStyle} from 'react-native';

type SpacerProps = {
  w?: number;
  h?: number;
  c?: string;
};

export const Spacer = ({w = 0, h = 0, c = 'transparent'}: SpacerProps) => (
  <View style={{height: h, width: w, backgroundColor: c}} />
);

export const Filler = ({ style }: {style?: ViewStyle}) => <View style={{flex: 1, ...style}} />;

export const centerStyle: {} = {justifyContent: 'center', alignItems: 'center'};

export const wh = (w: number, h: number = w) => ({width: w, height: h});

export type TouchableOpacityCallback = (
  event: GestureResponderEvent,
) => void | null;

export const fdr: ViewStyle = {flexDirection: 'row'}
export const fww: ViewStyle = {flexWrap: 'wrap'}
export const fdc: ViewStyle = {flexDirection: 'column'}

