import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import SelectModal from '../ui/SelectModal';
import Request from '../../modules/network/Request';
import Log from '../../modules/logger/Log';
import CacheStorage from '../../modules/storage/CacheStorage';

const TAG = 'PeriodModal';
export default class PeriodModal extends React.PureComponent {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {
    isLoading: true,
    showModal: false,
    periods: [],
    period: {}
  };

  show = () => {
    this.setState({ showModal: true });
  };
  hide = () => {
    this.setState({ showModal: false });
  };
  toggle = () => {
    this.setState({ showModal: !this.state.showModal });
  };
  onChange = value => {
    let { periods } = this.state;
    let { onChange } = this.props;
    let period = periods.find(period => {
      return period.PERIODO === value;
    });

    this.setState({ period, showModal: false });

    if (typeof onChange === 'function') {
      onChange(period);
    }
  };
  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();

    await this.loadRequest();
  };
  getCacheKey = () => {
    return `periods`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };

  loadResponse = (body, cacheLoaded = false) => {
    let { onLoaded } = this.props;
    if (body.data) {
      let periods = JSON.parse(body.data);
      // periods.sort((a, b) => {
      //   let value1 = this.parseLevelSort(a.NIVEL);
      //   let value2 = this.parseLevelSort(b.NIVEL);
      //   return value1 < value2;
      // });
      periods.sort((a, b) => {
        let value1 = parseFloat(a.PERIODO);
        let value2 = parseFloat(b.PERIODO);
        return value1 < value2;
      });
      let period = this.state.period || periods[0] || {};
      this.setState({ cacheLoaded, periods, period, isLoading: false });

      if (typeof onLoaded === 'function') {
        onLoaded(periods);
      }
    }
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;
    try {
      let response = await Request.post(
        'av/ej/fichamatricula',
        {
          accion: 'LIS_PERIODO'
        },
        { secure: true }
      );

      let { body } = response;
      this.loadResponse(body);
      CacheStorage.set(this.getCacheKey(), body);
    } catch (e) {
      Log.warn(TAG, 'loadPeriods', e);
      if (!cacheLoaded) {
        this.loadResponse({});
      } else {
        this.setState({ isLoading: false });
      }
    }
  };

  parseLevelSort = level => {
    switch (level) {
      case 'GR':
        return 0;
      case 'UT':
        return 1;
      case 'EU':
        return 2;
      case 'UG':
        return 3;
      case 'UB':
      default:
        return 4;
    }
  };

  parseLevel = level => {
    switch (level) {
      case 'GR':
        return _('Postgrado');
      case 'UT':
        return _('Gente que trabaja');
      case 'EU':
        return _('Ext. Universitaria');
      case 'UG':
        return _('Pregrado');
      case 'UB':
        return _('Centro de idiomas');
      default:
        return level;
    }
  };

  componentDidMount() {
    let { isVisible, period } = this.props;
    this.setState({ showModal: isVisible, period }, () => {
      this.load();
    });
  }

  render() {
    let { periods, showModal, isLoading, period } = this.state;

    return (
      <View>
        {!isLoading &&
          periods.length > 0 && (
            <SelectModal
              isVisible={showModal}
              title={_('Elige el periodo')}
              onCancel={this.hide}
              values={periods.map(period => {
                return {
                  value: period.PERIODO,
                  label: period.PERIODO,
                  icon: 'timelapse',
                  iconType: 'MaterialCommunityIcons',
                  subtitle: this.parseLevel(period.NIVEL)
                };
              })}
              onValueChange={this.onChange}
              selectedValue={period.PERIODO}
            />
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({});
