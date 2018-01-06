import ParamsUtils from './utils/ParamsUtils';
import NumberUtils from './utils/NumberUtils';
import cio from 'cheerio-without-node-native';
import Log from '../modules/logger/Log';
import Config from './Config';

const TAG = 'Student';
export default class Student {
  async login(username: string, password: string): boolean {
    let { $: $p, params } = await ParamsUtils.getParams(Config.URL);
    if ($p('#ctl00_csesion').length) {
      Log.info(TAG, 'ya inicio antes');
      return true;
    }

    delete params.btn_valida;
    params.txt_id = username;
    params.txt_nip = password;
    params['btn_valida.x'] = NumberUtils.getRandomInt(5, 25);
    params['btn_valida.y'] = NumberUtils.getRandomInt(5, 25);

    let response = await fetch(`${Config.URL}/login.aspx`, {
      credentials: 'include',
      method: 'post',
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: ParamsUtils.getFormDatas(params)
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
