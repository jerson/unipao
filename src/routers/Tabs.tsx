import { TabBarTop, TabNavigatorConfig } from 'react-navigation';
import { Platform } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';

export const tabsOptions: TabNavigatorConfig = {
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  backBehavior: 'none',
  animationEnabled: true,
  swipeEnabled: true,
  lazy: true,
  tabBarOptions: {
    upperCaseLabel: true,
    scrollEnabled: true,
    activeTintColor: '#0d61ac',
    inactiveTintColor: '#444',
    style: {
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'normal',
    },
    indicatorStyle: {
      backgroundColor: '#0d61ac',
    },
  },
};

export const tabsOptionsMain: TabNavigatorConfig = {
  tabBarComponent: BottomTabBar,
  tabBarPosition: 'bottom',
  initialLayout: undefined,
  lazy: true,
  swipeEnabled: true,
  animationEnabled: false,
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: '#f59331',
    labelStyle: {
      marginTop: Platform.OS === 'ios' ? 15 : 0,
      marginLeft: 0,
    },
    style: {
      borderTopColor: undefined,
      borderColor: '#d4d4d4',
      height: 49,
    },
    tabStyle: {
      justifyContent: 'flex-end',
      flexDirection: 'column',
    },
  },
};
export const tabsOptionsSub: TabNavigatorConfig = {
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  lazy: true,
  animationEnabled: true,
  backBehavior: 'none',
  swipeEnabled: true,
  tabBarOptions: {
    upperCaseLabel: true,
    scrollEnabled: false,
    activeTintColor: '#f59331',
    inactiveTintColor: '#444',
    style: {
      backgroundColor: '#fff',
      padding: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 1,
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'normal',
    },
    indicatorStyle: {
      backgroundColor: '#f59331',
    },
  },
};
