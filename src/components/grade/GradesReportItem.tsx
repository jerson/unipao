import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Touchable from '../ui/Touchable';
const numeral = require('numeral');
const { capitalize } = require('underscore.string');
import { _ } from '../../modules/i18n/Translator';
import Modal from '../ui/Modal';
import {
  GradeReportCourseModel,
  GradeReportModel
} from '../../scraping/student/Intranet';

export interface GradeReportItemProps {
  item: GradeReportCourseModel;
}

export interface State {}

const TAG = 'GradeReportItem';
export default class GradeReportItem extends React.PureComponent<
  GradeReportItemProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {};

  render() {
    let { item } = this.props;

    return (
      <View style={[styles.container]}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.description}</Text>
          <Text style={styles.subtitle}>
            {item.course}
            {' - '}
            {_('creditos: {credits}', { credits: item.credits })}
            {' - '}
            {_('periodo: {period}', { period: item.semester })}
            {' - '}
            {item.type}
          </Text>
        </View>
        <View style={styles.right}>
          <View style={styles.gradeContainer}>
            <Text style={styles.grade}>{item.finalGrade}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 5,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    height: 58
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
  right: {
    alignItems: 'center'
  },
  name: {
    fontSize: 13,
    color: '#666'
  },
  subtitle: {
    fontSize: 12,
    color: '#999'
  },
  grade: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  gradeContainer: {
    padding: 4,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    borderRadius: 15,
    backgroundColor: '#666b76'
  }
});
