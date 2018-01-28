import * as React from 'react';
import { Dimensions, ScaledSize, StyleSheet, View } from 'react-native';
import { Theme } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import Loading from '../../../components/ui/Loading';
import { _ } from '../../../modules/i18n/Translator';
import { tabsOptionsSub } from '../../../routers/Tabs';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation';
import HistoryCoursesScreen from './HistoryCoursesScreen';
import NavigationButton from '../../../components/ui/NavigationButton';
import PaymentsScreen from './PaymentsScreen';

export interface LevelScreenProps {
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

const TAG = 'LevelScreen';
export default class LevelScreen extends React.PureComponent<
  LevelScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: navigation ? navigation.state.params.item.name : _('Nivel'),
    headerBackTitle: null,
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

  getParams(): any {
    let { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  render() {
    let { isLoading, width } = this.state;
    let { navigation } = this.props;
    let { item } = this.getParams();

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <Loading margin />
        </View>
      );
    }

    const LevelsTab = TabNavigator(
      {
        History: {
          screen: ({
            navigation,
            screenProps
          }: NavigationScreenConfigProps) => {
            if (!screenProps) {
              return null;
            }
            return (
              <HistoryCoursesScreen
                level={screenProps.item.level}
                navigation={screenProps.topNavigation}
              />
            );
          },
          navigationOptions: {
            tabBarLabel: _('Cursos')
          } as NavigationTabScreenOptions
        },
        Enrollment: {
          screen: ({
            navigation,
            screenProps
          }: NavigationScreenConfigProps) => {
            return <View />;
          },
          navigationOptions: {
            tabBarLabel: _('Matricula')
          } as NavigationTabScreenOptions
        },
        Grades: {
          screen: ({
            navigation,
            screenProps
          }: NavigationScreenConfigProps) => {
            return <View />;
          },
          navigationOptions: {
            tabBarLabel: _('Reporte Notas')
          } as NavigationTabScreenOptions
        },
        Payments: {
          screen: ({
            navigation,
            screenProps
          }: NavigationScreenConfigProps) => {
            if (!screenProps) {
              return null;
            }
            return (
              <PaymentsScreen
                level={screenProps.item.level}
                navigation={screenProps.topNavigation}
              />
            );
          },
          navigationOptions: {
            tabBarLabel: _('Estado cuenta')
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
      <View style={styles.container}>
        {isLoading && <Loading margin />}
        {!isLoading && (
          <LevelsTab screenProps={{ topNavigation: navigation, item }} />
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
