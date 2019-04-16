import {
  NavigationActions,
  NavigationScreenProp,
  StackActions,
  NavigationParams,
} from 'react-navigation';

export default class RouterUtil {
  static resetTo(
    navigation: NavigationScreenProp<any, any>,
    routeName: string,
    params: NavigationParams = {}
  ) {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName, params })],
    });
    navigation.dispatch(resetAction);
  }
}
