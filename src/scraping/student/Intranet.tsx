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

export interface GradeReportCourseModel {
  cycle: string;
  course: string;
  description: string;
  credits: string;
  semester: string;
  type: string;
  finalGrade: string;
  apl: string;
  ppa: string;
  pps: string;
}

export interface GradeReportModel {
  items: GradeReportCourseModel[];
  weightedAverageCumulative: number;
  approvedCourses: number;
  lastAcademicSemester: number;
  semiannualWeightedAverage: number;
  approvedCredits: number;
  graduated: boolean;
}

export interface PaymentModel {
  id: string;
  receipt: string;
  period: string;
  concept: string;
  conceptPayment: string;
  description: string;
  date: string;
  charge: number;
  payment: number;
  balance: number;
  interest: number;
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
      //litle hack
      await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAGMURO&r=A',
        {},
        { tag: 'Intranet.getPayments', checkSession: true }
      );
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
      $('table tr').each((index, value) => {
        let receipt = $('td:nth-child(1)', value)
          .text()
          .trim();

        let receiptCheck = parseInt(receipt, 10);

        if (receiptCheck > 0) {
          let period = $('td:nth-child(2)', value)
            .text()
            .trim();
          let concept = $('td:nth-child(3)', value)
            .text()
            .trim();
          let description = $('td:nth-child(4)', value)
            .text()
            .trim();
          let conceptPayment = $('td:nth-child(5)', value)
            .text()
            .trim();
          let date = $('td:nth-child(6)', value)
            .text()
            .trim();
          let charge = parseFloat(
            $('td:nth-child(7)', value)
              .text()
              .trim()
          );
          let payment = parseFloat(
            $('td:nth-child(8)', value)
              .text()
              .trim()
          );
          let balance = parseFloat(
            $('td:nth-child(9)', value)
              .text()
              .trim()
          );
          let interest = parseFloat(
            $('td:nth-child(10)', value)
              .text()
              .trim()
          );
          payments.push({
            id: receipt,
            receipt,
            period,
            concept,
            conceptPayment,
            description,
            date,
            charge,
            payment,
            balance,
            interest
          });
        }
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

  static async getLevelGradeByLevel(levelCode: string): Promise<LevelModel> {
    let levels = await this.getLevelsGrades();
    let name = '';
    switch (levelCode.toUpperCase()) {
      case 'UT':
        name = 'PGCT';
        break;
      case 'UB':
        name = 'ESTUDIOS COMPLEMENTARIOS';
        break;
      case 'GR':
        name = 'POSTGRADO';
        break;
      case 'UG':
        name = 'PREGRADO';
        break;
      default:
        name = 'ERROR';
        break;
    }

    console.log(levels);
    for (let level of levels) {
      if (level.name.indexOf(name) !== -1) {
        return level;
      }
    }
    throw Error('no hay level');
  }

  static async getLevelsGrades(): Promise<LevelModel[]> {
    let levels: LevelModel[] = [];
    try {
      //litle hack
      await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAGMURO&r=A',
        {},
        { tag: 'Intranet.getLevelsGrades', checkSession: true }
      );
      let $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAAFIMA&r=A',
        {},
        { tag: 'Intranet.getLevelsGrades', checkSession: true }
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
      Log.info(TAG, 'getLevelsGrades', e);
      throw e;
    }

    return levels;
  }

  static async getPrograms(levelGrades: string): Promise<ProgramModel[]> {
    let programs: ProgramModel[] = [];
    try {
      let params = {
        f: 'YAAFIMA',
        a: 'CTRL_CBO_PROGRAMA',
        codigo_uno: levelGrades,
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

  static async getGradesReport(
    levelGrade: string,
    program: string
  ): Promise<GradeReportModel> {
    let report: GradeReportModel = {
      items: [],
      weightedAverageCumulative: 0,
      approvedCourses: 0,
      lastAcademicSemester: 0,
      semiannualWeightedAverage: 0,
      approvedCredits: 0,
      graduated: false
    };
    let $;
    try {
      $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAAFIMA&r=A',
        {},
        { tag: 'Intranet.getGradesReport', checkSession: true }
      );
    } catch (e) {
      Log.info(TAG, 'getGradesReport', e);
      throw e;
    }

    let codeScript = $('#btn_consultar').attr('onclick') || '';
    codeScript = codeScript
      .replace("javascript:mnuya_load_reporte_nota('_afima_',", '')
      .replace(');', '')
      .replace(/&apos;/g, '')
      .replace(/'/g, '');

    let params = {
      f: 'YAAFIMA',
      a: 'LIST_REPORTE_NOTAS',
      codigo_uno: levelGrade,
      codigo_dos: program,
      codigo_tres: codeScript
    };

    try {
      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Intranet.getGradesReport', checkSession: true, ajax: true }
      );
      let $tableReport = $('table:first-child');
      $('> tr', $tableReport).each((index, value) => {
        let cycle = $('td:nth-child(1)', value)
          .text()
          .trim();

        let cycleCheck = parseInt(cycle, 10);

        if (cycleCheck > 0) {
          let cycle = $('td:nth-child(1)', value)
            .text()
            .trim();
          let course = $('td:nth-child(2)', value)
            .text()
            .trim();
          let description = $('td:nth-child(3)', value)
            .text()
            .trim();
          let credits = $('td:nth-child(4)', value)
            .text()
            .trim();
          let semester = $('td:nth-child(5)', value)
            .text()
            .trim();
          let type = $('td:nth-child(6)', value)
            .text()
            .trim();
          let finalGrade = $('td:nth-child(7)', value)
            .text()
            .trim();
          let apl = $('td:nth-child(8)', value)
            .text()
            .trim();
          let ppa = $('td:nth-child(9)', value)
            .text()
            .trim();
          let pps = $('td:nth-child(10)', value)
            .text()
            .trim();

          report.items.push({
            cycle,
            course,
            description,
            credits,
            semester,
            type,
            finalGrade,
            apl,
            ppa,
            pps
          });
        }
      });

      let $tableResume = $('table:nth-child(2)');
      let weightedAverageCumulative = parseFloat(
        $('> tr:nth-child(1) > td:nth-child(2)', $tableResume)
          .text()
          .trim()
      );
      let approvedCourses = parseInt(
        $('> tr:nth-child(1) > td:nth-child(4)', $tableResume)
          .text()
          .trim(),
        10
      );
      let lastAcademicSemester = parseInt(
        $('> tr:nth-child(1) > td:nth-child(6)', $tableResume)
          .text()
          .trim(),
        10
      );
      let semiannualWeightedAverage = parseFloat(
        $('> tr:nth-child(2) > td:nth-child(2)', $tableResume)
          .text()
          .trim()
      );
      let approvedCredits = parseInt(
        $('> tr:nth-child(2) > td:nth-child(4)', $tableResume)
          .text()
          .trim(),
        10
      );
      let graduated =
        $('tr:nth-child(2) > td:nth-child(6)', $tableResume)
          .text()
          .trim() === 'SI';

      report.weightedAverageCumulative = weightedAverageCumulative;
      report.approvedCourses = approvedCourses;
      report.lastAcademicSemester = lastAcademicSemester;
      report.semiannualWeightedAverage = semiannualWeightedAverage;
      report.approvedCredits = approvedCredits;
      report.graduated = graduated;
    } catch (e) {
      Log.info(TAG, 'getGradesReport', e);
      throw e;
    }
    return report;
  }

  private static getLevelCode($: JQueryStatic, level: string): string {
    let code = '';
    switch (level) {
      case 'UG':
        code = $('#mnuya_pregrado').attr('onclick') || '';
        code = code
          .replace('javascript:mnuya_load_yaahist(', '')
          .replace('javascript:mnuya_load_yacacta(', '')
          .replace(');', '')
          .replace(/&apos;/g, '')
          .replace(/'/g, '');
        break;
      case 'GR':
        code = $('#mnuya_postgrado').attr('onclick') || '';
        code = code
          .replace('javascript:mnuya_load_yaahist(', '')
          .replace('javascript:mnuya_load_yacacta(', '')
          .replace(');', '')
          .replace(/&apos;/g, '')
          .replace(/'/g, '');
        break;
      case 'UT':
        code = $('#mnuya_cgt').attr('onclick') || '';
        code = code
          .replace('javascript:mnuya_load_yaahist(', '')
          .replace('javascript:mnuya_load_yacacta(', '')
          .replace(');', '')
          .replace(/&apos;/g, '')
          .replace(/'/g, '');
        break;
      case 'UB':
        code = $('#mnuya_idiomas').attr('onclick') || '';
        code = code
          .replace('javascript:mnuya_load_yaahist(', '')
          .replace('javascript:mnuya_load_yacacta(', '')
          .replace(');', '')
          .replace(/&apos;/g, '')
          .replace(/'/g, '');
        break;
    }
    return code;
  }
}
