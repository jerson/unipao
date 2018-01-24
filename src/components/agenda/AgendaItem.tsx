import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';

export interface AgendaItemProps {
  agenda: any;
  index: number;
  isToday: boolean;
}

export interface State {}

const TAG = 'AgendaItem';
export default class AgendaItem extends React.Component<
  AgendaItemProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {};

  render() {
    let { agenda, index, isToday } = this.props;
    let day = agenda.dayOfMonth;
    let dayName = agenda.dayName;

    return (
      <View style={[styles.container, isToday && styles.today]}>
        <View style={styles.header}>
          <View style={[styles.dateContainer]}>
            <View style={[styles.date]}>
              <Text style={[styles.day]}>{day}</Text>
              <Text style={[styles.dayName]} numberOfLines={1}>
                {dayName}
              </Text>
            </View>
            {isToday && (
              <View style={[styles.todayIcon]}>
                <Text style={[styles.todayText]}>{_('Hoy').toUpperCase()}</Text>
              </View>
            )}
          </View>

          <View style={styles.titleContainer}>
            <Text style={[styles.name]}>{agenda.title}</Text>
            <Text style={[styles.property]}>{agenda.property}</Text>
            <Text style={[styles.subtitle]}>{agenda.description}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1'
  },
  todayIcon: {
    borderRadius: 4,
    padding: 2,
    paddingLeft: 4,
    paddingRight: 4,
    backgroundColor: '#0d61ac',
    position: 'absolute',
    right: 2,
    top: 3
  },
  todayText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 9
  },
  today: {
    backgroundColor: '#fbf3e1'
  },
  date: {
    backgroundColor: '#d82f29',
    borderRadius: 6,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55
  },
  dateContainer: {
    paddingRight: 10,
    paddingTop: 0
  },
  day: {
    color: '#fff',
    fontSize: 22
  },
  dayName: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleContainer: {
    flex: 1
  },

  name: {
    color: 'rgba(0,0,0,0.95)',
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  property: {
    color: 'rgba(0,0,0,0.35)',
    fontSize: 12,
    backgroundColor: 'transparent'
  },

  subtitle: {
    color: 'rgba(0,0,0,0.55)',
    fontSize: 11,
    backgroundColor: 'transparent'
  }
});
