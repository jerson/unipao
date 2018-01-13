import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../themes/styles';
import PropTypes from 'prop-types';
import Loading from '../components/ui/Loading';
import { _ } from '../modules/i18n/Translator';
import DimensionUtil from '../modules/util/DimensionUtil';
import { tabsOptions, tabsOptionsSub } from '../routers/Tabs';
import { TabNavigator } from 'react-navigation';
import LevelScreen from './intranet/LevelScreen';

const TAG = 'IntranetScreen';
export default class IntranetScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: _('Aula Virtual'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [Theme.navigationBar, Theme.subNavigationBar]
  });

  state = {
    isLoading: false
  };

  render() {
    let { isLoading } = this.state;
    let paddingTop = DimensionUtil.getNavigationBarHeight();
    return (
      <View style={[styles.container, { paddingTop }]}>
        {/*<Background/>*/}
        {isLoading && <Loading margin />}
        {!isLoading && <LevelsTab />}
      </View>
    );
  }
}

const LevelsTab = TabNavigator(
  {
    UG: {
      screen: ({ navigation, screenProps }) => {
        return <LevelScreen level={'UG'} />;
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Pregrado')
        };
      }
    }
    // GR: {
    //   screen: ({ navigation, screenProps }) => {
    //     return <LevelScreen level={'GR'} />;
    //   },
    //   navigationOptions: ({ navigation, screenProps }) => {
    //     return {
    //       tabBarLabel: _('Postgrado')
    //     };
    //   }
    // },
    // UT: {
    //   screen: ({ navigation, screenProps }) => {
    //     return <LevelScreen level={'UT'} />;
    //   },
    //   navigationOptions: ({ navigation, screenProps }) => {
    //     return {
    //       tabBarLabel: _('Gente que trabaja')
    //     };
    //   }
    // },
    // UB: {
    //   screen: ({ navigation, screenProps }) => {
    //     return <LevelScreen level={'UB'} />;
    //   },
    //   navigationOptions: ({ navigation, screenProps }) => {
    //     return {
    //       tabBarLabel: _('Centro de idiomas')
    //     };
    //   }
    // }
  },
  {
    ...tabsOptionsSub,
    tabBarOptions: {
      ...tabsOptionsSub.tabBarOptions,
      scrollEnabled: true
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
