import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import AlertMessage from '../ui/AlertMessage';
import { _ } from '../../modules/i18n/Translator';
import * as numeral from 'numeral';

const TAG = 'PaymentHeader';
export default class PaymentHeader extends React.PureComponent {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  componentDidMount() {
    let { payments } = this.props;
    let totalPayments = 0;
    let totalCargo = 0;
    let totalSaldo = 0;
    let totalInteres = 0;
    for (let payment of payments) {
      totalPayments += parseFloat(payment.PAGO);
      totalCargo += parseFloat(payment.CARGO);
      totalSaldo += parseFloat(payment.SALDO);
      totalInteres += parseFloat(payment.INTERES);
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
      return (
        <AlertMessage type={'warning'} title={_('No se encontraron datos')} />
      );
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
