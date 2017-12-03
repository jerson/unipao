import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import PaymentItem from './PaymentItem';
import PaymentHeader from './PaymentHeader';

const TAG = 'PaymentList';
export default class PaymentList extends React.PureComponent {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  renderItem = ({ item }) => {
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
        data={payments}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => {
          return index;
        }}
      />
    );
  }
}
