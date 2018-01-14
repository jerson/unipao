import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../../../themes/styles';
import { _ } from '../../../modules/i18n/Translator';
import DimensionUtil from '../../../modules/util/DimensionUtil';
import NavigationButton from '../../../components/ui/NavigationButton';
import Loading from '../../../components/ui/Loading';
import PropTypes from 'prop-types';
import { TabNavigator } from 'react-navigation';
import { tabsOptions } from '../../../routers/Tabs';
import Log from '../../../modules/logger/Log';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import ForumSectionScreen from './course/ForumSectionScreen';

const TAG = 'CourseForumScreen';
export default class CourseForumScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerBackTitle: null,
    title: _('Foro del curso'),
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ],
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

  state = {
    html: '',
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
    return `forum_sections_${course.id || '_'}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (data, cacheLoaded = false) => {
    let tabs = {};

    if (data) {
      for (let item of data) {
        if (!tabs[item.name]) {
          tabs[item.name] = {
            screen: ({ navigation, screenProps }) => {
              return <ForumSectionScreen section={item} />;
            },
            navigationOptions: ({ navigation, screenProps }) => {
              return {
                tabBarLabel: item.name
              };
            }
          };
        }
      }
    }

    let totalTabs = Object.keys(tabs);
    if (totalTabs.length < 1) {
      tabs = {
        NO: {
          screen: ({ navigation, screenProps }) => {
            return <ForumSectionScreen section={{}} />;
          },
          navigationOptions: ({ navigation, screenProps }) => {
            return {
              tabBarLabel: _('No se encontraron datos')
            };
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
      let sections = await UPAO.Student.Intranet.Course.getForumSections(
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
    let { tabs, isLoading } = this.state;
    let Tabs = tabs;

    return (
      <View style={[styles.container, { paddingTop }]}>
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
