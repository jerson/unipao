import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Touchable from '../ui/Touchable';
import { _ } from '../../modules/i18n/Translator';
import ImageUtil from '../../modules/util/ImageUtil';

const TAG = 'AssistItem';
export default class AssistItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  onPress = () => {
    let { assist, disabledPress } = this.props;
    if (disabledPress) {
      return;
    }
    this.context.navigation.navigate('AssistDetail', { assist });
  };

  render() {
    let { assist } = this.props;
    let disabledText = assist.ESTAINHABILITADO.replace(/(<([^>]+)>)/gi, '');
    return (
      <Touchable onPress={this.onPress}>
        <View style={[styles.container]}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.imagePlaceholder}
              source={require('../../images/placeholder.png')}
            />
            <Image
              style={styles.image}
              defaultSource={require('../../images/placeholder.png')}
              source={{ uri: ImageUtil.getUserImage(assist) }}
            />
          </View>

          <View style={[styles.infoContainer]}>
            <Text style={styles.title}>{assist.NOMBRE_CURSO}</Text>
            <View style={styles.info}>
              <View style={styles.left}>
                <View style={styles.item}>
                  <Text style={styles.name}>{_('Asistencias')}</Text>
                  <Text style={[styles.value, { color: '#0d61ac' }]}>
                    {assist.PORCENTAJE_A.replace(/(<([^>]+)>)/gi, '').trim()}
                  </Text>
                </View>
                <View style={styles.item}>
                  <Text style={styles.name}>{_('Faltas')}</Text>
                  <Text style={[styles.value, { color: '#be2924' }]}>
                    {assist.PORCENTAJE_INA.replace(/(<([^>]+)>)/gi, '').trim()}
                  </Text>
                </View>

                <View style={[styles.item, { paddingTop: 5 }]}>
                  <Text style={styles.period}>{assist.PERIODO}</Text>
                  <Text
                    style={[
                      styles.value,
                      { fontWeight: 'bold' },
                      disabledText.toLowerCase().indexOf('inha') !== -1
                        ? { color: '#be2924' }
                        : { color: '#69d258' }
                    ]}
                  >
                    {disabledText}
                  </Text>
                </View>
              </View>

              <View style={styles.right}>
                <Text style={styles.percent}>{assist.PORCENTAJE_TOTAL}</Text>
                <Text style={styles.percentLabel}>{_('Asistencias')}</Text>
              </View>
            </View>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: '#f4f4f4',
    borderBottomWidth: 1,
    padding: 10,
    flexDirection: 'row'
  },
  imageContainer: {
    padding: 5,
    paddingLeft: 0,
    position: 'relative',
    justifyContent: 'center'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2
  },
  imagePlaceholder: {
    position: 'absolute',
    left: 0,
    width: 50,
    height: 50,
    borderRadius: 50 / 2
  },
  infoContainer: {
    flex: 1
  },
  info: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 5
  },
  item: {
    flexDirection: 'row'
  },
  title: {
    paddingLeft: 5,
    fontSize: 13,
    color: '#222',
    paddingBottom: 5
  },
  name: {
    fontSize: 11,
    color: '#666',
    flex: 1
  },
  percent: {
    fontSize: 18,
    color: '#ff9e30',
    fontWeight: 'bold'
  },
  percentLabel: {
    fontSize: 12,
    color: '#666'
  },
  period: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444',
    flex: 1
  },
  value: {
    fontSize: 11,
    flex: 1
  },
  left: {
    flex: 1
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
