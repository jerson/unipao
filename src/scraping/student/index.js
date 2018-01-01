import ParamsUtils from '../utils/ParamsUtils';
import NumberUtils from '../utils/NumberUtils';
import cio from 'cheerio-without-node-native';
import Log from '../../modules/logger/Log';
import Config from '../Config';
import Profile from './Profile';

const TAG = 'Student';
export default class Student {
  intranet;
  profile;
  schedule;
  general;

  constructor() {
    this.profile = new Profile();
  }

  async login(username, password) {
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

    let response = await fetch(`${this.url}/login.aspx`, {
      method: 'post',
      body: ParamsUtils.getFormData(params)
    });
    let html = await response.text();
    let $ = cio.load(html);

    let labelError = $('#lbl_error').text();
    if (labelError) {
      Log.info(TAG, labelError);
    }

    return $('#ctl00_csesion').length;
  }
}
