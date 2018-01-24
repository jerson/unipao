import Log from '../../modules/logger/Log';
import Album from './profile/Album';
import Friend from './profile/Friend';
import RequestUtil from '../utils/RequestUtil';

export interface ProfileModel {
  id: string;
  name: string;
  document?: string;
  birthday?: string;
  nacionality?: string;
  ethnic?: string;
  civilStatus?: string;
  religion?: string;
  gender?: string;
}

const TAG = 'Profile';
export default class Profile {
  static Album = Album;
  static Friend = Friend;

  static async getAlbums(id: string, page: number) {}

  static async getPublic(id: string) {}

  static async me(): Promise<ProfileModel | null> {
    let item: ProfileModel;
    try {
      let $ = await RequestUtil.fetch(
        `/?f=yggpers`,
        {},
        { tag: 'Profile.getPublic', checkSession: true }
      );

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

      let ethnic = $(
        '#ctl00_ContentPlaceHolder1_ctl00_PCONGEN2_ctl00_cbo_etnia'
      )
        .find('option[selected=selected]')
        .text();
      ethnic = ethnic === 'None' ? '' : ethnic;

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

      let id = $('#ctl00_hdid').attr('value') || '';

      item = {
        id,
        name,
        document,
        birthday,
        nacionality,
        ethnic,
        civilStatus,
        religion,
        gender
      };
    } catch (e) {
      Log.info(TAG, 'me', e);
      throw e;
    }
    return item;
  }
}
