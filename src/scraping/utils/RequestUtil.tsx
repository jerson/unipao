import * as cio from 'cheerio-without-node-native';
import Log from '../../modules/logger/Log';
import Emitter from '../../modules/listener/Emitter';
import Config from '../Config';

const fetchCancelable = require('react-native-cancelable-fetch');

export interface RequestOptions {
  checkSession?: boolean;
  tag?: string;
}

const TAG = 'RequestUtil';
export default class RequestUtil {
  static async fetch(
    url: string,
    params: RequestInit = {},
    options: RequestOptions = { checkSession: true }
  ): Promise<JQueryStatic> {
    if (url[0] === '/') {
      url = `${Config.URL}${url}`;
    }
    let html = '<div></div>';
    let tag = options.tag || url;
    try {
      Log.debug(TAG, 'fetch', tag, url);
      let response = await fetchCancelable(
        url,
        {
          redirect: 'follow',
          credentials: 'include',
          ...params
        },
        tag
      );
      html = await response.text();
    } catch (e) {
      Log.error(TAG, 'fetch', e);
    }
    let $: JQueryStatic = cio.load(html);

    if (options.checkSession) {
      let loginMessage = ($('a[href*="login.aspx"]').text() || '').trim();
      if ($('input[name*=txt_nip]').length) {
        Log.warn(TAG, 'fetch', 'sesion desconectada', url);
        Emitter.emit('onForceLogout', true);
        throw new Error('Session desconectada');
      } else if (loginMessage === 'aquí' || loginMessage === 'here') {
        Emitter.emit('onForceLogout', true);
        throw new Error('Session desconectada modal/redirect');
      }
    }

    return $;
  }

  static abort(tag: string) {
    try {
      Log.debug(TAG, 'abort', tag);
      fetchCancelable.abort(tag);
    } catch (e) {
      Log.warn(TAG, 'abort', e);
    }
  }
}
