import React from 'react';
import {Image, View, Dimensions, ScrollView} from 'react-native';
import {fdr, fww} from '../../uiUtils';
import sizes from '../styles/sizes';
import R from 'ramda';
import {Grid} from '../../components';

interface PPDProps {}

interface PPDState {}

const side = (Dimensions.get('window').width - sizes.padding * 3) / 3;

const PhotoItem = () => (
  <Image
    style={{
      width: side,
      height: side,
      backgroundColor: 'blue',
      marginBottom: sizes.halfPadding,
    }}
  />
);

const Handle = () => <View />;

class PickPhotoDrawer extends React.Component<PPDProps, PPDState> {
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
        data={[1, 2, 3, 4]}
        renderItem={R.always(<PhotoItem />)}
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
          backgroundColor: 'red',
          position: 'absolute',
          width: '100%',
          height: '50%',
          bottom: 0,
        }}>
        {this.renderGrid()}
      </View>
    );
  };
}

export default PickPhotoDrawer;
