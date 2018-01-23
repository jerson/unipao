import SingleStorage from '../storage/SingleStorage';
import Emitter from '../listener/Emitter';
import Log from '../logger/Log';
import UPAO from '../../scraping/UPAO';

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
    headerName: 'X-Auth',
    authPath: 'me',
    hashToken: ''
  };
  static user?: User;

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
      let user = JSON.parse(data);
      Emitter.emit('onSuccessLogin', user);
      this.user = user;
      //return this.login(true);
    }
  }

  static async login(emit: boolean = false): Promise<boolean> {
    Log.info('[AUTH]', 'login');
    let isOk = false;
    try {
      let profile = await UPAO.Student.Profile.me();
      if (profile) {
        isOk = await this.setUser(profile);
        emit && Emitter.emit('onSuccessLogin', this.user);
      }
    } catch (e) {
      emit && Emitter.emit('onNoLogin', true);
    }

    return isOk;
  }

  static isLoggedIn(): boolean {
    return !!this.user;
  }

  static getAccessToken(): string {
    return '';
  }

  static getUserId(): string {
    return this.user ? this.user.id.toString() : '';
  }

  static getUser(): User {
    return this.user || {};
  }

  static setUser(data: any): Promise<boolean> {
    this.user = data;
    return SingleStorage.set('user', JSON.stringify(data));
  }

  static async logout(): Promise<boolean> {
    Log.info('[AUTH]', 'logout');
    this.user = undefined;
    Emitter.emit('onNoLogin', true);
    await SingleStorage.remove('user');
    UPAO.logout();
    return true;
  }
}
