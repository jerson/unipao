import * as cio from 'cheerio-without-node-native';
import Log from '../../modules/logger/Log';
import Emitter from '../../modules/listener/Emitter';
import Config from '../Config';

const fetchCancelable = require('react-native-cancelable-fetch');

export interface RequestOptions {
  checkSession?: boolean;
  ajax?: boolean;
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
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
          },
          ...params
        },
        tag
      );
      html = await response.text();
    } catch (e) {
      Log.error(TAG, 'fetch', e);
    }
    let $: JQueryStatic = cio.load(
      options.ajax ? `<html><body>${html}</body></html>` : html
    );

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
