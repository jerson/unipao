import Log from '../../modules/logger/Log';

const TAG = 'ImageUtils';
export default class ImageUtils {
  static getImageInfo(url) {
    return 'http://www.upao.edu.pe/' + url.replace('../', '');
  }
}
