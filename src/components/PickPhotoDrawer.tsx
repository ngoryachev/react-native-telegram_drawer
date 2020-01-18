import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import {fdr, fww} from '../../uiUtils';
import sizes from '../styles/sizes';
import R from 'ramda';
import {Circle, Grid, Row} from '../../components';
import {Proc} from '../../declarations';

const side = (Dimensions.get('window').width - sizes.padding * 3) / 3;

type PhotoItemProps = {
  onPress?: Proc;
  source?: any;
  isSelected: boolean;
};

const PhotoItem = (props: PhotoItemProps) => (
  <View>
    <Image
      source={props.source}
      style={{
        width: side,
        height: side,
        backgroundColor: '#F7F7F7',
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

interface PickPhotoDrawerState {
  selection: boolean[];
}

interface PickPhotoDrawerProps {
  data: any[];
}

class PickPhotoDrawer extends React.Component<
  PickPhotoDrawerProps,
  PickPhotoDrawerState
> {
  state = {
    selection: R.map(R.always(false), this.props.data),
  };

  handlePhotoItemPress = (index: number) => {
    const {selection} = this.state;
    const newSelection = R.over(R.lensIndex(index), R.not, selection);

    this.setState({selection: newSelection});
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

  renderStrip = () => {};

  render = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          position: 'absolute',
          width: '100%',
          height: '50%',
          bottom: 0,
          borderTopLeftRadius: sizes.borderRadius,
          borderTopRightRadius: sizes.borderRadius,
        }}>
        {this.renderGrid()}
      </View>
    );
  };
}

export default PickPhotoDrawer;
