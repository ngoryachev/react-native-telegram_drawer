import React from 'react';
import {
  Dimensions,
  Image,
  View,
  Text,
  PanResponder,
  PanResponderInstance,
  Animated,
} from 'react-native';
import {centerStyle, fdr, fww} from '../../uiUtils';
import sizes from '../styles/sizes';
import R from 'ramda';
import {Circle, Grid, Items, Row} from '../../components';
import {Proc} from '../../declarations';
import Icon from 'react-native-vector-icons/FontAwesome';

const side = (Dimensions.get('window').width - sizes.padding * 3) / 3;

type PhotoItemProps = {
  onPress?: Proc;
  source?: any;
  isSelected: boolean;
};

const PhotoItem = (props: PhotoItemProps) => (
  <View>
    <View
      style={{
        position: 'absolute',
        width: side,
        height: side,
        ...centerStyle,
        backgroundColor: '#F7F7F7',
      }}>
      <Icon name="image" size={side * 0.33} color="#C2C5C2" />
    </View>
    <Image
      source={props.source}
      style={{
        width: side,
        height: side,
        marginBottom: sizes.halfPadding,
      }}
    />
    <Circle
      onPress={props.onPress}
      size={16}
      color="white"
      style={{position: 'absolute', right: 5, top: 5}}>
      <Circle size={14} color={props.isSelected ? 'pink' : '#C2C5C2'} />
    </Circle>
  </View>
);

const Handle = () => (
  <Row
    alignCenter
    justifyCenter
    style={{
      height: 24,
    }}>
    <View
      style={{
        width: 43,
        height: 6,
        backgroundColor: '#C1C1C1',
        borderRadius: 3,
      }}
    />
  </Row>
);

type CircleButtonProps = {
  isIcon: boolean;
  name: string;
  onPress: Proc;
};

const CircleButton = (props: CircleButtonProps) => (
  <Circle size={40} color="#3D3737" onPress={props.onPress}>
    {props.isIcon && <Icon name={props.name} color="#F2F2F2" size={18} />}
    {!props.isIcon && (
      <Text style={{fontSize: 12, fontWeight: 'bold', color: '#F2F2F2'}}>
        {props.name}
      </Text>
    )}
  </Circle>
);

interface PickPhotoDrawerState {
  selection: boolean[];
  panResponder: PanResponderInstance;
  position: Animated.Value;
  positionNumberRef: { current: number, started: number };
}

interface PickPhotoDrawerProps {
  data: any[];
}

class PickPhotoDrawer extends React.Component<
  PickPhotoDrawerProps,
  PickPhotoDrawerState
> {
  state: PickPhotoDrawerState = {
    selection: R.map(R.always(false), this.props.data),
    positionNumberRef: {current: 0, started: null} as any,
    position: (() => {
      const animated = new Animated.Value(0);
      animated.addListener(
        ({value}) => (this.state.positionNumberRef.current = value),
      );

      return animated;
    })(),
    panResponder: PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: () => {
        this.state.positionNumberRef.started = this.state.positionNumberRef.current;
        return true;
      },
      onPanResponderMove: (event, gesture) => {
        console.log({
          h: this.state.positionNumberRef.current,
          dy: gesture.dy,
          y0: gesture.y0,
        });
        this.state.position.setValue(
          this.state.positionNumberRef.started - gesture.dy,
        );
      },
    }),
  };

  handlePhotoItemPress = (index: number) => {
    const {selection} = this.state;
    const newSelection = R.over(R.lensIndex(index), R.not, selection);

    this.setState({selection: newSelection});
  };

  startAppearAnimation = () => {
    Animated.timing(this.state.position, {
      toValue: 400,
      duration: 500,
    }).start();
  };

  renderGrid = () => {
    return (
      <Grid
        style={{
          ...fdr,
          ...fww,
          justifyContent: 'space-between',
          paddingHorizontal: sizes.padding,
        }}
        showsVerticalScrollIndicator={false}
        data={this.props.data}
        renderItem={({item, index}) => (
          <PhotoItem
            isSelected={this.state.selection[index]}
            onPress={() => this.handlePhotoItemPress(index)}
          />
        )}
        keyExtractor={R.toString}
        ListHeaderComponent={<Handle />}
        keyboardShouldPersistTaps="handled"
      />
    );
  };

  noop = () => {};

  renderStripItem = ({
    item: {name, onPress, isIcon = true},
  }: {
    item: CircleButtonProps;
  }) => <CircleButton name={name} onPress={onPress} isIcon={isIcon} />;

  renderStrip = () => (
    <Items
      style={{
        position: 'absolute',
        height: 50,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 45,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
      data={[
        {name: 'image', isIcon: true, onPress: this.noop},
        {name: 'file-o', isIcon: true, onPress: this.noop},
        {name: 'microphone', isIcon: true, onPress: this.noop},
        {name: 'gif', isIcon: false, onPress: this.noop},
      ]}
      keyExtractor={R.prop('name')}
      renderItem={this.renderStripItem}
    />
  );

  render = () => {
    return (
      <Animated.View
        {...this.state.panResponder.panHandlers}
        style={{
          flex: 1,
          backgroundColor: 'white',
          position: 'absolute',
          width: '100%',
          height: this.state.position,
          bottom: 0,
          borderTopLeftRadius: sizes.borderRadius,
          borderTopRightRadius: sizes.borderRadius,
        }}>
        {this.renderGrid()}
        {this.renderStrip()}
      </Animated.View>
    );
  };
}

export default PickPhotoDrawer;
