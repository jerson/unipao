import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Color, Theme } from '../../../../themes/styles';
import { _ } from '../../../../modules/i18n/Translator';
import NavigationButton from '../../../../components/ui/NavigationButton';
import Loading from '../../../../components/ui/Loading';
import * as PropTypes from 'prop-types';
import {
  NavigationContainer,
  NavigationRouteConfigMap,
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation';
import { tabsOptions } from '../../../../routers/Tabs';
import Log from '../../../../modules/logger/Log';
import CacheStorage from '../../../../modules/storage/CacheStorage';
import UPAO from '../../../../scraping/UPAO';
import MaterialsSectionScreen from './section/MaterialsSectionScreen';
import { SectionModel } from '../../../../scraping/student/intranet/Course';
import AlertMessage from '../../../../components/ui/AlertMessage';

export interface CourseMaterialsScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  Tabs?: NavigationContainer;
  isLoading: boolean;
  cacheLoaded: boolean;
  isReloading: boolean;
}

const TAG = 'CourseMaterialsScreen';
export default class CourseMaterialsScreen extends React.Component<
  CourseMaterialsScreenProps,
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
    title: _('Materiales del curso'),
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
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
    cacheLoaded: false,
    isLoading: true,
    isReloading: false
  };
  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();
    await this.loadRequest();
  };
  getCacheKey = () => {
    let { course } = this.getParams();
    return `materials_sections_${course.id || '_'}`;
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
    let tabs: NavigationRouteConfigMap = {};

    for (let item of data) {
      if (!tabs[item.name]) {
        tabs[item.name] = {
          screen: () => {
            return <MaterialsSectionScreen section={item} />;
          },
          navigationOptions: {
            tabBarLabel: item.name
          } as NavigationTabScreenOptions
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
          } as NavigationTabScreenOptions
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
      Tabs,
      isLoading: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;

    try {
      let { course } = this.getParams();
      let sections = await UPAO.Student.Intranet.Course.getMaterialsSections(
        course
      );

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
    UPAO.abort('Course.getMaterialsSections');
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
    let { Tabs, isLoading } = this.state;

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
