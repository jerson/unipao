import RequestUtil from '../../utils/RequestUtil';
import { LevelModel, PeriodModel } from '../Intranet';
import ParamsUtils from '../../utils/ParamsUtils';
import Log from '../../../modules/logger/Log';

const TAG = 'Enrollment';
export default class Enrollment {
  static async getLevels(): Promise<LevelModel[]> {
    return [
      {
        id: 'UG',
        name: 'Pregrado',
      },
      {
        id: 'UB',
        name: 'Centro de idiomas',
      },
      {
        id: 'GR',
        name: 'Postgrado',
      },
      {
        id: 'UT',
        name: 'Gente que trabaja',
      },
    ];
  }

  static async getPeriods(level: string): Promise<PeriodModel[]> {
    const periods: PeriodModel[] = [];
    try {
      const params = {
        f: 'YAAANOT',
        a: 'CTRL_CBO_PERIODOS',
        codigo_nivel: level,
        codigo_ctrl: '_anot_',
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Enrollment.getPeriods', checkSession: true }
      );

      const $content = $('#cbo_anot_periodo');
      $('option', $content).each((index, value) => {
        const id = ($(value).attr('value') || '').trim();

        if (!id) {
          return;
        }
        const name = $(value)
          .text()
          .trim();
        periods.push({
          id,
          name,
        });
      });
    } catch (e) {
      Log.info(TAG, 'getPeriods', e);
      throw e;
    }

    return periods;
  }

  static async get(level: string, period: string): Promise<string> {
    let $;
    let html = '';
    try {
      $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAAANOT&r=A',
        {},
        { tag: 'Enrollment.get', checkSession: true }
      );
    } catch (e) {
      Log.info(TAG, 'get', e);
      throw e;
    }

    const params = {
      f: 'YAAANOT',
      a: 'LIST_MATRICULA',
      codigo_uno: period,
    };

    try {
      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Enrollment.get', checkSession: true, ajax: true }
      );
      html = $('body').html();
    } catch (e) {
      Log.info(TAG, 'get', e);
      throw e;
    }
    return html;
  }
}
