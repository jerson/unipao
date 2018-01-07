import Log from '../../modules/logger/Log';
import RequestUtil from '../utils/RequestUtil';
import moment from 'moment';

const TAG = 'News';
export default class News {
  static async getList(page: number) {
    let news = [];
    try {
      let $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/?mod=mod_act&s=not&Page=' + page,
        {},
        false
      );

      let $container = $('.centro1');

      $('.col_ent1', $container).each((index, value) => {
        if (!news[index]) {
          news[index] = {};
        }
        news[index].date = moment(
          $('.fblog', value).text(),
          'DD-MM-yy'
        ).toDate();
      });
      $('.col_ent2', $container).each((index, value) => {
        if (!news[index]) {
          news[index] = {};
        }
        news[index].image = $('img', value).attr('src');
        news[index].url = $('a', value).attr('href');
        news[index].id = news[index].url;
      });
      $('.col_ent3', $container).each((index, value) => {
        if (!news[index]) {
          news[index] = {};
        }
        news[index].title = $('.tit_ent', value).text();
        news[index].subtitle = $('.subtit_ent', value).text();
      });
    } catch (e) {
      Log.info(TAG, 'login', e);
    }

    return news;
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

      let news = {
        title,
        subtitle,
        image,
        content
      };

      return news;
    } catch (e) {
      Log.info(TAG, 'login', e);
    }

    return null;
  }
}
