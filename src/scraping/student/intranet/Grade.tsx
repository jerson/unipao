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
    let levels = await this.getLevels();
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

  static async getLevels(): Promise<LevelModel[]> {
    let levels: LevelModel[] = [];
    try {
      //litle hack
      await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAGMURO&r=A',
        {},
        { tag: 'Grade.getLevels', checkSession: true }
      );
      let $ = await RequestUtil.fetch(
        '/aulavirtual.aspx?f=YAAFIMA&r=A',
        {},
        { tag: 'Grade.getLevels', checkSession: true }
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
      Log.info(TAG, 'getLevels', e);
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
        { tag: 'Grade.getPrograms', checkSession: true }
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
      Log.info(TAG, 'getPrograms', e);
      throw e;
    }

    return programs;
  }

  static async get(
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
        { tag: 'Grade.get', checkSession: true, ajax: true }
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
      Log.info(TAG, 'get', e);
      throw e;
    }
    return report;
  }
}
