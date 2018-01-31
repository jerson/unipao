import RequestUtil from '../../utils/RequestUtil';
import { LevelModel, PeriodModel } from '../Intranet';
import ParamsUtils from '../../utils/ParamsUtils';
import Log from '../../../modules/logger/Log';

const TAG = 'Enrollment';
export default class Enrollment {
  static async get(period: string, level: string) {}

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
        { tag: 'Enrollment.getPeriods', checkSession: true }
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
}
