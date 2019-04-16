import * as React from 'react';
import { FlatList } from 'react-native';
import * as PropTypes from 'prop-types';
import ScheduleItem from './ScheduleItem';
import AlertMessage from '../ui/AlertMessage';
import { _ } from '../../modules/i18n/Translator';

export interface ScheduleListProps {
  schedule: any;
}

export interface State {}

const TAG = 'ScheduleList';
export default class ScheduleList extends React.PureComponent<
  ScheduleListProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  state: State = {};

  renderItem = ({ item }: any) => {
    return <ScheduleItem item={item} />;
  };

  render() {
    const { schedule } = this.props;

    if (!schedule || schedule.length < 1) {
      return <AlertMessage type={'warning'} title={_('No tienes clases')} />;
    }

    return (
      <FlatList
        showsVerticalScrollIndicator={true}
        data={schedule}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      />
    );
  }
}
