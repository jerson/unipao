import Log from '../../modules/logger/Log';
import RequestUtil from '../utils/RequestUtil';
import ImageUtils from '../utils/ImageUtils';

export interface GalleryModel {
  id: string;
  title: string;
  image: string;
  imageSmall: string;
  url: string;
}
export interface GalleryDetailModel {
  id: string;
  title: string;
  images: GalleryImageModel[];
}
export interface GalleryImageModel {
  id: string;
  title: string;
  image: string;
  imageSmall: string;
  url: string;
}
const TAG = 'Gallery';
export default class Gallery {
  static async getList(page: number): Promise<GalleryModel[]> {
    let items: GalleryModel[] = [];
    try {
      let $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/?mod=mod_act&s=ima&Page=' + page,
        {},
        { tag: 'Gallery.getList', checkSession: false }
      );

      let $container = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_dtl_album'
      );

      $('td > table > tr', $container).each((index, value) => {
        let imageSmall = ImageUtils.getImageInfo($('img', value).attr('src'));
        let href = $('a', value).attr('href') || '';
        let item: GalleryModel = {
          id: href,
          url: href,
          imageSmall,
          image: imageSmall.replace('th__', ''),
          title: $('td > strong', value)
            .text()
            .replace(/\s+/g, ' ')
            .trim()
        };

        items.push(item);
      });
    } catch (e) {
      Log.info(TAG, 'getList', e);
      throw e;
    }

    return items;
  }

  static async get(id: string): Promise<GalleryDetailModel> {
    let item: GalleryDetailModel;
    try {
      let $ = await RequestUtil.fetch(
        'http://www.upao.edu.pe/actualidad/' + id,
        {},
        { tag: 'Agenda.get', checkSession: false }
      );
      let title = $('.menu_cen div > b > span')
        .text()
        .replace('::', '')
        .replace(/\s+/g, ' ')
        .trim();

      let $container = $(
        '#ctl00_ContentPlaceHolder1_ctl00_ctl00_ctl00_dtl_album'
      );

      let images: GalleryImageModel[] = [];
      $('table', $container).each((index, value) => {
        let imageSmall = ImageUtils.getImageInfo($('img', value).attr('src'));
        let href = $('a', value).attr('href') || '';
        let image: GalleryImageModel = {
          url: href,
          id: href,
          imageSmall,
          image: imageSmall.replace('th__', ''),
          title: ($('img', value).attr('alt') || '')
            .replace(/\s+/g, ' ')
            .replace(/(<([^>]+)>)/gi, '')
            .trim()
        };

        images.push(image);
      });

      item = {
        id,
        title,
        images
      };
    } catch (e) {
      Log.info(TAG, 'get', e);
      throw e;
    }

    return item;
  }
}
