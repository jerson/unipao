import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import { GradeReportModel } from '../../scraping/student/intranet/Grade';

const numeral = require('numeral');

export interface GradeReportHeaderProps {
  report: GradeReportModel;
}

export interface State {}

const TAG = 'GradeReportHeader';
export default class GradeReportHeader extends React.PureComponent<
  GradeReportHeaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  state: State = {};

  render() {
    const { report } = this.props;

    return (
      <View style={[styles.container]}>
        <View style={styles.item}>
          <Text style={styles.description}>
            {_('Promedio Ponderado acumulado')}:
          </Text>
          <Text style={styles.value}>{report.weightedAverageCumulative}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>
            {_('Promedio ponderado semestral')}:
          </Text>
          <Text style={styles.value}>{report.semiannualWeightedAverage}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Cursos Aprobados')}:</Text>
          <Text style={styles.value}>{report.approvedCourses}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Créditos Aprobados')}:</Text>
          <Text style={styles.value}>{report.approvedCredits}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>
            {_('Último Semestre Académico')}:
          </Text>
          <Text style={styles.value}>{report.lastAcademicSemester}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Egresado')}:</Text>
          <Text style={styles.value}>
            {report.graduated ? _('Si') : _('No')}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    padding: 1,
    flexDirection: 'row',
  },
  description: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    paddingRight: 5,
  },
  value: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  container: {
    padding: 10,
    backgroundColor: '#0d61ac',
  },
});
