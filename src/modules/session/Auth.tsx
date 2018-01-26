import SingleStorage from '../storage/SingleStorage';
import Emitter from '../listener/Emitter';
import Log from '../logger/Log';
import UPAO from '../../scraping/UPAO';
import { ProfileModel } from '../../scraping/student/Profile';

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

export default class Auth {
  static settings: Settings = {
    headerName: 'X-Auth',
    authPath: 'me',
    hashToken: ''
  };
  static user?: ProfileModel;

  static async init(settings?: UserSettings) {
    if (settings) {
      this.settings = Object.assign({}, this.settings, settings);
    }
    Log.info('[AUTH]', 'init');
    this.checkLogin();
  }

  private static async checkLogin() {
    if (this.isLoggedIn()) {
      return;
    }
    Log.info('[AUTH]', 'checkLogin');
    let data = await SingleStorage.get('user');
    if (data) {
      let user = JSON.parse(data);
      Emitter.emit('onLoginStatus', true);
      this.user = user;
    }
  }

  static async login(emit: boolean = false): Promise<boolean> {
    Log.info('[AUTH]', 'login');
    let isOk = false;
    try {
      let profile = await UPAO.Student.Profile.me();
      isOk = await this.setUser(profile);
      emit && Emitter.emit('onLoginStatus', true);
    } catch (e) {
      emit && Emitter.emit('onLoginStatus', false);
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

  static getUser(): ProfileModel | undefined {
    return this.user;
  }

  private static setUser(data: ProfileModel): Promise<boolean> {
    this.user = data;
    return SingleStorage.set('user', JSON.stringify(data));
  }

  static async logout(): Promise<boolean> {
    Log.info('[AUTH]', 'logout');
    this.user = undefined;
    Emitter.emit('onLoginStatus', false);
    await SingleStorage.remove('user');
    UPAO.logout();
    return true;
  }
}
