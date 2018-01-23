const TAG = 'ImageUtils';
export default class ImageUtils {
    static getImageInfo(url:string) {
        return 'http://www.upao.edu.pe/' + url.replace('../', '');
    }
}
