import LoginScreen from '../scenes/LoginScreen';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Platform, StatusBar, View } from 'react-native';
import React from 'react';
import AboutScreen from '../scenes/AboutScreen';
import ProfileScreen from '../scenes/ProfileScreen';
import NewsListScreen from '../scenes/NewsListScreen';
import Icon from '../components/ui/Icon';
import { Theme } from '../themes/styles';
import NewsScreen from '../scenes/NewsScreen';
import SettingsScreen from '../scenes/SettingsScreen';
import AgendaListScreen from '../scenes/AgendaListScreen';
import IntranetScreen from '../scenes/IntranetScreen';
import ScheduleScreen from '../scenes/ScheduleScreen';
import AccountStatusScreen from '../scenes/PaymentsScreen';
import AssistsScreen from '../scenes/AssistsScreen';
import EnrollmentScreen from '../scenes/EnrollmentScreen';
import AssistDetailScreen from '../scenes/AssistDetailScreen';
import { _ } from '../modules/i18n/Translator';
import IntroScreen from '../scenes/IntroScreen';

const NewsNavigator = StackNavigator(
  {
    Home: {
      screen: NewsListScreen
    },
    News: {
      screen: NewsScreen
    }
  },
  {
    headerMode: 'float',
    cardStyle: {
      backgroundColor: '#0d61ac',
      top: Platform.OS === 'android' ? -60 : -65
    }
  }
);
const AgendaNavigator = StackNavigator(
  {
    Home: {
      screen: AgendaListScreen
    }
  },
  {
    headerMode: 'float',
    cardStyle: {
      backgroundColor: '#0d61ac',
      top: Platform.OS === 'android' ? -60 : -65
    }
  }
);
const IntranetNavigator = StackNavigator(
  {
    Home: {
      screen: IntranetScreen
    },
    Schedule: {
      screen: ScheduleScreen
    },
    Payments: {
      screen: AccountStatusScreen
    },
    Assists: {
      screen: AssistsScreen
    },
    AssistDetail: {
      screen: AssistDetailScreen
    },
    Enrollment: {
      screen: EnrollmentScreen
    }
  },
  {
    headerMode: 'float',
    cardStyle: {
      backgroundColor: '#0d61ac',
      top: Platform.OS === 'android' ? -60 : -65
    }
  }
);
const UsersTabNavigator = TabNavigator(
  {
    Profile: {
      screen: ProfileScreen
    },
    Intranet: {
      screen: ({ navigation }) => {
        return (
          <View style={{ flex: 1 }}>
            <IntranetNavigator screenProps={{ tabNavigation: navigation }} />
          </View>
        );
      },
      navigationOptions: {
        tabBarLabel: _('Aula virtual'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'network'}
            type={'Entypo'}
            style={[Theme.tabTarIcon, { color: tintColor }]}
          />
        )
      }
    },
    NewsList: {
      screen: ({ navigation }) => {
        return (
          <View style={{ flex: 1 }}>
            <NewsNavigator screenProps={{ tabNavigation: navigation }} />
          </View>
        );
      },
      navigationOptions: {
        tabBarLabel: _('Noticias'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'newspaper-o'}
            type={'FontAwesome'}
            style={[Theme.tabTarIcon, { color: tintColor }]}
          />
        )
      }
    },
    Agenda: {
      screen: ({ navigation }) => {
        return (
          <View style={{ flex: 1 }}>
            <AgendaNavigator screenProps={{ tabNavigation: navigation }} />
          </View>
        );
      },
      navigationOptions: {
        tabBarLabel: _('Agenda'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'calendar'}
            type={'MaterialCommunityIcons'}
            style={[Theme.tabTarIcon, { color: tintColor }]}
          />
        )
      }
    },
    Settings: {
      screen: SettingsScreen
    }
  },
  {
    ...TabNavigator.Presets.iOSBottomTabs,
    lazy: false,
    swipeEnabled: true,
    animationEnabled: true,
    backBehavior: 'none',
    tabBarOptions: {
      activeTintColor: '#f59331',
      labelStyle: {
        marginTop: Platform.OS === 'ios' ? 15 : 0,
        marginLeft: 0
      },
      style: {
        height: 49
      },
      tabStyle: {
        justifyContent: 'flex-end',
        flexDirection: 'column'
      }
    }
  }
);

export default StackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    About: {
      screen: AboutScreen
    },
    Intro: {
      screen: IntroScreen
    },
    User: {
      screen: ({ navigation }) => (
        <UsersTabNavigator screenProps={{ rootNavigation: navigation }} />
      )
    }
  },
  {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#0d61ac'
    }
  }
);
