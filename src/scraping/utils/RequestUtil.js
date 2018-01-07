import cio from 'cheerio-without-node-native';
import Log from '../../modules/logger/Log';
import Emitter from '../../modules/listener/Emitter';
import Config from '../Config';

const TAG = 'RequestUtil';
export default class RequestUtil {
  static async fetch(url, params = {}, checkSession = true) {
    if (url[0] === '/') {
      url = `${Config.URL}${url}`;
    }
    let html = '<div></div>';
    try {
      Log.debug(TAG, 'fetch', url);
      let response = await fetch(url, {
        credentials: 'include',
        ...params
      });
      html = await response.text();
    } catch (e) {
      Log.error(TAG, 'fetch', e);
    }
    let $ = cio.load(html);

    if (checkSession && $('#txt_nip').length) {
      Log.warn(TAG, 'fetch', 'sesion desconectada');
      Emitter.emit('onForceLogout', true);
    }

    return $;
  }
}
