import * as PubSub from 'pubsub-js';

export type Name =
  | 'onLocaleChange'
  | 'onThemeChange'
  | 'onLocationChange'
  | 'onDimensionsChange'
  | 'onOrientationChange'
  | 'onNetworkStateChange'
  | 'onLoginStatus'
  | string;

export default class Emitter {
  static emit(name: Name, data: any): boolean {
    return PubSub.publish(name, data);
  }

  static on(name: Name, callback: Function): string {
    return PubSub.subscribe(name, (name: string, data: any) => {
      callback(data);
    });
  }

  static off(callback: Function): void {
    return PubSub.unsubscribe(callback);
  }
}
