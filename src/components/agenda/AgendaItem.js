import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import HTMLView from 'react-native-htmlview';
import { _ } from '../../modules/i18n/Translator';

const TAG = 'AgendaItem';
export default class AgendaItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { agenda, index, isToday } = this.props;
    let content = agenda.CONTENIDO.replace(/(\r\n|\n|\r)/gm, '')
      .replace(/(<([^>]+)>)/gi, '')
      .trim();
    let day = (agenda.DIA1 || '').trim();
    let dayMonth = (agenda.FECHAFINAL || '').trim();
    let dayName = (agenda.FECHAFINAL1 || '').trim();

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
            <Text style={[styles.name]}>{agenda.TITULO.trim()}</Text>
            <Text style={[styles.subtitle]}>{agenda.DESC_ORG.trim()}</Text>
          </View>
        </View>
        <HTMLView
          addLineBreaks={false}
          value={'<p>' + content + '</p>'}
          stylesheet={stylesHTML}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderBottomWidth: 1,
    minHeight: 120,
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
    fontSize: 16,
    backgroundColor: 'transparent'
  },

  subtitle: {
    color: 'rgba(0,0,0,0.55)',
    fontSize: 13,
    backgroundColor: 'transparent'
  }
});

const stylesHTML = StyleSheet.create({
  p: {
    color: '#555',
    marginTop: 2,
    marginBottom: 2
  }
});
