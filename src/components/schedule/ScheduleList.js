import React from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import ScheduleItem from './ScheduleItem';
import AlertMessage from '../ui/AlertMessage';
import { _ } from '../../modules/i18n/Translator';

const TAG = 'ScheduleList';
export default class ScheduleList extends React.PureComponent {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  renderItem = ({ item }) => {
    return <ScheduleItem item={item} />;
  };

  render() {
    let { schedule } = this.props;

    if (!schedule || schedule.length < 1) {
      return <AlertMessage type={'warning'} title={_('No tienes clases')} />;
    }

    return (
      <FlatList
        data={schedule}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => {
          return index;
        }}
      />
    );
  }
}
