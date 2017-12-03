import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Log from '../../modules/logger/Log';
import Request from '../../modules/network/Request';
import Icon from '../ui/Icon';
import Loading from '../ui/Loading';
import { _ } from '../../modules/i18n/Translator';
import Touchable from '../ui/Touchable';

const TAG = 'IntranetHeader';
export default class IntranetHeader extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {
    currentIndex: 0,
    isLoading: false,
    careers: [],
    career: null
  };

  load = async () => {
    this.setState({ isLoading: true });

    try {
      let response = await Request.post(
        'av/ej/carreras',
        {
          accion: 'LIS_CAR'
        },
        { secure: true }
      );

      let { body } = response;
      let data1 = [];
      let data2 = [];
      if (body.data_carreras) {
        data1 = JSON.parse(body.data_carreras);
      }
      if (body.data_ingles) {
        data2 = JSON.parse(body.data_ingles);
      }
      let data = [...data1, ...data2];
      let career = data[0] || null;
      this.setState({ careers: data, career, isLoading: false });

      let { onChooseCareer } = this.props;
      if (typeof onChooseCareer === 'function') {
        onChooseCareer(career);
      }
    } catch (e) {
      Log.warn(TAG, 'load', e);
      this.setState({ isLoading: false });
    }
  };

  prev = () => {
    let { width } = Dimensions.get('screen');
    let { careers, currentIndex } = this.state;
    let index = currentIndex - 1;
    if (index < 0) {
      index = careers.length - 1;
    }

    this.setState({ currentIndex: index });

    if (this.refs.scroll) {
      this.refs.scroll.scrollTo({ x: index * width, animated: true });
    }
  };
  next = () => {
    let { width } = Dimensions.get('screen');
    let { careers, currentIndex } = this.state;
    let index = currentIndex + 1;
    if (index > careers.length - 1) {
      index = 0;
    }

    this.setState({ currentIndex: index });
    if (this.refs.scroll) {
      this.refs.scroll.scrollTo({ x: index * width, animated: true });
    }
  };
  onMomentumScrollEnd = e => {
    let offset = e.nativeEvent.contentOffset.x || 0;
    let currentIndex = 0;
    if (offset > 1) {
      let { width } = Dimensions.get('screen');
      currentIndex = Math.round(offset / width);
    }

    let { onChooseCareer } = this.props;
    let { careers } = this.state;
    let career = careers[currentIndex];
    this.setState({ career, currentIndex });

    if (typeof onChooseCareer === 'function') {
      onChooseCareer(career);
    }
  };

  componentDidMount() {
    this.load();
  }

  render() {
    let { width } = Dimensions.get('screen');
    let { careers, isLoading } = this.state;
    return (
      <View style={[styles.container]}>
        {/*<LinearGradient*/}
        {/*colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}*/}
        {/*style={styles.gradient}*/}
        {/*/>*/}
        {isLoading && <Loading margin color={'#fff'} />}
        {!isLoading && (
          <ScrollView
            ref={'scroll'}
            horizontal
            pagingEnabled
            onMomentumScrollEnd={this.onMomentumScrollEnd}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.scrollView}>
              {careers.map((career, index) => {
                return (
                  <View key={index} style={[styles.career, { width }]}>
                    <View style={styles.info}>
                      <Text style={styles.campus}>
                        {_('Sede {name}', {
                          name: career.CAMP_DES
                        }).toUpperCase()}
                      </Text>
                      <Text style={styles.name}>{career.DESC_CARRERA}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
        {careers.length > 1 && (
          <Touchable onPress={this.prev} style={styles.optionsLeft}>
            <Icon
              style={styles.iconOpen}
              name={'navigate-before'}
              type={'MaterialIcons'}
            />
          </Touchable>
        )}
        {careers.length > 1 && (
          <Touchable onPress={this.next} style={styles.optionsRight}>
            <Icon
              style={styles.iconOpen}
              name={'navigate-next'}
              type={'MaterialIcons'}
            />
          </Touchable>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d61ac',
    flexDirection: 'column',
    minHeight: 80,
    justifyContent: 'center'
  },
  gradient: {
    opacity: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80
  },
  optionsLeft: {
    position: 'absolute',
    left: 5,
    bottom: 15
  },
  optionsRight: {
    position: 'absolute',
    right: 5,
    bottom: 15
  },
  iconOpen: {
    fontSize: 40,
    padding: 0,
    color: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent'
  },
  career: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  scrollView: {
    flexDirection: 'row'
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center'
  },
  campus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center'
  }
});
