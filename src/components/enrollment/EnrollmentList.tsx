import * as React from 'react';
import { ListRenderItemInfo, SectionList, SectionListData } from 'react-native';
import * as PropTypes from 'prop-types';
import EnrollmentItem from './EnrollmentItem';
import EnrollmentHeader from './EnrollmentHeader';
import EnrollmentInfoHeader from './EnrollmentInfoHeader';

export interface EnrollmentListProps {
  enrollments: any[];
}

export interface State {
  sections: any[];
}

const TAG = 'EnrollmentList';
export default class EnrollmentList extends React.Component<
  EnrollmentListProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state: State = {
    sections: []
  };

  renderItem = ({ item }: ListRenderItemInfo<any>) => {
    return <EnrollmentItem enrollment={item} />;
  };

  renderHeader = ({ section }: { section: SectionListData<any> }) => {
    if (typeof section.title === 'object') {
      return <EnrollmentInfoHeader first={section.title} />;
    }
    return (
      <EnrollmentHeader enrollments={section.data} title={section.title} />
    );
  };

  componentDidMount() {
    let { enrollments } = this.props;
    let courses: { [key: string]: any } = {};
    let first = enrollments[0] || {};

    for (let enrollment of enrollments) {
      let name = enrollment.NOMBRE_CURSO || 'ERR';
      if (!courses[name]) {
        courses[name] = [];
      }

      courses[name].push(enrollment);
    }
    let sections = [
      {
        data: [],
        title: first
      }
    ];
    let keys = Object.keys(courses);

    for (let key of keys) {
      sections.push({
        data: courses[key],
        title: key
      });
    }

    this.setState({ sections });
  }

  render() {
    let { sections } = this.state;

    if (sections.length < 2) {
      return null;
    }

    return (
      <SectionList
        sections={sections}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={true}
        renderSectionHeader={this.renderHeader}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      />
    );
  }
}
