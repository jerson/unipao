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
  static async getExamsHTML(section: any): Promise<string> {
    let html = '';
    try {
      let params = {
        f: 'YAAHIST',
        a: 'BODY_EXAMEN',
        valor: section.code
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Course.getExamsHTML', checkSession: true }
      );

      html = this.sanitizeHTML($('table').html());
    } catch (e) {
      Log.warn(TAG, 'getExamsHTML', e);
      throw e;
    }

    return html;
  }

  static async getJobsHTML(section: any): Promise<string> {
    let html = '';
    try {
      let params = {
        f: 'YAAHIST',
        a: 'BODY_TRABAJO',
        valor: section.code
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Course.getJobsHTML', checkSession: true }
      );

      html = this.sanitizeHTML($('table').html());
    } catch (e) {
      Log.info(TAG, 'getJobsHTML', e);
      throw e;
    }

    return html;
  }

  static async getAssistsHTML(section: any): Promise<string> {
    let html = '';
    try {
      let params = {
        f: 'YAAHIST',
        a: 'BODY_ASISTENCIA',
        valor: section.code
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Course.getAssistsHTML', checkSession: true }
      );

      html = this.sanitizeHTML($('table').html());
    } catch (e) {
      Log.info(TAG, 'getAssistsHTML', e);
      throw e;
    }

    return html;
  }

  static sanitizeHTML(html: string) {
    return html;
    // return html.replace(new RegExp('\\|', 'gi'), '%257C');
  }

  static async getMaterialsHTML(section: any): Promise<string> {
    let html = '';
    try {
      let params = {
        f: 'YAAHIST',
        a: 'BODY_MATERIAL',
        valor: section.code
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Course.getMaterialsHTML', checkSession: true }
      );

      $('a').each((index, item) => {
        $(item)
          .attr('download', 'download')
          .attr('target', '_blank');
      });

      html = this.sanitizeHTML($('table').html());
    } catch (e) {
      Log.info(TAG, 'getMaterialsHTML', e);
      throw e;
    }

    return html;
  }

  static async getForumHTML(section: any): Promise<string> {
    let html = '';
    try {
      let params = {
        f: 'YAAHIST',
        a: 'BODY_FORO',
        valor: section.code
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Course.getForumHTML', checkSession: true }
      );

      html = this.sanitizeHTML($('table').html());
    } catch (e) {
      Log.info(TAG, 'getForumHTML', e);
      throw e;
    }

    return html;
  }

  static async getGradesHTML(course: any): Promise<string> {
    let html = '';
    try {
      let params = {
        f: 'YAAHIST',
        a: 'SHOW_NOTAS',
        valor: course.code,
        codigo: course.id
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Course.getGradesHTML', checkSession: true }
      );

      let table = $('table')
        .first()
        .html();
      html = table ? `<table>${table}</table>` : '';
    } catch (e) {
      Log.info(TAG, 'getGradesHTML', e);
      throw e;
    }

    return html;
  }

  static async getSyllables(course: any): Promise<SyllableModel[]> {
    let items: SyllableModel[] = [];
    try {
      let params = {
        f: 'YAAHIST',
        a: 'SHOW_SILABO',
        valor: course.code,
        codigo: course.id
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
        },
        { tag: 'Course.getSyllables', checkSession: true }
      );

      $('table a').each((index, value) => {
        let url = $(value).attr('href') || '';
        let name = $(value)
          .text()
          .trim();

        if (url.indexOf('.pdf') === -1) {
          return;
        }

        items.push({
          id: url,
          url,
          name
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
      let params = {
        f: 'YAAHIST',
        a: 'SECC_MATERIAL',
        valor: course.code,
        codigo: course.id
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
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
      let params = {
        f: 'YAAHIST',
        a: 'SECC_ASISTENCIAS',
        valor: course.code,
        codigo: course.id
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
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
      let params = {
        f: 'YAAHIST',
        a: 'SECC_FORO',
        valor: course.code,
        codigo: course.id
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
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
      let params = {
        f: 'YAAHIST',
        a: 'SECC_TRABAJO',
        valor: course.code,
        codigo: course.id
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
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
      let params = {
        f: 'YAAHIST',
        a: 'SECC_EXAMEN',
        valor: course.code,
        codigo: course.id
      };

      let $ = await RequestUtil.fetch(
        '/controlador/cargador.aspx',
        {
          method: 'POST',
          body: ParamsUtils.getFormData(params)
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
    let items: SectionModel[] = [];

    if (!$) {
      return items;
    }
    $('.yaahist_mtrl').each((index, value) => {
      let id = $(value).attr('id') || '';
      let codeString = $(value).attr('onclick') || '';

      let parts = codeString.split("','");
      let code = (parts[1] || '').replace("');", '').trim();
      let teacher = $('table > tr > td:nth-child(3) > div:nth-child(1)', value)
        .text()
        .trim();
      let nrc = $('table > tr > td:nth-child(3) > div:nth-child(2)', value)
        .text()
        .replace('NRC:', '')
        .trim();
      let name = $('table > tr > td:nth-child(3) > div:nth-child(3)', value)
        .text()
        .trim();
      items.push({
        id,
        code,
        name,
        nrc,
        teacher
      });
    });

    return items;
  }
}
