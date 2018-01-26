import * as React from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProperties,
  ListRenderItem,
  ListRenderItemInfo,
  ScaledSize,
  StyleSheet,
  TextInput,
  View
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
    numColumns: 1
  };

  refs: {
    [string: string]: any;
    input: TextInput;
  };

  renderItem = (data: ListRenderItemInfo<ItemT>) => {
    let { renderItem, itemMargin } = this.props;
    let { itemWidth } = this.state;
    let customStyle = { margin: itemMargin, width: 0 };

    if (itemWidth > 0) {
      customStyle.width = itemWidth;
    }
    return <View style={[customStyle]}>{renderItem(data)}</View>;
  };

  onDimensionsChange = ({ window, screen }: DimensionsChange) => {
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
    return this.refs.list;
  }

  render() {
    let { renderItem, itemMargin, itemWidth: old, ...props } = this.props;
    let { itemWidth, numColumns } = this.state;
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
        contentContainerStyle={[{ padding: itemMargin }]}
      />
    );
  }
}

const styles = StyleSheet.create({});
