import cio from 'cheerio-without-node-native';
import Log from '../../modules/logger/Log';

const TAG = 'ParamsUtils';
export default class ParamsUtils {
  static getFormData(obj, form = null, namespace = null) {
    let fd = form || new FormData();
    let formKey;

    for (let property in obj) {
      if (obj.hasOwnProperty(property) && obj[property]) {
        if (namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }

        if (obj[property] instanceof Date) {
          fd.append(formKey, obj[property].toISOString());
        } else if (
          typeof obj[property] === 'object' &&
          !(obj[property] instanceof File)
        ) {
          this.getFormData(obj[property], fd, formKey);
        } else {
          fd.append(formKey, obj[property]);
        }
      }
    }

    return fd;
  }

  static async getParams(url) {
    let params = {};
    let $ = '';
    try {
      let response = await fetch(url, {
        method: 'get'
      });
      let html = await response.text();
      $ = cio.load(html);
      $('input').each((index, value) => {
        let name = $(value).attr('name');
        if (name) {
          params[name] = $(value).attr('value');
        }
      });
      $('select').each((index, value) => {
        let name = $(value).attr('name');
        if (name) {
          params[name] = $('option:selected', value).attr('value');
        }
      });
      Log.debug(TAG, params);
    } catch (e) {
      Log.error(TAG, e);
    }
    return { $, params };
  }
}
