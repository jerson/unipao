import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Theme } from '../../themes/styles';
import PropTypes from 'prop-types';
import Loading from '../../components/ui/Loading';
import { _ } from '../../modules/i18n/Translator';
import DimensionUtil from '../../modules/util/DimensionUtil';
import { tabsOptionsSub } from '../../routers/Tabs';
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
    let { navigation } = this.props;
    return (
      <View style={[styles.container]}>
        {/*<Background/>*/}
        {isLoading && <Loading margin />}
        {!isLoading && (
          <LevelsTab screenProps={{ topNavigation: navigation }} />
        )}
      </View>
    );
  }
}

let { width } = Dimensions.get('window');
const LevelsTab = TabNavigator(
  {
    UG: {
      screen: ({ navigation, screenProps }) => {
        return (
          <LevelScreen level={'UG'} navigation={screenProps.topNavigation} />
        );
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Pregrado')
        };
      }
    },
    GR: {
      screen: ({ navigation, screenProps }) => {
        return (
          <LevelScreen level={'GR'} navigation={screenProps.topNavigation} />
        );
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Postgrado')
        };
      }
    },
    UT: {
      screen: ({ navigation, screenProps }) => {
        return (
          <LevelScreen level={'UT'} navigation={screenProps.topNavigation} />
        );
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('G. que trabaja')
        };
      }
    },
    UB: {
      screen: ({ navigation, screenProps }) => {
        return (
          <LevelScreen level={'UB'} navigation={screenProps.topNavigation} />
        );
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Centro de idiomas')
        };
      }
    }
  },
  {
    ...tabsOptionsSub,
    tabBarOptions: {
      ...tabsOptionsSub.tabBarOptions,
      scrollEnabled: width < 600,
      tabStyle:
        width < 600
          ? {
              flexDirection: 'row',
              width: 120,
              padding: 0,
              paddingBottom: 5,
              paddingTop: 6
            }
          : { flexDirection: 'row' }
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
