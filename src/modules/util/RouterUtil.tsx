import {
  NavigationActions,
  NavigationParams,
  NavigationScreenProp
} from 'react-navigation';

export default class RouterUtil {
  static resetTo(
    navigation: NavigationScreenProp<any, any>,
    routeName: string,
    params: NavigationParams = {}
  ) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName, params })]
    });
    navigation.dispatch(resetAction);
  }
}
