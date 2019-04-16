import Log from '../../modules/logger/Log';
import RequestUtil from '../utils/RequestUtil';

const moment = require('moment');

export interface NewsModel {
  id: string;
  title: string;
  date: string;
  image?: string;
  url: string;
  subtitle: string;
}

export interface NewsDetailModel {
  id: string;
  title: string;
  image?: string;
  subtitle: string;
  content: string;
}

const TAG = 'News';
export default class News {
  static async getList(page: number): Promise<NewsModel[]> {
    const items: NewsModel[] = [];
    const defaultItem: NewsModel = {
      id: '',
      title: '',
      date: '',
      url: '',
      subtitle: '',
    };
    try {
      const $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/?mod=mod_act&s=not&Page=' + page,
        {},

        { tag: 'News.getList', checkSession: false }
      );

      const $container = $('.centro1');

      $('.col_ent1', $container).each((index, value) => {
        if (!items[index]) {
          items[index] = { ...defaultItem };
        }
        items[index].date = moment(
          $('.fblog', value).text(),
          'DD-MM-yy'
        ).toDate();
      });
      $('.col_ent2', $container).each((index, value) => {
        if (!items[index]) {
          items[index] = { ...defaultItem };
        }
        const href = $('a', value).attr('href') || '';
        items[index].image = $('img', value).attr('src');
        items[index].url = href;
        items[index].id = href;
      });
      $('.col_ent3', $container).each((index, value) => {
        if (!items[index]) {
          items[index] = { ...defaultItem };
        }
        items[index].title = $('.tit_ent', value).text();
        items[index].subtitle = $('.subtit_ent', value).text();
      });
    } catch (e) {
      Log.info(TAG, 'getList', e);
      throw e;
    }

    return items;
  }

  static async get(id: string): Promise<NewsDetailModel> {
    let item: NewsDetailModel;

    try {
      const $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/' + id,
        {},
        { tag: 'News.get', checkSession: false }
      );

      const title = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_lbl_titulo'
      ).text();
      const subtitle = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_lbl_subtitulo'
      ).text();
      const image = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_Image2'
      ).attr('src');
      const content = $('.opnotici').html();

      item = {
        id,
        title,
        subtitle,
        image,
        content,
      };
    } catch (e) {
      Log.info(TAG, 'get', e);
      throw e;
    }

    return item;
  }
}
