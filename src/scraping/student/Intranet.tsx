import Schedule from './intranet/Schedule';
import Note from './intranet/Note';
import Enrollment from './intranet/Enrollment';
import Course from './intranet/Course';
import RequestUtil from '../utils/RequestUtil';
import Log from '../../modules/logger/Log';
import ParamsUtils from '../utils/ParamsUtils';

export interface PeriodDetailModel {
  period: string;
  courses: CourseModel[];
}

export interface CourseModel {
  id: string;
  code: string;
  level: string;
  image?: string;
  nrc: string;
  name: string;
}

export interface LevelModel {
  id: string;
  name: string;
}

export interface ProgramModel {
  id: string;
  name: string;
}

export interface PeriodModel {
  id: string;
  name: string;
}

export interface PaymentModel {
  id: string;
  receipt: string;
  period: string;
  concept: string;
  description: string;
  date: string;
  charge: string;
  payment: string;
  balance: string;
  interest: string;
}

const TAG = 'Intranet';
export default class Intranet {
  static Course = Course;
  static Enrollment = Enrollment;
  static Note = Note;
  static Schedule = Schedule;

  static async getPayments(level: string): Promise<PaymentModel[]> {
    let payments: PaymentModel[] = [];
    let $;
    try {
      $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YACACTA&r=A',
        {},
        { tag: 'Intranet.getPayments', checkSession: true }
      );
    } catch (e) {
      Log.info(TAG, 'getPayments', e);
      throw e;
    }

    let code = this.getLevelCode($, level);
    let params = {
      f: 'YACACTA',
      a: 'LIST_REPORTE',
      codigo_uno: code
    };

    try {
      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Intranet.getPayments', checkSession: true }
      );
      let $content = $('#id_cont > table');
      $(' > tr', $content).each((index, value) => {
        let receipt = $('td:nth-child(1)', value)
          .text()
          .trim();

        if (!receipt) {
          return;
        }
        let period = $('td:nth-child(2)', value)
          .text()
          .trim();
        let concept = $('td:nth-child(3)', value)
          .text()
          .trim();
        let description = $('td:nth-child(4)', value)
          .text()
          .trim();
        let date = $('td:nth-child(5)', value)
          .text()
          .trim();
        let charge = $('td:nth-child(6)', value)
          .text()
          .trim();
        let payment = $('td:nth-child(7)', value)
          .text()
          .trim();
        let balance = $('td:nth-child(8)', value)
          .text()
          .trim();
        let interest = $('td:nth-child(9)', value)
          .text()
          .trim();
        payments.push({
          id: receipt,
          receipt,
          period,
          concept,
          description,
          date,
          charge,
          payment,
          balance,
          interest
        });
      });
    } catch (e) {
      Log.info(TAG, 'getPayments', e);
      throw e;
    }
    return payments;
  }

  static async getLevels(): Promise<LevelModel[]> {
    return [
      {
        id: 'UG',
        name: 'Pregrado'
      },
      {
        id: 'UB',
        name: 'Centro de idiomas'
      },
      {
        id: 'GR',
        name: 'Postgrado'
      },
      {
        id: 'UT',
        name: 'Gente que trabaja'
      }
    ];
  }

  static async getLevelsEnrollment(): Promise<LevelModel[]> {
    let levels: LevelModel[] = [];
    try {
      let $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAAFIMA&r=A',
        {},
        { tag: 'Intranet.getLevelsEnrollment', checkSession: true }
      );

      let $content = $('#cbo_afima_nivel');
      $('option', $content).each((index, value) => {
        let id = ($(value).attr('value') || '').trim();

        if (!id) {
          return;
        }
        let name = $(value)
          .text()
          .trim();
        levels.push({
          id,
          name
        });
      });
    } catch (e) {
      Log.info(TAG, 'getPeriods', e);
      throw e;
    }

    return levels;
  }

  static async getPrograms(levelEnrollment: string): Promise<ProgramModel[]> {
    let programs: ProgramModel[] = [];
    try {
      let params = {
        f: 'YAAFIMA',
        a: 'CTRL_CBO_PROGRAMA',
        codigo_uno: levelEnrollment,
        codigo_dos: '_afima_'
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Intranet.getPrograms', checkSession: true }
      );

      let $content = $('#cbo_afima_programa');
      $('option', $content).each((index, value) => {
        let id = ($(value).attr('value') || '').trim();

        if (!id) {
          return;
        }
        let name = $(value)
          .text()
          .trim();
        programs.push({
          id,
          name
        });
      });
    } catch (e) {
      Log.info(TAG, 'getPeriods', e);
      throw e;
    }

    return programs;
  }

  static async getPeriods(level: string): Promise<PeriodModel[]> {
    let periods: PeriodModel[] = [];
    try {
      let params = {
        f: 'YAAANOT',
        a: 'CTRL_CBO_PERIODOS',
        codigo_nivel: level,
        codigo_ctrl: '_anot_'
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Intranet.getPeriods', checkSession: true }
      );

      let $content = $('#cbo_anot_periodo');
      $('option', $content).each((index, value) => {
        let id = ($(value).attr('value') || '').trim();

        if (!id) {
          return;
        }
        let name = $(value)
          .text()
          .trim();
        periods.push({
          id,
          name
        });
      });
    } catch (e) {
      Log.info(TAG, 'getPeriods', e);
      throw e;
    }

    return periods;
  }

  static async getHistoryCourses(level: string): Promise<PeriodDetailModel[]> {
    let periods: PeriodDetailModel[] = [];
    let $;
    try {
      $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAAHIST&r=A',
        {},
        { tag: 'Intranet.getHistoryCourses', checkSession: true }
      );
    } catch (e) {
      Log.info(TAG, 'getHistoryCourses', e);
      throw e;
    }

    let code = this.getLevelCode($, level);
    let params = {
      f: 'YAAHIST',
      a: 'INI_HISTORIAL',
      codigo_uno: code
    };

    try {
      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Intranet.getHistoryCourses', checkSession: true }
      );
      let $content = $('#lst_historial_inig');
      $(' > table > tr:nth-of-type(n+2) > td:nth-child(2)', $content).each(
        (index, value) => {
          if (!periods[index]) {
            periods[index] = { period: '', courses: [] };
          }
          periods[index].period = $(value)
            .text()
            .trim();
        }
      );

      $(' > table > tr:nth-of-type(n+2) > td[align=center]', $content).each(
        (index, value) => {
          if (!periods[index]) {
            periods[index] = { period: '', courses: [] };
          }

          let items: CourseModel[] = [];
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

            let name = $(
              'div:nth-child(1) > table > tr > td:nth-child(2) > span:nth-child(3)',
              value
            )
              .text()
              .trim();
            if (!name) {
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

            let $first = $('.yaahist_btn_colora', value).first();

            let codeString = $first ? $first.attr('onclick') || '' : '';
            let idString = $first ? $first.attr('id') || '' : '';

            let id = idString
              .replace('idlstcrse_', '')
              .replace('_sil', '')
              .trim();
            let parts = codeString.split(",'_sil','");
            let code = (parts[parts.length - 1] || '')
              .replace("');", '')
              .trim();

            let item: CourseModel = {
              id,
              code,
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
    } catch (e) {
      Log.info(TAG, 'getHistoryCourses', e);
      throw e;
    }
    return periods;
  }

  private static getLevelCode($: JQueryStatic, level: string): string {
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
    return code;
  }

  static async getCourses(period: string, level: string) {}
}
