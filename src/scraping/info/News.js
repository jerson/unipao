import Log from '../../modules/logger/Log';
import RequestUtil from '../utils/RequestUtil';
import moment from 'moment';

const TAG = 'News';
export default class News {
  static async getList(page: number) {
    let items = [];
    try {
      let $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/?mod=mod_act&s=not&Page=' + page,
        {},
        false
      );

      let $container = $('.centro1');

      $('.col_ent1', $container).each((index, value) => {
        if (!items[index]) {
          items[index] = {};
        }
        items[index].date = moment(
          $('.fblog', value).text(),
          'DD-MM-yy'
        ).toDate();
      });
      $('.col_ent2', $container).each((index, value) => {
        if (!items[index]) {
          items[index] = {};
        }
        items[index].image = $('img', value).attr('src');
        items[index].url = $('a', value).attr('href');
        items[index].id = items[index].url;
      });
      $('.col_ent3', $container).each((index, value) => {
        if (!items[index]) {
          items[index] = {};
        }
        items[index].title = $('.tit_ent', value).text();
        items[index].subtitle = $('.subtit_ent', value).text();
      });
    } catch (e) {
      Log.info(TAG, 'getList', e);
    }

    return items;
  }

  static async get(id: string) {
    try {
      let $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/' + id,
        {},
        false
      );

      let title = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_lbl_titulo'
      ).text();
      let subtitle = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_lbl_subtitulo'
      ).text();
      let image = $('#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_Image2').attr(
        'src'
      );
      let content = $('.opnotici').html();

      return {
        id,
        title,
        subtitle,
        image,
        content
      };
    } catch (e) {
      Log.info(TAG, 'get', e);
    }

    return null;
  }
}