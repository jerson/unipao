import Log from '../../modules/logger/Log';
import RequestUtil from '../utils/RequestUtil';

export interface AgendaModel {
  dayOfMonth: number;
  dayName: string;
  description: string;
  title: string;
  property: string;
}

const TAG = 'Agenda';
export default class Agenda {
  static async getList(page: number): Promise<AgendaModel[]> {
    let items: AgendaModel[] = [];
    try {
      let $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/?mod=mod_act&s=age&Page=' + page,
        {},
        { tag: 'Agenda.getList', checkSession: false }
      );

      let $container = $('#ctl00_ContentPlaceHolder1_ctl00_ctl00_cont');

      $('.calendario', $container).each((index, value) => {
        let dayOfMonth = $('.dia', value)
          .text()
          .trim();
        items[index].dayOfMonth = parseInt(dayOfMonth, 10);
        items[index].dayName = $(value)
          .text()
          .replace(dayOfMonth, '')
          .trim();
      });
      $('.item', $container).each((index, value) => {
        items[index].title = $('b', value).text();
        items[index].description = $('div[align=justify]', value).text();
        items[index].property = $('span[class=organiza]', value).text();
      });
    } catch (e) {
      Log.info(TAG, 'getList', e);
      throw e;
    }
    return items;
  }
}
