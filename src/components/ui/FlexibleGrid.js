import React from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import Loading from './Loading';

export default class FlexibleGrid extends React.Component {
  state = {
    itemWidth: 0,
    numColumns: 1
  };

  renderItem = ({ item, index }) => {
    let { renderItem, itemMargin } = this.props;
    let { itemWidth } = this.state;
    let customStyle = { margin: itemMargin };

    if (itemWidth > 0) {
      customStyle.width = itemWidth;
    }
    return <View style={[customStyle]}>{renderItem({ item, index })}</View>;
  };

  onDimensionsChange = ({ window, screen }) => {
    let { itemMargin, itemWidth } = this.props;
    let { width, height } = window;

    let cols = Math.floor(width / itemWidth);
    cols = cols < 1 ? 1 : cols;

    let windowWidth = width - itemMargin * ((cols + 1) * 2) - 1;

    this.setState({
      itemWidth: windowWidth / cols,
      numColumns: cols
    });
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.onDimensionsChange);
    this.onDimensionsChange({ window: Dimensions.get('window') });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  getFlatList() {
    return this.list;
  }

  render() {
    let { renderItem, itemMargin, itemWidth: old, ...props } = this.props;
    let { itemWidth, numColumns } = this.state;
    if (itemWidth === 0) {
      return <Loading margin />;
    }
    return (
      <FlatList
        ref={ref => {
          this.list = ref;
        }}
        {...props}
        renderItem={this.renderItem}
        key={'show_' + numColumns}
        numColumns={numColumns}
        contentContainerStyle={[{ padding: itemMargin }]}
      />
    );
  }
}

const styles = StyleSheet.create({});
