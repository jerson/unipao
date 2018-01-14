import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Theme } from '../../../themes/styles';
import PropTypes from 'prop-types';
import { _ } from '../../../modules/i18n/Translator';
import DimensionUtil from '../../../modules/util/DimensionUtil';
import CourseOptionItem from '../../../components/course/CourseOptionItem';
import CourseHeader from '../../../components/course/CourseHeader';
import Loading from '../../../components/ui/Loading';
import NavigationButton from '../../../components/ui/NavigationButton';

const TAG = 'CourseScreen';
export default class CourseScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: _('Curso'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ],
    headerRight: (
      <NavigationButton
        onPress={() => {
          navigation.state.params.reload();
        }}
        icon={'refresh'}
        iconType={'MaterialIcons'}
      />
    )
  });

  state = {
    isLoading: true,
    isRefreshing: false,
    items: [
      {
        route: 'CourseSyllable',
        name: _('Silabo'),
        icon: 'schedule',
        iconType: 'MaterialIcons'
      },
      {
        route: 'CourseMaterials',
        name: _('Material'),
        icon: 'calendar-check-o',
        iconType: 'FontAwesome'
      },
      {
        route: 'CourseAssists',
        name: _('Asistencia'),
        icon: 'results-demographics',
        iconType: 'Foundation'
      },
      {
        route: 'CourseGrades',
        name: _('Notas'),
        icon: 'monetization-on',
        iconType: 'MaterialIcons'
      },
      {
        route: 'CourseForum',
        name: _('Foro'),
        icon: 'monetization-on',
        iconType: 'MaterialIcons'
      },
      {
        route: 'CourseJobs',
        name: _('Trabajo'),
        icon: 'monetization-on',
        iconType: 'MaterialIcons'
      },
      {
        route: 'CourseExams',
        name: _('Examenes'),
        icon: 'monetization-on',
        iconType: 'MaterialIcons'
      }
    ]
  };

  renderItem = ({ item, index }) => {
    return (
      <CourseOptionItem
        option={item}
        onChooseItem={() => {
          this.onChooseItem(item);
        }}
      />
    );
  };

  onChooseItem = item => {
    let { course } = this.getParams();
    this.props.navigation.navigate(item.route, { course });
  };

  renderHeader = () => {
    let { course } = this.getParams();
    return <CourseHeader course={course} />;
  };
  load = () => {
    this.setState({ isLoading: true }, () => {
      this.setState({ isLoading: false, isRefreshing: false });
    });
  };
  reload = () => {
    this.onRefresh();
  };
  onRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.load();
    });
  };

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.load();
  }

  render() {
    let paddingTop = DimensionUtil.getNavigationBarHeight();
    let { items, isRefreshing, isLoading } = this.state;

    return (
      <View style={[styles.container, { paddingTop }]}>
        {isLoading && <Loading margin />}

        {!isLoading && (
          <FlatList
            showsVerticalScrollIndicator={true}
            data={items}
            ListHeaderComponent={this.renderHeader}
            renderItem={this.renderItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh}
              />
            }
            keyExtractor={(item, index) => {
              return index;
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
