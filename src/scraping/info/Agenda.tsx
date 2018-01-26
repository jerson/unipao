import Log from '../../modules/logger/Log';
import RequestUtil from '../utils/RequestUtil';
import { NewsModel } from './News';

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
    let defaultItem: AgendaModel = {
      dayOfMonth: 0,
      dayName: '',
      description: '',
      title: '',
      property: ''
    };
    try {
      let $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/?mod=mod_act&s=age&Page=' + page,
        {},
        { tag: 'Agenda.getList', checkSession: false }
      );

      let $container = $('#ctl00_ContentPlaceHolder1_ctl00_ctl00_cont');

      $('.calendario', $container).each((index, value) => {
        if (!items[index]) {
          items[index] = { ...defaultItem };
        }
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
        if (!items[index]) {
          items[index] = { ...defaultItem };
        }
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
