import * as React from 'react';
import { Dimensions, ScaledSize, StyleSheet, View } from 'react-native';
import { Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import Loading from '../../components/ui/Loading';
import { _ } from '../../modules/i18n/Translator';
import { tabsOptionsSub } from '../../routers/Tabs';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation';
import LevelScreen from './intranet/LevelScreen';

export interface IntranetScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  width: number;
}

export interface DimensionsChange {
  window: ScaledSize;
  screen?: ScaledSize;
}

const TAG = 'IntranetScreen';
export default class IntranetScreen extends React.PureComponent<
  IntranetScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Aula Virtual'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [Theme.navigationBar, Theme.subNavigationBar]
  };

  state: State = {
    isLoading: true,
    width: 300
  };

  onDimensionsChange = ({ window, screen }: DimensionsChange) => {
    this.setState({ width: window.width, isLoading: false });
  };

  componentDidMount() {
    Dimensions.addEventListener('change', this.onDimensionsChange);
    this.onDimensionsChange({ window: Dimensions.get('window') });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  render() {
    let { isLoading, width } = this.state;
    let { navigation } = this.props;

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <Loading margin />
        </View>
      );
    }

    const LevelsTab = TabNavigator(
      {
        UG: {
          screen: ({
            navigation,
            screenProps
          }: NavigationScreenConfigProps) => {
            return (
              <LevelScreen
                level={'UG'}
                navigation={screenProps ? screenProps.topNavigation : undefined}
              />
            );
          },
          navigationOptions: {
            tabBarLabel: _('Pregrado')
          } as NavigationTabScreenOptions
        },
        GR: {
          screen: ({
            navigation,
            screenProps
          }: NavigationScreenConfigProps) => {
            return (
              <LevelScreen
                level={'GR'}
                navigation={screenProps ? screenProps.topNavigation : undefined}
              />
            );
          },
          navigationOptions: {
            tabBarLabel: _('Postgrado')
          } as NavigationTabScreenOptions
        },
        UT: {
          screen: ({
            navigation,
            screenProps
          }: NavigationScreenConfigProps) => {
            return (
              <LevelScreen
                level={'UT'}
                navigation={screenProps ? screenProps.topNavigation : undefined}
              />
            );
          },
          navigationOptions: {
            tabBarLabel: _('G. que trabaja')
          } as NavigationTabScreenOptions
        },
        UB: {
          screen: ({
            navigation,
            screenProps
          }: NavigationScreenConfigProps) => {
            return (
              <LevelScreen
                level={'UB'}
                navigation={screenProps ? screenProps.topNavigation : undefined}
              />
            );
          },
          navigationOptions: {
            tabBarLabel: _('Centro de idiomas')
          } as NavigationTabScreenOptions
        }
      },
      {
        ...tabsOptionsSub,
        tabBarOptions: {
          ...tabsOptionsSub.tabBarOptions,
          scrollEnabled: width < 400,
          tabStyle:
            width < 400
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
    return (
      <View style={[styles.container]}>
        {isLoading && <Loading margin />}
        {!isLoading && (
          <LevelsTab screenProps={{ topNavigation: navigation }} />
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
