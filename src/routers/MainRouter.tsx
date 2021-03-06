import LoginScreen from '../scenes/LoginScreen';
import {
  NavigationContainer,
  NavigationScreenConfigProps,
  NavigationTabScreenOptions,
  StackNavigator,
  TabNavigator
} from 'react-navigation';
import { View } from 'react-native';
import * as React from 'react';
import AboutScreen from '../scenes/AboutScreen';
import ProfileScreen from '../scenes/user/ProfileScreen';
import NewsListScreen from '../scenes/user/upao/NewsListScreen';
import Icon from '../components/ui/Icon';
import { Color, Theme } from '../themes/styles';
import NewsScreen from '../scenes/user/upao/NewsScreen';
import SettingsScreen from '../scenes/user/SettingsScreen';
import AgendaListScreen from '../scenes/user/upao/AgendaListScreen';
import ScheduleScreen from '../scenes/deprecated/ScheduleScreen';
import { _ } from '../modules/i18n/Translator';
import IntroScreen from '../scenes/IntroScreen';
import MailScreen from '../scenes/user/MailScreen';
import { tabsOptionsMain, tabsOptionsSub } from './Tabs';
import GalleriesScreen from '../scenes/user/upao/GalleriesScreen';
import GalleryScreen from '../scenes/user/upao/GalleryScreen';
import LoginFallbackScreen from '../scenes/LoginFallbackScreen';
import CourseScreen from '../scenes/user/intranet/CourseScreen';
import CourseMaterialsScreen from '../scenes/user/intranet/course/CourseMaterialsScreen';
import CourseSyllableScreen from '../scenes/user/intranet/course/CourseSyllableScreen';
import CourseAssistsScreen from '../scenes/user/intranet/course/CourseAssistsScreen';
import CourseGradesScreen from '../scenes/user/intranet/course/CourseGradesScreen';
import CourseForumScreen from '../scenes/user/intranet/course/CourseForumScreen';
import CourseExamsScreen from '../scenes/user/intranet/course/CourseExamsScreen';
import CourseJobsScreen from '../scenes/user/intranet/course/CourseJobsScreen';
import GalleryPhotoScreen from '../scenes/user/upao/GalleryPhotoScreen';
import LevelScreen from '../scenes/user/intranet/LevelScreen';
import IntranetTabsScreen from '../scenes/user/IntranetTabsScreen';
import PaymentsScreen from '../scenes/user/intranet/PaymentsScreen';
import HistoryCoursesScreen from '../scenes/user/intranet/HistoryCoursesScreen';
import GradesReportTabsScreen from '../scenes/user/intranet/GradesReportTabsScreen';
import EnrollmentTabsScreen from '../scenes/user/intranet/EnrollmentTabsScreen';

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
    headerMode: 'none'
  }
);
const GalleryNavigator = StackNavigator(
  {
    Home: {
      screen: GalleriesScreen
    },
    Gallery: {
      screen: GalleryScreen
    },
    Photo: {
      screen: GalleryPhotoScreen
    }
  },
  {
    headerMode: 'none'
  }
);
const AgendaNavigator = StackNavigator(
  {
    Home: {
      screen: AgendaListScreen
    }
  },
  {
    headerMode: 'none'
  }
);

const UPAOTabNavigator = TabNavigator(
  {
    Gallery: {
      screen: GalleryNavigator,
      navigationOptions: {
        tabBarLabel: _('Fotos'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'photo'}
            style={[Theme.tabTarIcon, { color: tintColor || '#444' }]}
          />
        )
      } as NavigationTabScreenOptions
    },
    News: {
      screen: NewsNavigator,
      navigationOptions: {
        tabBarLabel: _('Noticias'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'newspaper-o'}
            type={'FontAwesome'}
            style={[Theme.tabTarIcon, { color: tintColor || '#444' }]}
          />
        )
      } as NavigationTabScreenOptions
    },
    Agenda: {
      screen: AgendaNavigator,
      navigationOptions: {
        tabBarLabel: _('Agenda'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'calendar'}
            type={'MaterialCommunityIcons'}
            style={[Theme.tabTarIcon, { color: tintColor || '#444' }]}
          />
        )
      } as NavigationTabScreenOptions
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
        title: _('Actualidad'),
        headerBackTitle: null,
        headerTitleStyle: [Theme.title, Theme.subtitle],
        headerTintColor: Color.subTintColor,
        headerStyle: [Theme.navigationBar, Theme.subNavigationBar]
      }
    }
  },
  {}
);
const MailNavigator = StackNavigator(
  {
    Home: {
      screen: MailScreen
    }
  },
  {}
);

