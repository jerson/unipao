import cio from 'cheerio-without-node-native';
import Log from '../../modules/logger/Log';
import Emitter from '../../modules/listener/Emitter';
import Config from '../Config';
import fetchCancelable from 'react-native-cancelable-fetch';
import { Platform } from 'react-native';
const TAG = 'RequestUtil';
export default class RequestUtil {
  static async fetch(url, params = {}, options = { checkSession: true }) {
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
    let $ = cio.load(html);

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

  static abort(tag) {
    try {
      Log.debug(TAG, 'abort', tag);
      fetchCancelable.abort(tag);
    } catch (e) {
      Log.warn(TAG, 'abort', e);
    }
  }
}
