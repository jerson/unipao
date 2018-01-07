import LoginScreen from '../scenes/LoginScreen';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Platform, View } from 'react-native';
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
import DimensionUtil from '../modules/util/DimensionUtil';
import MailScreen from '../scenes/MailScreen';
import { tabsOptions, tabsOptionsMain, tabsOptionsSub } from './Tabs';

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
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#fff',
      top: DimensionUtil.getNavigationBarHeight() * -1
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
    headerMode: 'none',
    cardStyle: {
      backgroundColor: '#fff',
      top: DimensionUtil.getNavigationBarHeight() * -1
    }
  }
);

const UPAOTabNavigator = TabNavigator(
  {
    Agenda: {
      screen: AgendaNavigator,
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
    News: {
      screen: NewsNavigator,
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
    }
  },
  {
    ...tabsOptionsSub
  }
);

const UPAONavigator = StackNavigator(
  {
    Home: {
      screen: UPAOTabNavigator,
      navigationOptions: {
        title: _('UPAO'),
        headerBackTitle: null,
        headerTitleStyle: [Theme.title, Theme.subtitle],
        headerTintColor: Theme.subTintColor,
        headerStyle: [
          Theme.navigationBar,
          Theme.subNavigationBar,
          Theme.shadowDefault
        ]
      }
    }
  },
  {
    headerMode: 'float',
    cardStyle: {
      backgroundColor: '#fff'
    }
  }
);
const MailNavigator = StackNavigator(
  {
    Home: {
      screen: MailScreen
    }
  },
  {
    headerMode: 'float',
    cardStyle: {
      backgroundColor: '#fff',
      top: DimensionUtil.getNavigationBarHeight() * -1
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
      top: DimensionUtil.getNavigationBarHeight() * -1
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

    UPAO: {
      screen: ({ navigation }) => {
        return (
          <View style={{ flex: 1 }}>
            <UPAONavigator screenProps={{ tabNavigation: navigation }} />
          </View>
        );
      },
      navigationOptions: {
        tabBarLabel: _('UPAO'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'calendar'}
            type={'MaterialCommunityIcons'}
            style={[Theme.tabTarIcon, { color: tintColor }]}
          />
        )
      }
    },
    Mail: {
      screen: ({ navigation }) => {
        return (
          <View style={{ flex: 1 }}>
            <MailNavigator screenProps={{ tabNavigation: navigation }} />
          </View>
        );
      },
      navigationOptions: {
        tabBarLabel: _('E-mail'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'gmail'}
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
  { ...tabsOptionsMain }
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
      backgroundColor: '#fff'
    }
  }
);
