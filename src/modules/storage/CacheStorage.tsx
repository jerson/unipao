import Realm from 'realm';
import Log from '../logger/Log';

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

const TAG = 'CacheStorage';
export default class CacheStorage {
    static settings: Settings = {path: 'cache.realm', schemaVersion: 1};

    static init(settings: UserSettings) {
        if (settings) {
            this.settings = Object.assign({}, this.settings, settings);
        }
    }

    static getInstance() {
        return Realm.open({
            schema: [CacheSchema]
        });
    }

    static async set(key: string, value: any): Promise<boolean> {
        Log.info(TAG, 'set', key);
        let keyEncoded = this.hashCode(key);
        let realm = await this.getInstance();
        let cache = realm.objectForPrimaryKey('Cache', keyEncoded);
        realm.write(() => {
            if (cache) {
                Log.info(TAG, 'set', key, 'update');
                cache.value = JSON.stringify(value);
            } else {
                Log.info(TAG, 'set', key, 'create');
                realm.create('Cache', {
                    key: keyEncoded,
                    value: JSON.stringify(value)
                });
            }
        });
        return true;
    }

    static async get(key: string): Promise<any> {
        Log.info(TAG, 'get', key);
        let realm = await this.getInstance();
        let keyEncoded = this.hashCode(key);
        let data = null;
        realm.write(() => {
            data = realm.objectForPrimaryKey('Cache', keyEncoded);
        });
        return data ? JSON.parse(data.value) : null;
    }

    static async remove(key: string): Promise<boolean> {
        let realm = await this.getInstance();
        let keyEncoded = this.hashCode(key);
        let results = realm.objects('Cache').filtered(`key = '${keyEncoded}'`);
        realm.write(() => {
            realm.delete(results);
        });
        return true;
    }

    static hashCode(text: string): string {
        return text;
        // let hash = 0,
        //   i,
        //   chr,
        //   len;
        // if (text.length === 0) {
        //   return hash.toString();
        // }
        // for (i = 0, len = text.length; i < len; i++) {
        //   chr = text.charCodeAt(i);
        //   hash = (hash << 5) - hash + chr;
        //   hash |= 0;
        // }
        // return 'K' + hash;
    }
}
