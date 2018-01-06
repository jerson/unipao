import Config from '../Config';
import Log from '../../modules/logger/Log';
import cio from 'cheerio-without-node-native';
import Intranet from './Intranet';
import Album from './profile/Album';
import Friend from './profile/Friend';

const TAG = 'Profile';
export default class Profile {
  static Album = Album;
  static Friend = Friend;

  static async getAlbums(id: string, page: number) {}

  static async getPublic(id: string) {}

  static async me() {
    try {
      let response = await fetch(`${Config.URL}/?f=yggpers`, {
        credentials: 'include'
      });
      let html = await response.text();
      let $ = cio.load(html);

      let $user = $('#ctl00_lbl_usua');
      if (!$user.length) {
        return null;
      }

      let nacionality = $(
        '#ctl00_ContentPlaceHolder1_ctl00_PCONGEN2_ctl00_cbo_ciudadano'
      )
        .find('option[selected=selected]')
        .text();
      nacionality = nacionality === 'None' ? '' : nacionality;

      let etnia = $('#ctl00_ContentPlaceHolder1_ctl00_PCONGEN2_ctl00_cbo_etnia')
        .find('option[selected=selected]')
        .text();
      etnia = etnia === 'None' ? '' : etnia;

      let civilStatus = $(
        '#ctl00_ContentPlaceHolder1_ctl00_PCONGEN2_ctl00_cbo_estado_civil'
      )
        .find('option[selected=selected]')
        .text();
      civilStatus = civilStatus === 'None' ? '' : civilStatus;

      let religion = $(
        '#ctl00_ContentPlaceHolder1_ctl00_PCONGEN2_ctl00_cbo_religion'
      )
        .find('option[selected=selected]')
        .text();
      religion = religion === 'None' ? '' : religion;

      let gender = $('#ctl00_ContentPlaceHolder1_ctl00_PCONGEN2_ctl00_rb_sexo')
        .find('option[selected=checked]')
        .text();

      let birthday = $(
        '#ctl00_ContentPlaceHolder1_ctl00_PCONGEN2_ctl00_txt_cumple'
      ).attr('value');

      let document = $(
        '#ctl00_ContentPlaceHolder1_ctl00_PCONGEN2_ctl00_txt_dni'
      ).attr('value');

      let name = $user
        .text()
        .replace(/[0-9]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      let id = $('#ctl00_hdid').attr('value');
      let user = {
        id,
        name,
        document,
        birthday,
        nacionality,
        etnia,
        civilStatus,
        religion,
        gender
      };

      return user;
    } catch (e) {
      Log.info(TAG, 'login', e);
    }
    return null;
  }
}
