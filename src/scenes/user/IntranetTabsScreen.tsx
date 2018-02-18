import * as React from 'react';
import { ListRenderItemInfo } from 'react-native';
import { Color, Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions
} from 'react-navigation';
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
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  };

  render() {
    let { navigation } = this.props;
    return <IntranetScreen screenProps={{ rootNavigation: navigation }} />;
    // return <Tabs screenProps={{ rootNavigation: navigation }} />;
  }
}

// const Tabs = TabNavigator(
//   {
//     Home: {
//       screen: IntranetScreen,
//       navigationOptions: {
//         tabBarLabel: _('Nivel académico')
//       } as NavigationTabScreenOptions
//     }
//     // Messages: {
//     //   screen: IntranetScreen,
//     //   navigationOptions: {
//     //     tabBarLabel: _('Mensajes')
//     //   } as NavigationTabScreenOptions
//     // }
//   },
//   {
//     ...tabsOptionsSub
//   }
// );
