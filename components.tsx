import React from 'react';
import {
  FlatListProps,
  ListRenderItemInfo,
  TouchableOpacity,
  View, ViewProps,
  ViewStyle,
} from 'react-native';
import {centerStyle, fdr, fww} from './uiUtils';
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
  children?: any;
  onPress?: Proc;
  style?: ViewStyle;
};

export const Circle = (props: CircleProps) => {
  const Component: any = props.onPress ? TouchableOpacity : View;

  return (
    <Component
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
      activeOpacity={props.onPress ? undefined : 1}
      onPress={props.onPress}
      style={{
        width: props.size,
        height: props.size,
        borderRadius: props.size * 0.5,
        backgroundColor: props.color,
        ...centerStyle,
        ...props.style,
      }}>
      {props.children}
    </Component>
  );
};

function Grid_<ItemT>(props: FlatListProps<ItemT>) {
  return (
    <>
      {props.ListHeaderComponent}
      <View style={{...fdr, ...fww, ...(props.style as ViewProps)}}>
        {(props.data || []).map((item: ItemT, index: number) =>
          React.cloneElement(
            // @ts-ignore
            props.renderItem({item, index} as ListRenderItemInfo<ItemT>),
            // @ts-ignore
            {key: props.keyExtractor(item)},
          ),
        )}
      </View>
      {props.ListFooterComponent}
    </>
  );
}

export const Grid = Grid_;

type ItemsProps<ItemT> = FlatListProps<ItemT> & { Component: any }

function Items_<ItemT>(props: ItemsProps<ItemT>) {
  const Component = props.Component || View;

  return (
    <Component style={{...fdr, ...(props.style as ViewProps)}}>
      {(props.data || []).map((item: ItemT, index: number) =>
        React.cloneElement(
          // @ts-ignore
          props.renderItem({item, index} as ListRenderItemInfo<ItemT>),
          // @ts-ignore
          {key: props.keyExtractor(item)},
        ),
      )}
    </Component>
  );
}

export const Items = Items_;
