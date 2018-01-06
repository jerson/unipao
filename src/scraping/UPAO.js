import ParamsUtils from './utils/ParamsUtils';
import NumberUtils from './utils/NumberUtils';
import cio from 'cheerio-without-node-native';
import Log from '../modules/logger/Log';
import Config from './Config';

const TAG = 'UPAO';
export default class UPAO {
  static async login(username: string, password: string): boolean {
    let responseHome = await fetch(Config.URL, {
      credentials: 'include',
      method: 'get'
    });
    let htmlHome = await responseHome.text();
    let $p = cio.load(htmlHome);

    if ($p('#ctl00_csesion').length) {
      Log.info(TAG, 'ya inicio antes');
      return true;
    }

    let params = ParamsUtils.getFormParams($p);

    delete params.btn_valida;
    params.txt_id = username;
    params.txt_nip = password;
    params['btn_valida.x'] = NumberUtils.getRandomInt(5, 25);
    params['btn_valida.y'] = NumberUtils.getRandomInt(5, 25);

    let response = await fetch(`${Config.URL}/login.aspx`, {
      credentials: 'include',
      method: 'post',
      body: ParamsUtils.getFormData(params)
    });
    let html = await response.text();
    let $ = cio.load(html);

    let labelError = $('#lbl_error').text();
    if (labelError) {
      Log.info(TAG, labelError);
      return false;
    }

    return $('#ctl00_csesion').length;
  }
}
