import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import Loading from '../../components/ui/Loading';
import { _ } from '../../modules/i18n/Translator';
import { tabsOptionsSub } from '../../routers/Tabs';
import { TabNavigator } from 'react-navigation';
import LevelScreen from './intranet/LevelScreen';

const TAG = 'IntranetScreen';
export default class IntranetScreen extends React.PureComponent {
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
    isLoading: true,
    width: 300
  };

  onDimensionsChange = ({ window, screen }) => {
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
          screen: ({ navigation, screenProps }) => {
            return (
              <LevelScreen
                level={'UG'}
                navigation={screenProps.topNavigation}
              />
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
              <LevelScreen
                level={'GR'}
                navigation={screenProps.topNavigation}
              />
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
              <LevelScreen
                level={'UT'}
                navigation={screenProps.topNavigation}
              />
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
              <LevelScreen
                level={'UB'}
                navigation={screenProps.topNavigation}
              />
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
        {/*<Background/>*/}
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
