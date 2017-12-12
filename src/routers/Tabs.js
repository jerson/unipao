import React from 'react';
import { TabBarTop } from 'react-navigation';
import { Theme } from '../themes/styles';

export const tabsOptions = {
  tabBarComponent: TabBarTop,
  tabBarPosition: 'top',
  backBehavior: 'none',
  animationEnabled: true,
  swipeEnabled: true,
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
};
