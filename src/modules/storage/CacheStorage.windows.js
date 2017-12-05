import { AsyncStorage } from 'react-native';

export interface UserSettings {
    schemaVersion?: number;
    path?: string;
}

export interface Settings {
    schemaVersion: number;
    path: string;
}

const CacheSchema = {
    name: 'Cache',
    primaryKey: 'key',
    properties: {
        key: 'string',
        value: 'string'
    }
};

export interface Cache {
    key: string;
    value: string;
}
const TAG = 'CacheStorageWindows';
export default class CacheStorageWindows {

    static settings: Settings = { path: 'cache.realm', schemaVersion: 1 };

    static init(settings: UserSettings) {
        if (settings) {
            this.settings = Object.assign({}, this.settings, settings);
        }
    }
  static async set(key: string, value: any): Promise<boolean> {
    if (typeof value === 'undefined') {
      return false;
    }
    value = typeof value !== 'string' ? JSON.stringify(value) : value;

    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      return false;
    }
    return true;
  }

  static async get(key: string): Promise<string> {
    let data = '';
    try {
      data = await AsyncStorage.getItem(key);
        data = JSON.parse(data);
    } catch (e) {
      return data;
    }
    return data;
  }

  static async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      return false;
    }
    return true;
  }
}
