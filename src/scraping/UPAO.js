import ParamsUtils from './utils/ParamsUtils';
import NumberUtils from './utils/NumberUtils';
import cio from 'cheerio-without-node-native';
import Log from '../modules/logger/Log';
import Config from './Config';
import Profile from './student/Profile';
import Intranet from './student/Intranet';
import General from './info/General';
import Schedule from './info/Schedule';
import RequestUtil from './utils/RequestUtil';

const TAG = 'UPAO';
export default class UPAO {
  static Info = {
    General,
    Schedule
  };

  static Student = {
    Profile,
    Intranet
  };

  static async login(username: string, password: string): boolean {
    let params = {};
    try {
      let $ = await RequestUtil.fetch(Config.URL, {}, false);
      if ($('#ctl00_csesion').length) {
        Log.info(TAG, 'ya inicio antes');
        return true;
      }
      params = ParamsUtils.getFormParams($);
    } catch (e) {
      Log.info(TAG, 'login', e);
    }

    delete params.btn_valida;
    params.txt_id = username;
    params.txt_nip = password;
    params['btn_valida.x'] = NumberUtils.getRandomInt(5, 25);
    params['btn_valida.y'] = NumberUtils.getRandomInt(5, 25);

    try {
      let $ = await RequestUtil.fetch(
        '/login.aspx',
        {
          method: 'post',
          body: ParamsUtils.getFormData(params)
        },
        false
      );

      let labelError = $('#lbl_error').text();
      if (labelError) {
        Log.info(TAG, labelError);
        return false;
      }

      return $('#ctl00_csesion').length;
    } catch (e) {
      Log.info(TAG, 'login', e);
    }

    return false;
  }

  static async logout(): boolean {
    try {
      await fetch(`${Config.URL}/cerrar_sesion.aspx`, {
        credentials: 'include'
      });
      return true;
    } catch (e) {
      Log.info(TAG, 'logout', e);
    }

    return false;
  }
}
