import Schedule from './intranet/Schedule';
import Note from './intranet/Note';
import Enrollment from './intranet/Enrollment';
import Course from './intranet/Course';
import RequestUtil from '../utils/RequestUtil';
import Log from '../../modules/logger/Log';
import ParamsUtils from '../utils/ParamsUtils';
import moment from 'moment/moment';

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

    let code = '';
    switch (level) {
      case 'UG':
        code = $('#mnuya_pregrado').attr('onclick') || '';
        code = code
          .replace("javascript:mnuya_load_yaahist('", '')
          .replace("');", '');
        params = {
          f: 'YAAHIST',
          a: 'INI_HISTORIAL',
          codigo_uno: code
        };
        break;
      case 'GR':
        code = $('#mnuya_postgrado').attr('onclick') || '';
        code = code
          .replace("javascript:mnuya_load_yaahist('", '')
          .replace("');", '');
        params = {
          f: 'YAAHIST',
          a: 'INI_HISTORIAL',
          codigo_uno: code
        };
        break;
      case 'UT':
        code = $('#mnuya_cgt').attr('onclick') || '';
        code = code
          .replace("javascript:mnuya_load_yaahist('", '')
          .replace("');", '');
        params = {
          f: 'YAAHIST',
          a: 'INI_HISTORIAL',
          codigo_uno: code
        };
        break;
      case 'UB':
        code = $('#mnuya_idiomas').attr('onclick') || '';
        code = code
          .replace("javascript:mnuya_load_yaahist('", '')
          .replace("');", '');
        params = {
          f: 'YAAHIST',
          a: 'INI_HISTORIAL',
          codigo_uno: code
        };
        break;
    }

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
          console.log($(value).html());
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

            let item = {
              level
            };

            items.push(item);
          });
          periods[index].items = items;
        }
      );

      console.log($.html());

      return periods;
    } catch (e) {
      Log.info(TAG, 'getHistoryCourses', e);
      return null;
    }
  }
}
