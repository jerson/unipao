import RequestUtil from '../../utils/RequestUtil';
import ParamsUtils from '../../utils/ParamsUtils';
import Log from '../../../modules/logger/Log';
import { CourseModel } from '../Intranet';

const TAG = 'Course';

export interface SyllableModel {
  id: string;
  url: string;
  name: string;
}

export interface SectionModel {
  id: string;
  code: string;
  nrc: string;
  teacher: string;
  name: string;
}

export default class Course {
  static async getExamsHTML(section: SectionModel): Promise<string> {
    let html = '';
    try {
      const params = {
        f: 'YAAHIST',
        a: 'BODY_EXAMEN',
        valor: section.code,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getExamsHTML', checkSession: true, ajax: true }
      );

      html = this.sanitizeHTML($('body').html());
    } catch (e) {
      Log.warn(TAG, 'getExamsHTML', e);
      throw e;
    }

    return html;
  }

  static async getJobsHTML(section: SectionModel): Promise<string> {
    let html = '';
    try {
      const params = {
        f: 'YAAHIST',
        a: 'BODY_TRABAJO',
        valor: section.code,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getJobsHTML', checkSession: true, ajax: true }
      );

      html = this.sanitizeHTML($('body').html());
    } catch (e) {
      Log.info(TAG, 'getJobsHTML', e);
      throw e;
    }

    return html;
  }

  static async getAssistsHTML(section: SectionModel): Promise<string> {
    let html = '';
    try {
      const params = {
        f: 'YAAHIST',
        a: 'BODY_ASISTENCIA',
        valor: section.code,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getAssistsHTML', checkSession: true, ajax: true }
      );

      html = this.sanitizeHTML($('body').html());
    } catch (e) {
      Log.info(TAG, 'getAssistsHTML', e);
      throw e;
    }

    return html;
  }

  static sanitizeHTML(html: string): string {
    return html;
    // return html.replace(new RegExp('\\|', 'gi'), '%257C');
  }

  static async getMaterialsHTML(section: SectionModel): Promise<string> {
    let html = '';
    try {
      const params = {
        f: 'YAAHIST',
        a: 'BODY_MATERIAL',
        valor: section.code,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getMaterialsHTML', checkSession: true, ajax: true }
      );

      $('a').each((index, item) => {
        $(item)
          .attr('download', 'download')
          .attr('target', '_blank');
      });

      html = this.sanitizeHTML($('body').html());
    } catch (e) {
      Log.info(TAG, 'getMaterialsHTML', e);
      throw e;
    }

    return html;
  }

  static async getForumHTML(section: SectionModel): Promise<string> {
    let html = '';
    try {
      const params = {
        f: 'YAAHIST',
        a: 'BODY_FORO',
        valor: section.code,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getForumHTML', checkSession: true, ajax: true }
      );

      html = this.sanitizeHTML($('body').html());
    } catch (e) {
      Log.info(TAG, 'getForumHTML', e);
      throw e;
    }

    return html;
  }

  static async getGradesHTML(course: CourseModel): Promise<string> {
    let html = '';
    try {
      const params = {
        f: 'YAAHIST',
        a: 'SHOW_NOTAS',
        valor: course.code,
        codigo: course.id,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getGradesHTML', checkSession: true }
      );

      const table = $('table')
        .first()
        .html();
      html = table ? `<table>${table}</table>` : '';
    } catch (e) {
      Log.info(TAG, 'getGradesHTML', e);
      throw e;
    }

    return html;
  }

  static async getSyllables(course: CourseModel): Promise<SyllableModel[]> {
    const items: SyllableModel[] = [];
    try {
      const params = {
        f: 'YAAHIST',
        a: 'SHOW_SILABO',
        valor: course.code,
        codigo: course.id,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getSyllables', checkSession: true }
      );

      $('table a').each((index, value) => {
        const url = $(value).attr('href') || '';
        const name = $(value)
          .text()
          .trim();

        if (url.indexOf('.pdf') === -1) {
          return;
        }

        items.push({
          id: url,
          url,
          name,
        });
      });
    } catch (e) {
      Log.info(TAG, 'getSyllables', e);
      throw e;
    }

    return items;
  }

  static async getMaterialsSections(
    course: CourseModel
  ): Promise<SectionModel[]> {
    let items = [];
    try {
      const params = {
        f: 'YAAHIST',
        a: 'SECC_MATERIAL',
        valor: course.code,
        codigo: course.id,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getMaterialsSections', checkSession: true }
      );

      items = this.parseSections($);
    } catch (e) {
      Log.info(TAG, 'getMaterialsSections', e);
      throw e;
    }

    return items;
  }

  static async getAssistsSections(
    course: CourseModel
  ): Promise<SectionModel[]> {
    let items = [];
    try {
      const params = {
        f: 'YAAHIST',
        a: 'SECC_ASISTENCIAS',
        valor: course.code,
        codigo: course.id,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getAssistsSections', checkSession: true }
      );

      items = this.parseSections($);
    } catch (e) {
      Log.info(TAG, 'getAssistsSections', e);
      throw e;
    }

    return items;
  }

  static async getForumSections(course: CourseModel): Promise<SectionModel[]> {
    let items = [];
    try {
      const params = {
        f: 'YAAHIST',
        a: 'SECC_FORO',
        valor: course.code,
        codigo: course.id,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getForumSections', checkSession: true }
      );

      items = this.parseSections($);
    } catch (e) {
      Log.info(TAG, 'getForumSections', e);
      throw e;
    }

    return items;
  }

  static async getJobsSections(course: CourseModel): Promise<SectionModel[]> {
    let items = [];
    try {
      const params = {
        f: 'YAAHIST',
        a: 'SECC_TRABAJO',
        valor: course.code,
        codigo: course.id,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getJobsSections', checkSession: true }
      );

      items = this.parseSections($);
    } catch (e) {
      Log.info(TAG, 'getJobsSections', e);
      throw e;
    }

    return items;
  }

  static async getExamsSections(course: CourseModel): Promise<SectionModel[]> {
    let items = [];
    try {
      const params = {
        f: 'YAAHIST',
        a: 'SECC_EXAMEN',
        valor: course.code,
        codigo: course.id,
      };

      const $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params),
        },
        { tag: 'Course.getExamsSections', checkSession: true }
      );

      items = this.parseSections($);
    } catch (e) {
      Log.info(TAG, 'getExamsSections', e);
      throw e;
    }

    return items;
  }

  static parseSections($: JQueryStatic): SectionModel[] {
    const items: SectionModel[] = [];

    if (!$) {
      return items;
    }
    $('.yaahist_mtrl').each((index, value) => {
      const id = $(value).attr('id') || '';
      const codeString = $(value).attr('onclick') || '';

      const parts = codeString.split("','");
      const code = (parts[1] || '').replace("');", '').trim();
      const teacher = $(
        'table > tr > td:nth-child(3) > div:nth-child(1)',
        value
      )
        .text()
        .trim();
      const nrc = $('table > tr > td:nth-child(3) > div:nth-child(2)', value)
        .text()
        .replace('NRC:', '')
        .trim();
      const name = $('table > tr > td:nth-child(3) > div:nth-child(3)', value)
        .text()
        .trim();
      items.push({
        id,
        code,
        name,
        nrc,
        teacher,
      });
    });

    return items;
  }
}
