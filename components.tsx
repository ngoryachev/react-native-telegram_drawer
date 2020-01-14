import React from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {centerStyle} from './uiUtils';
import {Proc} from './declarations';

export interface LineProps {
  children?: any;
  alignCenter?: boolean;
  justifyCenter?: boolean;
  spaceAround?: boolean;
  alignItems?: 'center' | 'flex-start';
  justifyContent?: 'space-around' | 'center' | 'flex-start';
  style?: ViewStyle;
  flexible?: boolean;
}

const Line = (flexDirection: 'row' | 'column') => ({
  children,
  style,
  alignCenter = false,
  justifyCenter = false,
  alignItems = alignCenter ? 'center' : 'flex-start',
  spaceAround = false,
  justifyContent = spaceAround
    ? 'space-around'
    : justifyCenter
    ? 'center'
    : 'flex-start',
  flexible = false,
}: LineProps) => (
  <View
    style={{
      ...(style as {}),
      flexDirection: flexDirection,
      alignItems,
      justifyContent,
      flex: flexible ? 1 : undefined,
    }}>
    {children}
  </View>
);

export const Row = Line('row');
export const Column = Line('column');

export type CircleProps = {
  size: number;
  color: string;
  children: any;
  onPress?: Proc;
};

export const Circle = (props: CircleProps) => {
  return (
    <TouchableOpacity
      activeOpacity={props.onPress ? undefined : 1}
      onPress={props.onPress}
      style={{
        width: props.size,
        height: props.size,
        borderRadius: props.size * 0.5,
        backgroundColor: props.color,
        ...centerStyle,
      }}>
      {props.children}
    </TouchableOpacity>
  );
};
