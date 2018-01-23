import {NavigationActions} from 'react-navigation';

export default class RouterUtil {
    static resetTo(navigation: any, routeName: string, params: any = {}) {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName, params})]
        });
        navigation.dispatch(resetAction);
    }
}
