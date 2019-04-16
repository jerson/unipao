import * as React from 'react';
import { Color, Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import IntranetScreen from './IntranetScreen';

export interface IntranetTabsScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {}

const TAG = 'IntranetTabsScreen';
export default class IntranetTabsScreen extends React.Component<
  IntranetTabsScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Aula Virtual'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
  };

  render() {
    const { navigation } = this.props;
    return <IntranetScreen screenProps={{ rootNavigation: navigation }} />;
    // return <Tabs screenProps={{ rootNavigation: navigation }} />;
  }
}
