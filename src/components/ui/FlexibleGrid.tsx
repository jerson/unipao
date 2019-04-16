import * as React from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProperties,
  ListRenderItem,
  ListRenderItemInfo,
  ScaledSize,
  StyleSheet,
  View,
} from 'react-native';
import Loading from './Loading';

export interface FlexibleGridProps<ItemT> extends FlatListProperties<ItemT> {
  renderItem: ListRenderItem<any>;
  keyExtractor?: (item: any, index: number) => string;
  itemMargin: number;
  itemWidth: number;
}

export interface State {
  itemWidth: number;
  numColumns: number;
}

export interface DimensionsChange {
  window: ScaledSize;
  screen?: ScaledSize;
}

export default class FlexibleGrid<ItemT> extends React.Component<
  FlexibleGridProps<ItemT>,
  State
> {
  state: State = {
    itemWidth: 0,
    numColumns: 1,
  };

  refs: any;

  renderItem = (data: ListRenderItemInfo<ItemT>) => {
    const { renderItem, itemMargin } = this.props;
    const { itemWidth } = this.state;
    const customStyle = { margin: itemMargin, width: 0 };

    if (itemWidth > 0) {
      customStyle.width = itemWidth;
    }
    return <View style={[customStyle]}>{renderItem(data)}</View>;
  };

  onDimensionsChange = ({ window, screen }: DimensionsChange) => {
    const { itemMargin, itemWidth } = this.props;
    const { width, height } = window;

    let cols = Math.floor(width / itemWidth);
    cols = cols < 1 ? 1 : cols;

    const windowWidth = width - itemMargin * ((cols + 1) * 2) - 1;

    this.setState({
      itemWidth: windowWidth / cols,
      numColumns: cols,
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
    return this.refs.list;
  }

  render() {
    const {
      renderItem,
      itemMargin,
      contentContainerStyle,
      itemWidth: old,
      ...props
    } = this.props;
    const { itemWidth, numColumns } = this.state;
    if (itemWidth === 0) {
      return <Loading margin />;
    }
    return (
      <FlatList
        ref={'list'}
        {...props}
        renderItem={this.renderItem}
        key={'show_' + numColumns}
        numColumns={numColumns}
        contentContainerStyle={[contentContainerStyle, { padding: itemMargin }]}
      />
    );
  }
}

const styles = StyleSheet.create({});
