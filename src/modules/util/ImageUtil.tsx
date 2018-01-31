import Config from '../../Config';
import { ProfileModel } from '../../scraping/student/Profile';

const defaultImage =
  'http://s3.amazonaws.com/cdn.roosterteeth.com/uploads/images/8af1db7e-f861-453e-aaca-fcb3fd76bcd1/original/2105229-1445707652129-MNOyFyi.png';
export default class ImageUtil {
  static asset(path: string) {
    let isUrl = path.indexOf('http') !== -1;
    return !isUrl ? Config.url.assets + '/' + path : path;
  }

  static getUserImage(user: ProfileModel) {
    return `https://static.upao.edu.pe/upload/f/${user.id}.jpg`;
  }
}
