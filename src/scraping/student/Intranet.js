import Schedule from './intranet/Schedule';
import Note from './intranet/Note';
import Enrollment from './intranet/Enrollment';
import Course from './intranet/Course';
import RequestUtil from '../utils/RequestUtil';
import Log from '../../modules/logger/Log';
import ParamsUtils from '../utils/ParamsUtils';

const TAG = 'Intranet';
export default class Intranet {
  static Course = Course;
  static Enrollment = Enrollment;
  static Note = Note;
  static Schedule = Schedule;

  static async getPayments() {}

  static async getLevels() {}

  static async getCourses(period: string, level: string) {}

  static async getPeriods() {}

  static async getHistoryCourses(level: string) {
    let params = {};
    let $;
    try {
      $ = await RequestUtil.fetch('/aulavirtual.aspx?f=YAAHIST&r=A');
    } catch (e) {
      Log.info(TAG, 'getHistoryCourses', e);
      return null;
    }

    let $content = $(
      '#ctl00_ContentPlaceHolder1_ctl00_MENUYA21_lbl_menu_right'
    );
    let code = '';
    switch (level) {
      case 'UG':
        code = $('#mnuya_pregrado', $content).attr('onclick') || '';
        code = code
          .replace("javascript:mnuya_load_yaahist('", '')
          .replace("');", '');
        break;
      case 'GR':
        code = $('#mnuya_postgrado', $content).attr('onclick') || '';
        code = code
          .replace("javascript:mnuya_load_yaahist('", '')
          .replace("');", '');
        break;
      case 'UT':
        code = $('#mnuya_cgt', $content).attr('onclick') || '';
        code = code
          .replace("javascript:mnuya_load_yaahist('", '')
          .replace("');", '');
        break;
      case 'UB':
        code = $('#mnuya_idiomas', $content).attr('onclick') || '';
        code = code
          .replace("javascript:mnuya_load_yaahist('", '')
          .replace("');", '');
        break;
    }
    params = {
      f: 'YAAHIST',
      a: 'INI_HISTORIAL',
      codigo_uno: code
    };

    Log.info(params);
    try {
      let $ = await RequestUtil.fetch('/controlador/cargador.aspx', {
        method: 'POST',
        body: ParamsUtils.getFormData(params)
      });
      let $content = $('#lst_historial_inig');
      let periods = [];
      $(' > table > tr:nth-of-type(n+2) > td:nth-child(2)', $content).each(
        (index, value) => {
          if (!periods[index]) {
            periods[index] = {};
          }
          periods[index].period = $(value)
            .text()
            .trim();
        }
      );

      $(' > table > tr:nth-of-type(n+2) > td[align=center]', $content).each(
        (index, value) => {
          if (!periods[index]) {
            periods[index] = {};
          }

          let items = [];
          $('> div', value).each((index, value) => {
            let level = $(
              'div:nth-child(1) > table > tr > td:nth-child(1)',
              value
            )
              .text()
              .trim();

            if (!level) {
              return;
            }
            let image = $(
              'div:nth-child(1) > table > tr > td:nth-child(2) > img',
              value
            ).attr('src');
            let nrc = $(
              'div:nth-child(1) > table > tr > td:nth-child(2) > span:nth-child(2)',
              value
            )
              .text()
              .trim();
            let name = $(
              'div:nth-child(1) > table > tr > td:nth-child(2) > span:nth-child(3)',
              value
            )
              .text()
              .trim();

            if (!name) {
              return;
            }
            let item = {
              level,
              image,
              nrc,
              name
            };

            items.push(item);
          });
          periods[index].courses = items;
        }
      );
      return periods;
    } catch (e) {
      Log.info(TAG, 'getHistoryCourses', e);
      return null;
    }
  }
}
