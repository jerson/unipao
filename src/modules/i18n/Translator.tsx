import PreferencesStorage from '../storage/PreferencesStorage';
import Emitter from '../listener/Emitter';
import en from './locales/en';
import Log from '../logger/Log';
import { getDefaultLocale } from './Detector';
import 'moment/locale/es';
import 'moment/locale/pt';
import 'moment/locale/fr';
import 'moment/locale/en-ie';

const moment = require('moment');

const format = require('string-format');

export interface UserSettings {
  translations: Translations;
  defaultLocale?: string;
}

export interface Settings {
  translations: Translations;
  defaultLocale: string;
}

export type TranslationText = string | number;

export interface Locale {
  [key: string]: string;
}

export interface Params {
  [key: string]: TranslationText;
}

export interface Translations {
  [key: string]: Locale;
}

export function _(key: string, params: Params = {}): string {
  return Translator.translate(key, params);
}

export default class Translator {
  static settings: Settings = {
    translations: { en },
    defaultLocale: 'en',
  };
  static locale: string;

  static async init(settings: UserSettings) {
    this.locale = this.getSystemLocale();
    if (settings) {
      this.settings = Object.assign({}, this.settings, settings);
    }

    try {
      const locale = await this.getUserLocale();
      this.setLocale(locale);
    } catch (e) {
      Log.debug('[TRANSLATOR]', e);
    }
  }

  static setLocale(locale: string): void {
    this.locale = locale === 'auto' ? this.getSystemLocale() : locale;
    if (this.locale === 'en') {
      moment.locale('en-ie');
    } else {
      moment.locale(this.locale);
    }
    Emitter.emit('onLocaleChange', this.locale);
  }

  static getLocale(): string {
    return this.locale;
  }

  static translate(text: string, params: Params = {}): string {
    if (!text) {
      return '';
    }
    let translated = text;
    if (this.settings.translations[this.locale]) {
      translated = this.settings.translations[this.locale][text];
    }
    translated = translated ? translated : text;
    return format(translated, params);
  }

  static async getUserLocale(): Promise<string> {
    try {
      const data = await PreferencesStorage.get('locale');
      const locale = data.toString();
      return locale ? locale : this.getSystemLocale();
    } catch (e) {
      return this.getSystemLocale();
    }
  }

  static getSystemLocale(): string {
    const initialLocale = getDefaultLocale();
    const locale = initialLocale.split('-');
    return locale[0] ? locale[0] : this.settings.defaultLocale;
  }
}
