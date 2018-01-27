import * as React from 'react';
import {
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  Platform,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import DimensionUtil from '../../modules/util/DimensionUtil';
import IntranetItem from '../../components/intranet/IntranetItem';
import IntranetHeader from '../../components/intranet/IntranetHeader';
import Loading from '../../components/ui/Loading';
import NavigationButton from '../../components/ui/NavigationButton';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation';
import { IconType } from '../../components/ui/Icon';
import FlexibleGrid from '../../components/ui/FlexibleGrid';
import UPAO from '../../scraping/UPAO';
import Emitter from '../../modules/listener/Emitter';
import { tabsOptionsSub } from '../../routers/Tabs';
import IntranetScreen from './IntranetScreen';

export interface IntranetTabsScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {}

const TAG = 'IntranetTabsScreen';
export default class IntranetTabsScreen extends React.Component<
  IntranetTabsScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Aula Virtual'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [Theme.navigationBar, Theme.subNavigationBar]
  };

  render() {
    let { navigation } = this.props;
    return <Tabs screenProps={{ rootNavigation: navigation }} />;
  }
}

const Tabs = TabNavigator(
  {
    Home: {
      screen: IntranetScreen,
      navigationOptions: {
        tabBarLabel: _('Nivel académico')
      } as NavigationTabScreenOptions
    },
    Messages: {
      screen: IntranetScreen,
      navigationOptions: {
        tabBarLabel: _('Mensajes')
      } as NavigationTabScreenOptions
    }
  },
  {
    ...tabsOptionsSub
  }
);
