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
const panelHeight = 63;
const handleHeight = 24;
const stripThreshold =
  side * 2 + sizes.halfPadding * 2 + panelHeight + handleHeight;
const stripTopThreshold = Dimensions.get('window').height;

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
      height: handleHeight,
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
  selection: Set<number>;
  panResponder: PanResponderInstance;
  position: Animated.Value;
  positionNumberRef: {current: number; started: number};
  childrenTranslateY: Animated.Value;
}

interface PickPhotoDrawerProps {
  data: any[];
}

class PickPhotoDrawer extends React.Component<
  PickPhotoDrawerProps,
  PickPhotoDrawerState
> {
  state: PickPhotoDrawerState = {
    selection: new Set<number>(),
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
        // @ts-ignore
        Animated.decay(this.state.position).stop();
        return true;
      },
      onPanResponderMove: (event, gesture) => {
        this.state.position.setValue(
          this.state.positionNumberRef.started - gesture.dy,
        );
      },
      onPanResponderRelease: (event, gesture) => {
        Animated.decay(this.state.position, {
          velocity: -gesture.vy,
          deceleration: 0.999,
        }).start();

        return true;
      },
    }),
    childrenTranslateY: new Animated.Value(0),
  };

  handlePhotoItemPress = (index: number) => {
    const {selection} = this.state;
    const wasEmpty = selection.size === 0;
    const selected = selection.has(index);
    if (selected) {
      selection.delete(index);
    } else {
      selection.add(index);
    }

    const becomeNotEmpty = wasEmpty && selection.size !== 0;
    const becomeEmpty = !wasEmpty && selection.size === 0;

    this.setState({selection: new Set([...selection])});

    if (becomeNotEmpty) {
      this.startPanelAppearAnimation();
    }
  };

  startAppearAnimation = () => {
    Animated.timing(this.state.position, {
      toValue: stripThreshold,
      duration: 500,
    }).start();
  };

  startPanelAppearAnimation = () => {
    this.state.childrenTranslateY.setValue(panelHeight);
    Animated.timing(this.state.childrenTranslateY, {
      toValue: 0,
      duration: 500,
    }).start();
  };

  startDisappearAnimation = () => {
    Animated.timing(this.state.position, {
      toValue: 0,
      duration: 500,
    }).start();
  };

  startShowStripAnimation = () => {};

  startHideStripAnimation = () => {};

  get maxHeight() {
    const rowCount = Math.ceil(this.props.data.length / 3);
    return rowCount * side + handleHeight + sizes.halfPadding * (rowCount - 1);
  }

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
            isSelected={this.state.selection.has(index)}
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

  shouldRenderStrip = () => {
    return this.state.positionNumberRef.current > side * 2 + panelHeight;
  };

  renderStrip = () => (
    <Items
      Component={Animated.View}
      style={{
        position: 'absolute',
        height: panelHeight,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 45,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        transform: [
          {
            translateY: this.state.position.interpolate({
              inputRange: [
                stripThreshold - panelHeight,
                stripThreshold,
                stripTopThreshold - side,
                stripTopThreshold,
              ],
              outputRange: [panelHeight, 0, 0, panelHeight],
              extrapolateRight: 'clamp',
            }),
          },
        ] as any,
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

  renderChildren = () => {
    return (
      <Animated.View
        style={{
          transform: [
            {
              translateY: this.state.childrenTranslateY,
            },
          ],
        }}>
        {this.props.children}
      </Animated.View>
    );
  };

  render = () => {
    const isAnySelection = this.state.selection.size > 0;

    return (
      <>
        {!isAnySelection && this.renderChildren()}
        <Animated.View
          {...this.state.panResponder.panHandlers}
          style={{
            flex: 1,
            backgroundColor: 'white',
            position: 'absolute',
            width: '100%',
            height: this.state.position.interpolate({
              inputRange: [Number.MIN_SAFE_INTEGER, 0, this.maxHeight],
              outputRange: [0, 0, this.maxHeight],
              extrapolateRight: 'clamp',
            }),
            bottom: 0,
            borderTopLeftRadius: sizes.borderRadius,
            borderTopRightRadius: sizes.borderRadius,
          }}>
          {this.renderGrid()}
          {this.renderStrip()}
        </Animated.View>
        {isAnySelection && this.renderChildren()}
      </>
    );
  };
}

export default PickPhotoDrawer;
