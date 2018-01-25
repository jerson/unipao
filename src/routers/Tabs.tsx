import * as React from 'react';
import { TabBarTop, TabNavigator, TabNavigatorConfig } from 'react-navigation';
import { Theme } from '../themes/styles';
import { Platform } from 'react-native';

export const tabsOptions = {
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
      ...Theme.shadowDefault
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'normal'
    },
    indicatorStyle: {
      backgroundColor: '#0d61ac'
    }
  }
} as TabNavigatorConfig;

export const tabsOptionsMain = {
  ...TabNavigator.Presets.iOSBottomTabs,
  lazy: true,
  swipeEnabled: true,
  animationEnabled: false,
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: '#f59331',
    labelStyle: {
      marginTop: Platform.OS === 'ios' ? 15 : 0,
      marginLeft: 0
    },
    style: {
      borderTopColor: undefined,
      borderColor: '#d4d4d4',
      height: 49
    },
    tabStyle: {
      justifyContent: 'flex-end',
      flexDirection: 'column'
    }
  }
} as TabNavigatorConfig;
export const tabsOptionsSub = {
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
      ...Theme.shadowDefault
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'normal'
    },
    indicatorStyle: {
      backgroundColor: '#f59331'
    }
  }
} as TabNavigatorConfig;