const SettingsNavigator = StackNavigator(
  {
    Home: {
      screen: SettingsScreen
    }
  },
  {}
);

const IntranetNavigator = StackNavigator(
  {
    Home: {
      screen: IntranetTabsScreen
    },
    Level: {
      screen: LevelScreen
    },
    Payments: {
      screen: PaymentsScreen
    },
    GradesReport: {
      screen: GradesReportTabsScreen
    },
    HistoryCourses: {
      screen: HistoryCoursesScreen
    },
    Schedule: {
      screen: ScheduleScreen
    },
    Enrollment: {
      screen: EnrollmentTabsScreen
    },
    Course: {
      screen: CourseScreen
    },
    CourseMaterials: {
      screen: CourseMaterialsScreen
    },
    CourseSyllable: {
      screen: CourseSyllableScreen
    },
    CourseAssists: {
      screen: CourseAssistsScreen
    },
    CourseGrades: {
      screen: CourseGradesScreen
    },
    CourseForum: {
      screen: CourseForumScreen
    },
    CourseJobs: {
      screen: CourseJobsScreen
    },
    CourseExams: {
      screen: CourseExamsScreen
    }
  },
  {}
);
const UsersTabNavigator = TabNavigator(
  {
    Profile: {
      screen: ProfileScreen
    },
    Intranet: {
      screen: ({ navigation }: NavigationScreenConfigProps) => {
        return (
          <IntranetNavigator screenProps={{ tabNavigation: navigation }} />
        );
      },
      navigationOptions: {
        tabBarLabel: _('Aula virtual'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'network'}
            type={'Entypo'}
            style={[Theme.tabTarIcon, { color: tintColor || '#444' }]}
          />
        )
      } as NavigationTabScreenOptions
    },

    Recent: {
      screen: ({ navigation }: NavigationScreenConfigProps) => {
        return <UPAONavigator screenProps={{ tabNavigation: navigation }} />;
      },
      navigationOptions: {
        tabBarLabel: _('Actualidad'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'newspaper-o'}
            type={'FontAwesome'}
            style={[Theme.tabTarIcon, { color: tintColor || '#444' }]}
          />
        )
      } as NavigationTabScreenOptions
    },
    Mail: {
      screen: ({ navigation }: NavigationScreenConfigProps) => {
        return <MailNavigator screenProps={{ tabNavigation: navigation }} />;
      },
      navigationOptions: {
        tabBarLabel: _('Correo'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'gmail'}
            type={'MaterialCommunityIcons'}
            style={[Theme.tabTarIcon, { color: tintColor || '#444' }]}
          />
        )
      } as NavigationTabScreenOptions
    },
    Settings: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        return (
          <View style={{ flex: 1 }}>
            <SettingsNavigator
              screenProps={{
                tabNavigation: navigation,
                rootNavigation: screenProps.rootNavigation
              }}
            />
          </View>
        );
      },
      navigationOptions: {
        tabBarLabel: _('Ajustes'),
        tabBarIcon: ({ tintColor }) => (
          <Icon
            name={'settings'}
            type={'MaterialCommunityIcons'}
            style={[Theme.tabTarIcon, { color: tintColor || '#444' }]}
          />
        )
      } as NavigationTabScreenOptions
    }
  },
  { ...tabsOptionsMain }
);

const MainNavigator = StackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    LoginFallback: {
      screen: LoginFallbackScreen
    },
    About: {
      screen: AboutScreen
    },
    Intro: {
      screen: IntroScreen
    },
    User: {
      screen: ({ navigation }: NavigationScreenConfigProps) => (
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
export default MainNavigator as NavigationContainer;
