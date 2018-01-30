import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import { PaymentModel } from '../../scraping/student/Intranet';

const numeral = require('numeral');

export interface PaymentHeaderProps {
  payments: PaymentModel[];
}

export interface State {
  totalPayments?: number;
  totalCargo?: number;
  totalSaldo?: number;
  totalInteres?: number;
}

const TAG = 'PaymentHeader';
export default class PaymentHeader extends React.PureComponent<
  PaymentHeaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state: State = {
    totalPayments: 0,
    totalCargo: 0,
    totalSaldo: 0,
    totalInteres: 0
  };

  componentDidMount() {
    let { payments } = this.props;
    let totalPayments = 0;
    let totalCargo = 0;
    let totalSaldo = 0;
    let totalInteres = 0;
    for (let payment of payments) {
      totalPayments += payment.payment;
      totalCargo += payment.charge;
      totalSaldo += payment.balance;
      totalInteres += payment.interest;
    }

    this.setState({
      totalPayments,
      totalCargo,
      totalSaldo,
      totalInteres
    });
  }

  render() {
    let { payments } = this.props;

    if (!payments || payments.length < 1) {
      return null;
    }

    let { totalPayments, totalCargo, totalSaldo, totalInteres } = this.state;
    return (
      <View style={[styles.container]}>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Pago total')}:</Text>
          <Text style={styles.value}>
            S/. {numeral(totalPayments).format()}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Cargo total')}:</Text>
          <Text style={styles.value}>S/. {numeral(totalCargo).format()}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Saldo total')}:</Text>
          <Text style={styles.value}>S/. {numeral(totalSaldo).format()}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Interés total')}:</Text>
          <Text style={styles.value}>S/. {numeral(totalInteres).format()}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 2,
    flexDirection: 'row'
  },
  description: {
    color: 'rgba(255,255,255,0.6)',
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    paddingRight: 5
  },
  value: {
    color: '#fff',
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold'
  },
  container: {
    padding: 10,
    backgroundColor: '#69d258'
  }
});
