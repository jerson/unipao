import Log from '../../modules/logger/Log';
import RequestUtil from '../utils/RequestUtil';
import ImageUtils from '../utils/ImageUtils';

const TAG = 'Gallery';
export default class Gallery {
  static async getList(page: number) {
    let items = [];
    try {
      let $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/?mod=mod_act&s=ima&Page=' + page,
        {},
        false
      );

      let $container = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_dtl_album'
      );

      $('td > table > tr', $container).each((index, value) => {
        let item = {
          url: $('a', value).attr('href'),
          id: $('a', value).attr('href'),
          image: ImageUtils.getImageInfo(
            $('img', value)
              .attr('src')
              .replace('th__', '')
              .trim()
          ),
          title: $('td > strong', value)
            .text()
            .replace(/\s+/g, ' ')
            .trim()
        };

        items.push(item);
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
      let title = $('.menu_cen div > b > span')
        .text()
        .replace('::', '')
        .replace(/\s+/g, ' ')
        .trim();

      let $container = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_dtl_album'
      );

      let images = [];
      $('table', $container).each((index, value) => {
        let image = {
          url: $('a', value).attr('href'),
          id: $('a', value).attr('href'),
          image: ImageUtils.getImageInfo(
            $('img', value)
              .attr('src')
              .replace('th__', '')
              .trim()
          ),
          title: $('img', value)
            .attr('alt')
            .replace(/\s+/g, ' ')
            .trim()
        };

        images.push(image);
      });

      return {
        id,
        title,
        images
      };
    } catch (e) {
      Log.info(TAG, 'get', e);
    }

    return null;
  }
}
