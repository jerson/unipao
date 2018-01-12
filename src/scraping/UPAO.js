import ParamsUtils from './utils/ParamsUtils';
import NumberUtils from './utils/NumberUtils';
import Log from '../modules/logger/Log';
import Profile from './student/Profile';
import Intranet from './student/Intranet';
import General from './info/General';
import Schedule from './info/Schedule';
import RequestUtil from './utils/RequestUtil';
import Agenda from './info/Agenda';
import News from './info/News';
import Gallery from './info/Gallery';

const TAG = 'UPAO';
export default class UPAO {
  static Info = {
    General,
    Schedule,
    Agenda,
    News,
    Gallery
  };

  static Student = {
    Profile,
    Intranet
  };

  static async login(username: string, password: string): boolean {
    let params = {};
    await RequestUtil.fetch(`/cerrar_sesion.aspx`, {}, false);
    try {
      let $ = await RequestUtil.fetch(
        '/login.aspx?ReturnUrl=%2fdefault.aspx',
        {},
        false
      );
      params = ParamsUtils.getFormParams($);
    } catch (e) {
      Log.info(TAG, 'login', e);
    }

    delete params.btn_valida;

    let keys = Object.keys(params);
    for (let key of keys) {
      if (key.indexOf('_id') !== -1) {
        params[key] = username;
      } else if (key.indexOf('_nip') !== -1) {
        params[key] = password;
      }
    }
    params['btn_valida.x'] = NumberUtils.getRandomInt(5, 25);
    params['btn_valida.y'] = NumberUtils.getRandomInt(5, 25);

    try {
      let $ = await RequestUtil.fetch(
        '/login.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        false
      );

      let labelError = $('#lbl_error').text();
      if (labelError) {
        Log.info(TAG, labelError);
        return false;
      }
    } catch (e) {
      Log.info(TAG, 'login', e);
    }
    try {
      let $ = await RequestUtil.fetch('/', {}, false);
      return $('#ctl00_csesion').length;
    } catch (e) {
      Log.info(TAG, 'login', e);
    }
    return false;
  }

  static async logout(): boolean {
    try {
      await RequestUtil.fetch(`/cerrar_sesion.aspx`, {}, false);
      return true;
    } catch (e) {
      Log.info(TAG, 'logout', e);
    }

    return false;
  }
}
