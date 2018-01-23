import * as React from 'react';
import { FlatList } from 'react-native';
import * as PropTypes from 'prop-types';
import PaymentItem from './PaymentItem';
import PaymentHeader from './PaymentHeader';

export interface PaymentListProps {
  payments: any[];
}

export interface State {}

const TAG = 'PaymentList';
export default class PaymentList extends React.PureComponent<
  PaymentListProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  renderItem = ({ item }: any) => {
    return <PaymentItem payment={item} />;
  };

  renderHeader = () => {
    let { payments } = this.props;
    return <PaymentHeader payments={payments} />;
  };

  render() {
    let { payments } = this.props;

    return (
      <FlatList
        showsVerticalScrollIndicator={true}
        data={payments}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      />
    );
  }
}
