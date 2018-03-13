import ParamsUtils, { Params } from './utils/ParamsUtils';
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
import Config from './Config';

export interface LoginPrepareData {
  params: Params;
  requireCaptcha: boolean;
}

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

  private static loginUrl = '/login.aspx?ReturnUrl=%2fdefault.aspx';

  static async loginPrepare(username: string): Promise<LoginPrepareData> {
    let params: Params = {};
    let requireCaptcha = false;

    try {
      await RequestUtil.fetch(
        `/cerrar_sesion.aspx`,
        {},
        { tag: 'login', checkSession: false }
      );
    } catch (e) {
      Log.info(TAG, 'login', e);
    }

    try {
      let $ = await RequestUtil.fetch(
        this.loginUrl,
        {},
        { tag: 'login', checkSession: false }
      );
      params = ParamsUtils.getFormParams($);
      requireCaptcha = $('img[src*="captcha"]').length > 0;
    } catch (e) {
      Log.info(TAG, 'login', e);
      throw e;
    }

    // disabled now is disabled temp
    // delete params.btn_valida;
    // let keysFirst = Object.keys(params);
    // for (let key of keysFirst) {
    //   if (key.indexOf('_id') !== -1) {
    //     params[key] = username;
    //     params['__EVENTTARGET'] = key;
    //   } else if (key.indexOf('_nip') !== -1) {
    //     params[key] = password;
    //   }
    // }
    //
    // await ParamsUtils.delay(5 * 1000);
    //
    // try {
    //   let $ = await RequestUtil.fetch(
    //     this.loginUrl,
    //     {
    //       method: 'POST',
    //       body: ParamsUtils.getFormData(params),
    //       headers: {
    //         Referer: 'https://campusvirtual.upao.edu.pe' + this.loginUrl,
    //         'User-Agent':
    //          this.getUserAgentDesktop()
    //       }
    //     },
    //     { tag: 'login', checkSession: false }
    //   );
    //
    //   params = ParamsUtils.getFormParams($);
    // } catch (e) {
    //   Log.info(TAG, 'login', e);
    //   throw e;
    // }

    return {
      params,
      requireCaptcha
    };
  }

  static async loginSend(
    params: Params,
    username: string,
    password: string,
    captcha?: string
  ): Promise<boolean> {
    let ok = false;

    delete params.btn_valida;

    let keys = Object.keys(params);
    for (let key of keys) {
      if (key.indexOf('_id') !== -1) {
        params[key] = username;
      } else if (key.indexOf('_nip') !== -1) {
        params[key] = password;
      } else if (key.indexOf('_img') !== -1) {
        params[key] = captcha || '';
      }
    }
    params['btn_valida.x'] = NumberUtils.getRandomInt(5, 25);
    params['btn_valida.y'] = NumberUtils.getRandomInt(5, 25);

    try {
      let $ = await RequestUtil.fetch(
        this.loginUrl,
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
          headers: {
            Referer: 'https://campusvirtual.upao.edu.pe' + this.loginUrl,
            'User-Agent': this.getUserAgentDesktop()
          }
        },
        { tag: 'login', checkSession: false }
      );

      Log.info($('html').html());
      let labelError = $('#lbl_error').text();
      if (labelError) {
        Log.info(TAG, labelError);
        return ok;
      }
    } catch (e) {
      Log.info(TAG, 'login', e);
      throw e;
    }
    try {
      let $ = await RequestUtil.fetch(
        '/',
        {},
        { tag: 'login', checkSession: false }
      );
      ok = $('#ctl00_csesion').length > 0;
    } catch (e) {
      Log.info(TAG, 'login', e);
      throw e;
    }
    return ok;
  }

  static async loginDirect(
    username: string,
    password: string,
    captcha?: string
  ): Promise<boolean> {
    let ok = false;

    let params: Params = {};

    try {
      await RequestUtil.fetch(
        `/cerrar_sesion.aspx`,
        {},
        { tag: 'login', checkSession: false }
      );
    } catch (e) {
      Log.info(TAG, 'login', e);
    }

    try {
      let $ = await RequestUtil.fetch(
        this.loginUrl,
        {},
        { tag: 'login', checkSession: false }
      );
      params = ParamsUtils.getFormParams($);
    } catch (e) {
      Log.info(TAG, 'login', e);
      throw e;
    }

    delete params.btn_valida;

    let keys = Object.keys(params);
    for (let key of keys) {
      if (key.indexOf('_id') !== -1) {
        params[key] = username;
      } else if (key.indexOf('_nip') !== -1) {
        params[key] = password;
      } else if (key.indexOf('_img') !== -1) {
        params[key] = captcha || '';
      }
    }
    params['btn_valida.x'] = NumberUtils.getRandomInt(5, 25);
    params['btn_valida.y'] = NumberUtils.getRandomInt(5, 25);

    try {
      let $ = await RequestUtil.fetch(
        this.loginUrl,
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
          headers: {
            Referer: 'https://campusvirtual.upao.edu.pe' + this.loginUrl,
            'User-Agent': this.getUserAgentDesktop()
          }
        },
        { tag: 'login', checkSession: false }
      );

      Log.info($('html').html());
      let labelError = $('#lbl_error').text();
      if (labelError) {
        Log.info(TAG, labelError);
        return ok;
      }
    } catch (e) {
      Log.info(TAG, 'login', e);
      throw e;
    }
    try {
      let $ = await RequestUtil.fetch(
        '/',
        {},
        { tag: 'login', checkSession: false }
      );
      ok = $('#ctl00_csesion').length > 0;
    } catch (e) {
      Log.info(TAG, 'login', e);
      throw e;
    }
    return ok;
  }

  static async logout(): Promise<boolean> {
    let ok = false;
    try {
      await RequestUtil.fetch(
        `/cerrar_sesion.aspx`,
        {},
        { tag: 'logout', checkSession: false }
      );
      ok = true;
    } catch (e) {
      Log.info(TAG, 'logout', e);
    }

    return ok;
  }

  static abort(tag: string) {
    RequestUtil.abort(tag);
  }

  static getUserAgentMobile() {
    let agents = [
      'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
    ];
    return agents[NumberUtils.getRandomInt(0, agents.length - 1)];
  }

  static getUserAgentDesktop() {
    let agents = [
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
    ];
    return agents[NumberUtils.getRandomInt(0, agents.length - 1)];
  }
}
