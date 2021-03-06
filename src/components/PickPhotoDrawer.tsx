import React from 'react';
import {
  Dimensions,
  Image,
  View,
  Text,
  PanResponder,
  PanResponderInstance,
  Animated,
  StyleSheet,
} from 'react-native';
import {centerStyle, fdr, fww} from '../utils/uiUtils';
import sizes from '../styles/sizes';
import R from 'ramda';
import {Circle, Grid, Items, Row} from './components';
import {Proc} from '../../declarations';
import Icon from 'react-native-vector-icons/FontAwesome';
import {PhotoIdentifier} from '@react-native-community/cameraroll';

const side = (Dimensions.get('window').width - sizes.padding * 3) / 3;
const panelHeight = 63;
const handleHeight = 24;
const stripThreshold =
  side * 2 + sizes.halfPadding * 2 + panelHeight + handleHeight;
const stripTopThreshold = Dimensions.get('window').height;
const defaultDuration = 500;

type PhotoItemProps = {
  onPress?: Proc;
  uri?: string;
  isSelected: boolean;
};

const PhotoItem = (props: PhotoItemProps) => (
  <View style={styles.photoItemContainerStyle}>
    <View style={styles.photoBgStyle}>
      <Icon name="image" size={side * 0.33} color="#C2C5C2" />
    </View>
    <Image
      source={{uri: props.uri}}
      style={{
        width: props.isSelected ? side * 0.9 : side,
        height: props.isSelected ? side * 0.9 : side,
      }}
    />
    <Circle
      onPress={props.onPress}
      size={16}
      color="rgba(255, 255, 255, 0.8)"
      style={styles.photoCheckboxStyle}>
      <Circle size={14} color={props.isSelected ? 'pink' : 'transparent'} />
    </Circle>
  </View>
);

const Handle = () => (
  <Row alignCenter justifyCenter style={styles.handleContainerStyle}>
    <View style={styles.handleViewStyle} />
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
      <Text style={styles.circleButtonTextStyle}>{props.name}</Text>
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
  data: PhotoIdentifier[];
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
      duration: defaultDuration,
    }).start();
  };

  startPanelAppearAnimation = () => {
    this.state.childrenTranslateY.setValue(panelHeight);
    Animated.timing(this.state.childrenTranslateY, {
      toValue: 0,
      duration: defaultDuration,
    }).start();
  };

  startDisappearAnimation = () => {
    Animated.timing(this.state.position, {
      toValue: 0,
      duration: defaultDuration,
    }).start();
  };

  get maxHeight() {
    const rowCount = Math.ceil(this.props.data.length / 3);
    return (
      panelHeight +
      rowCount * side +
      handleHeight +
      sizes.halfPadding * (rowCount - 1)
    );
  }

  renderGrid = () => {
    return (
      <Grid
        style={styles.gridContainerStyle}
        showsVerticalScrollIndicator={false}
        data={this.props.data}
        renderItem={({item, index}) => (
          <PhotoItem
            uri={item.node.image.uri}
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

  renderStrip = () => (
    <Items
      Component={Animated.View}
      style={
        {
          ...styles.stripStyle,
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
          ],
        } as {}
      }
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
        key="child"
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
            ...styles.animatedViewStyle,
            height: this.state.position.interpolate({
              inputRange: [Number.MIN_SAFE_INTEGER, 0, this.maxHeight],
              outputRange: [0, 0, this.maxHeight],
              // extrapolateRight: 'clamp',
            }),
          }}>
          {this.renderGrid()}
          {this.renderStrip()}
        </Animated.View>
        {isAnySelection && this.renderChildren()}
      </>
    );
  };
}

const styles = StyleSheet.create({
  photoBgStyle: {
    position: 'absolute',
    width: side,
    height: side,
    ...centerStyle,
    backgroundColor: '#F7F7F7',
  },
  photoCheckboxStyle: {position: 'absolute', right: 5, top: 5},
  stripStyle: {
    position: 'absolute',
    height: panelHeight,
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 45,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  handleContainerStyle: {
    height: handleHeight,
  },
  handleViewStyle: {
    width: 43,
    height: 6,
    backgroundColor: '#C1C1C1',
    borderRadius: 3,
  },
  gridContainerStyle: {
    ...fdr,
    ...fww,
    justifyContent: 'space-between',
    paddingHorizontal: sizes.padding,
  },
  animatedViewStyle: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopLeftRadius: sizes.borderRadius,
    borderTopRightRadius: sizes.borderRadius,
  },
  circleButtonTextStyle: {fontSize: 12, fontWeight: 'bold', color: '#F2F2F2'},
  photoItemContainerStyle: {
    width: side,
    height: side,
    marginBottom: sizes.halfPadding,
    ...centerStyle,
  },
});

export default PickPhotoDrawer;
