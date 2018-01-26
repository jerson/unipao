import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../../../themes/styles';
import { _ } from '../../../modules/i18n/Translator';
import NavigationButton from '../../../components/ui/NavigationButton';
import Loading from '../../../components/ui/Loading';
import * as PropTypes from 'prop-types';
import {
  NavigationNavigatorProps,
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  TabNavigator
} from 'react-navigation';
import { tabsOptions } from '../../../routers/Tabs';
import Log from '../../../modules/logger/Log';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import JobsSectionScreen from './course/JobsSectionScreen';
import { SectionModel } from '../../../scraping/student/intranet/Course';
import AlertMessage from '../../../components/ui/AlertMessage';

export interface CourseJobsScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  tabs: any;
  isLoading: boolean;
  cacheLoaded: boolean;
  isReloading: boolean;
}

const TAG = 'CourseJobsScreen';
export default class CourseJobsScreen extends React.Component<
  CourseJobsScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    headerBackTitle: null,
    title: _('Trabajos del curso'),
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [Theme.navigationBar, Theme.subNavigationBar],
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <NavigationButton
          onPress={() => {
            navigation.state.params.reload();
          }}
          icon={'refresh'}
          iconType={'MaterialIcons'}
        />
      </View>
    )
  });

  state: State = {
    tabs: null,
    isLoading: true,
    cacheLoaded: false,
    isReloading: false
  };
  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();
    await this.loadRequest();
  };
  getCacheKey = () => {
    let { course } = this.getParams();
    return `jobs_sections_${course.id || '_'}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (data: SectionModel[], cacheLoaded = false) => {
    let tabs: any = {};

    for (let item of data) {
      if (!tabs[item.name]) {
        tabs[item.name] = {
          screen: ({
            navigation,
            screenProps
          }: NavigationNavigatorProps<null>) => {
            return <JobsSectionScreen section={item} />;
          },
          navigationOptions: ({
            navigation,
            screenProps
          }: NavigationNavigatorProps<null>) => {
            return {
              tabBarLabel: item.name
            };
          }
        };
      }
    }

    let totalTabs = Object.keys(tabs);
    if (totalTabs.length < 1) {
      tabs = {
        NO: {
          screen: () => {
            return <AlertMessage message={_('No hay datos')} />;
          },
          navigationOptions: {
            tabBarLabel: _('Error')
          }
        }
      };
    }
    let Tabs = TabNavigator(tabs, {
      ...tabsOptions,
      tabBarOptions: {
        ...tabsOptions.tabBarOptions,
        scrollEnabled: false
      }
    });
    this.setState({
      cacheLoaded,
      tabs: Tabs,
      isLoading: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;

    try {
      let { course } = this.getParams();
      let sections = await UPAO.Student.Intranet.Course.getJobsSections(course);

      this.loadResponse(sections);
      CacheStorage.set(this.getCacheKey(), sections);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse([]);
      } else {
        this.setState({ isLoading: false });
      }
    }
  };
  reload = () => {
    this.load();
  };

  componentWillUnmount() {
    UPAO.abort('Course.getJobsSections');
  }

  getParams(): any {
    let { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.load();
  }

  render() {
    let { tabs, isLoading } = this.state;
    let Tabs = tabs;

    return (
      <View style={[styles.container]}>
        {isLoading && <Loading margin />}
        {!isLoading && Tabs && <Tabs />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
