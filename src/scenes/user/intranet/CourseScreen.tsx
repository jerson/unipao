import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Theme } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import { _ } from '../../../modules/i18n/Translator';
import DimensionUtil from '../../../modules/util/DimensionUtil';
import CourseOptionItem from '../../../components/course/CourseOptionItem';
import CourseHeader from '../../../components/course/CourseHeader';
import Loading from '../../../components/ui/Loading';
import NavigationButton from '../../../components/ui/NavigationButton';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp
} from 'react-navigation';

export interface CourseItemModel {
  route: string;
  name: string;
  icon?: string;
  iconType?: string;
}

export interface CourseScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  cacheLoaded: boolean;
  items: CourseItemModel[];
}

const TAG = 'CourseScreen';
export default class CourseScreen extends React.Component<
  CourseScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps) => ({
    title: '',
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      { backgroundColor: 'transparent' }
    ],
    header: null
  });

  state: State = {
    isLoading: true,
    cacheLoaded: false,
    isRefreshing: false,
    items: [
      {
        route: 'CourseSyllable',
        name: _('Silabo'),
        icon: 'file-document',
        iconType: 'MaterialCommunityIcons'
      },
      {
        route: 'CourseMaterials',
        name: _('Material'),
        icon: 'archive',
        iconType: 'MaterialIcons'
      },
      {
        route: 'CourseAssists',
        name: _('Asistencia'),
        icon: 'calendar-today',
        iconType: 'MaterialCommunityIcons'
      },
      {
        route: 'CourseGrades',
        name: _('Notas'),
        icon: 'grade',
        iconType: 'MaterialIcons'
      },
      {
        route: 'CourseForum',
        name: _('Foro'),
        icon: 'forum',
        iconType: 'MaterialIcons'
      },
      {
        route: 'CourseJobs',
        name: _('Trabajo'),
        icon: 'archive',
        iconType: 'Entypo'
      },
      {
        route: 'CourseExams',
        name: _('Examenes'),
        icon: 'ios-paper',
        iconType: 'Ionicons'
      }
    ]
  };

  renderItem = ({ item, index }: ListRenderItemInfo<CourseItemModel>) => {
    return (
      <CourseOptionItem
        option={item}
        onChooseItem={() => {
          this.onChooseItem(item);
        }}
      />
    );
  };

  onChooseItem = (item: CourseItemModel) => {
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

  getParams(): any {
    let { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.load();
  }

  render() {
    let { items, isRefreshing, isLoading } = this.state;
    let paddingTop = DimensionUtil.getNavigationBarHeight();

    return (
      <View style={[styles.container]}>
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
              return index.toString();
            }}
          />
        )}
        <NavigationButton
          onPress={() => {
            this.props.navigation.goBack();
          }}
          subMenu
          style={{ top: Platform.OS === 'ios' ? 20 : 5 }}
          icon={'arrow-back'}
        />
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
