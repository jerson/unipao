import SingleStorage from '../storage/SingleStorage';
import Emitter from '../listener/Emitter';
import Log from '../logger/Log';

export interface UserSettings {
  headerName?: string;
  authPath?: string;
  hashToken?: string;
}

export interface Settings {
  headerName: string;
  authPath: string;
  hashToken: string;
}

export interface User {
  [key: string]: string | boolean | number;
}

export default class Auth {
  static settings: Settings = {
    headerName: 'X-APIKey',
    authPath: 'user/me',
    hashToken: ''
  };
  static user: User = null;

  static async init(settings?: UserSettings) {
    if (settings) {
      this.settings = Object.assign({}, this.settings, settings);
    }
    Log.info('[AUTH]', 'init');
    await this.checkLogin();
  }

  static async checkLogin() {
    if (this.isLoggedIn()) {
      return;
    }
    Log.info('[AUTH]', 'checkLogin');
    let data = await SingleStorage.get('user');
    if (data) {
      return this.login(JSON.parse(data), true);
    }
  }

  static async login(data: any, emit: boolean = false): Promise<boolean> {
    Log.info('[AUTH]', 'login', data);
    let isOk = false;
    try {
      isOk = await this.setUser(data);
      emit && Emitter.emit('onSuccessLogin', this.user);
    } catch (e) {
      emit && Emitter.emit('onNoLogin', true);
    }

    return isOk;
  }

  static isLoggedIn(): boolean {
    return !!this.user;
  }

  static getAccessToken(): string {
    return this.user ? this.user['AUTOGEN'] : null;
  }

  static getUserId(): string {
    return this.user ? this.user['ID'] : null;
  }

  static getUser(): User {
    return this.user;
  }

  static setUser(data: any): Promise<boolean> {
    this.user = data;
    return SingleStorage.set('user', JSON.stringify(data));
  }

  static logout(): Promise<boolean> {
    Log.info('[AUTH]', 'logout');
    this.user = null;
    Emitter.emit('onNoLogin', true);
    return SingleStorage.remove('user');
  }
}
