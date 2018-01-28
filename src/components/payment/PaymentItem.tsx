import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Touchable from '../ui/Touchable';
const numeral = require('numeral');
import { capitalize } from 'underscore.string';
import { _ } from '../../modules/i18n/Translator';
import Modal from '../ui/Modal';
import { PaymentModel } from '../../scraping/student/Intranet';

export interface PaymentItemProps {
  payment: PaymentModel;
}

export interface State {
  expanded: boolean;
}

const TAG = 'PaymentItem';
export default class PaymentItem extends React.PureComponent<
  PaymentItemProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {
    expanded: false
  };

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    let { expanded } = this.state;
    let { payment } = this.props;

    return (
      <View>
        <Touchable onPress={this.toggle}>
          <View style={[styles.container]}>
            <View style={styles.info}>
              <Text style={styles.name}>{payment.description}</Text>
              <Text style={styles.subtitle}>
                {payment.period} - {capitalize(payment.date, true)}
              </Text>
            </View>
            <View style={styles.payment}>
              <View style={styles.amountContainer}>
                <Text style={styles.amount}>
                  S/ {numeral(payment.charge).format()}
                </Text>
              </View>
            </View>
          </View>
        </Touchable>
        <Modal
          isVisible={expanded}
          onBackButtonPress={this.toggle}
          onBackdropPress={this.toggle}
          style={styles.modal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{payment.description}</Text>

            <View style={styles.item}>
              <Text style={styles.description}>{_('Recibo')}:</Text>
              <Text style={styles.value}> {payment.receipt}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.description}>{_('Periodo')}:</Text>
              <Text style={styles.value}> {payment.period}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.description}>{_('Concepto')}:</Text>
              <Text style={styles.value}> {payment.concept}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.description}>{_('Forma pago')}:</Text>
              <Text style={styles.value}> {payment.conceptPayment}</Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.description}>{_('Fecha')}:</Text>
              <Text style={styles.value}> {payment.date}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.description}>{_('Cargo')}:</Text>
              <Text style={styles.value}>
                S/ {numeral(payment.charge).format()}
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.description}>{_('Pago')}:</Text>
              <Text style={styles.value}>
                S/ {numeral(payment.payment).format()}
              </Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.description}>{_('Saldo')}:</Text>
              <Text style={styles.value}>
                S/ {numeral(payment.balance).format()}
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.description}>{_('Interés')}:</Text>
              <Text style={styles.value}>
                S/ {numeral(payment.interest).format()}
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 58
  },
  modal: {
    alignItems: 'center'
  },
  modalContainer: {
    maxWidth: 300,
    padding: 5,
    width: 300,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 4
  },
  item: {
    padding: 2,
    flexDirection: 'row'
  },
  description: {
    color: 'rgba(0,0,0,0.6)',
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    paddingRight: 5
  },
  value: {
    color: '#000',
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold'
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 5
  },
  payment: {
    alignItems: 'center'
  },
  title: {
    fontSize: 13,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5
  },
  name: {
    fontSize: 13,
    color: '#666'
  },
  subtitle: {
    fontSize: 12,
    color: '#999'
  },
  amount: {
    fontSize: 14,
    color: '#fff'
  },
  amountContainer: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#69d258'
  }
});
