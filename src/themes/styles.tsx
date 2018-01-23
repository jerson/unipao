import { Platform } from 'react-native';

let isAndroid = Platform.OS === 'android';

export const Theme = {
  tabTarIcon: {
    fontSize: 25
  },
  tintColor: 'rgba(255,255,255,0.7)',
  subTintColor: 'rgba(0,0,0,0.7)',
  navigationBar: {
    elevation: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'transparent',
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
    // height: DimensionUtil.getNavigationBarHeight(),
    shadowRadius: 4,
    shadowOffset: {
      height: 2,
      width: 2
    },
    backgroundColor: '#fff'
  },
  subNavigationBar: {
    backgroundColor: '#fff'
  },
  subtitle: {
    color: '#444'
  },
  title: {
    color: '#fff',
    fontSize: isAndroid ? 16 : 16,
    padding: 0,
    fontWeight: '400'
    // textShadowColor: 'rgba(0,0,0,0.1)',
    // textShadowRadius: 8,
    // textShadowOffset: {
    //   height: 1,
    //   width: 0
    // }
  },
  noShadow: {
    elevation: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
    borderColor: 'transparent',
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0
    }
  },
  shadowDefault: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3
  },
  textShadow: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowRadius: 4,
    textShadowOffset: {
      height: 1,
      width: 0
    }
  }
};
