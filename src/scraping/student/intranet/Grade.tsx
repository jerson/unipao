import RequestUtil from '../../utils/RequestUtil';
import ParamsUtils from '../../utils/ParamsUtils';
import Log from '../../../modules/logger/Log';
import { LevelModel } from '../Intranet';

export interface ProgramModel {
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

const TAG = 'Grade';
export default class Grade {
  static async getLevelByCode(levelCode: string): Promise<LevelModel> {
    const levels = await this.getLevels();
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
    for (const level of levels) {
      if (level.name.indexOf(name) !== -1) {
        return level;
      }
    }
    throw Error('no hay level');
  }

  static async getLevels(): Promise<LevelModel[]> {
    const levels: LevelModel[] = [];
    try {
      // litle hack
      await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAGMURO&r=A',
        {},
        { tag: 'Grade.getLevels', checkSession: true }
      );
      const $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAAFIMA&r=A',
        {},
        { tag: 'Grade.getLevels', checkSession: true }
      );

      const $content = $('#cbo_afima_nivel');
      $('option', $content).each((index, value) => {
        const id = ($(value).attr('value') || '').trim();

        if (!id) {
          return;
        }
        const name = $(value)
          .text()
          .trim();
        levels.push({
          id,
          name,
        });
      });
    } catch (e) {
      Log.info(TAG, 'getLevels', e);
      throw e;
    }

    return levels;
  }

  static async getPrograms(levelGrade: string): Promise<ProgramModel[]> {
    const programs: ProgramModel[] = [];
    try {
      const params = {
        f: 'YAAFIMA',
        a: 'CTRL_CBO_PROGRAMA',
        codigo_uno: levelGrade,
        codigo_dos: '_afima_',
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Grade.getPrograms', checkSession: true }
      );

      const $content = $('#cbo_afima_programa');
      $('option', $content).each((index, value) => {
        const id = ($(value).attr('value') || '').trim();

        if (!id) {
          return;
        }
        const name = $(value)
          .text()
          .trim();
        programs.push({
          id,
          name,
        });
      });
    } catch (e) {
      Log.info(TAG, 'getPrograms', e);
      throw e;
    }

    return programs;
  }

  static async get(
    levelGrade: string,
    program: string
  ): Promise<GradeReportModel> {
    const report: GradeReportModel = {
      items: [],
      weightedAverageCumulative: 0,
      approvedCourses: 0,
      lastAcademicSemester: 0,
      semiannualWeightedAverage: 0,
      approvedCredits: 0,
      graduated: false,
    };
    let $;
    try {
      $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAAFIMA&r=A',
        {},
        { tag: 'Grade.get', checkSession: true }
      );
    } catch (e) {
      Log.info(TAG, 'get', e);
      throw e;
    }

    let codeScript = $('#btn_consultar').attr('onclick') || '';
    codeScript = codeScript
      .replace("javascript:mnuya_load_reporte_nota('_afima_',", '')
      .replace(');', '')
      .replace(/&apos;/g, '')
      .replace(/'/g, '');

    const params = {
      f: 'YAAFIMA',
      a: 'LIST_REPORTE_NOTAS',
      codigo_uno: levelGrade,
      codigo_dos: program,
      codigo_tres: codeScript,
    };

    try {
      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Grade.get', checkSession: true, ajax: true }
      );
      const $tableReport = $('table:first-child');
      $('> tr', $tableReport).each((index, value) => {
        const cycle = $('td:nth-child(1)', value)
          .text()
          .trim();

        const cycleCheck = parseInt(cycle, 10);

        if (cycleCheck > 0) {
          const cycle = $('td:nth-child(1)', value)
            .text()
            .trim();
          const course = $('td:nth-child(2)', value)
            .text()
            .trim();
          const description = $('td:nth-child(3)', value)
            .text()
            .trim();
          const credits = $('td:nth-child(4)', value)
            .text()
            .trim();
          const semester = $('td:nth-child(5)', value)
            .text()
            .trim();
          const type = $('td:nth-child(6)', value)
            .text()
            .trim();
          const finalGrade = $('td:nth-child(7)', value)
            .text()
            .trim();
          const apl = $('td:nth-child(8)', value)
            .text()
            .trim();
          const ppa = $('td:nth-child(9)', value)
            .text()
            .trim();
          const pps = $('td:nth-child(10)', value)
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
            pps,
          });
        }
      });

      const $tableResume = $('table:nth-child(2)');
      const weightedAverageCumulative = parseFloat(
        $('> tr:nth-child(1) > td:nth-child(2)', $tableResume)
          .text()
          .trim()
      );
      const approvedCourses = parseInt(
        $('> tr:nth-child(1) > td:nth-child(4)', $tableResume)
          .text()
          .trim(),
        10
      );
      const lastAcademicSemester = parseInt(
        $('> tr:nth-child(1) > td:nth-child(6)', $tableResume)
          .text()
          .trim(),
        10
      );
      const semiannualWeightedAverage = parseFloat(
        $('> tr:nth-child(2) > td:nth-child(2)', $tableResume)
          .text()
          .trim()
      );
      const approvedCredits = parseInt(
        $('> tr:nth-child(2) > td:nth-child(4)', $tableResume)
          .text()
          .trim(),
        10
      );
      const graduated =
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
      Log.info(TAG, 'get', e);
      throw e;
    }
    return report;
  }
}
