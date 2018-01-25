import { Platform } from 'react-native';

export default class DimensionUtil {
  static getStatusBarHeight() {
    return 20;
  }

  static getStatusBarPadding() {
    const version = parseInt(Platform.Version.toString(), 10);
    return Platform.OS === 'ios' ||
      Platform.OS === 'windows' ||
      (Platform.OS === 'android' && version < 21)
      ? 0
      : this.getStatusBarHeight();
  }

  static getNavigationBarHeight() {
    return Platform.OS === 'ios' ? 60 : 60;
  }
}
