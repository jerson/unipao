import Log from '../../modules/logger/Log';

export interface Params {
  [key: string]: string | number;
}

const TAG = 'ParamsUtils';
export default class ParamsUtils {
  static getFormData3(obj: any) {
    let data = [];
    for (let key of Object.keys(obj)) {
      data.push(`${key}=${encodeURI(obj[key])}`);
    }
    Log.info(data.join('&'));
    return data.join('&');
  }

  static getFormData(obj: any, form: any = null, namespace: any = null) {
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

  static getFormParams($: JQueryStatic): Params {
    let params: Params = {};
    $('input').each((index, value) => {
      let name = $(value).attr('name');
      if (name) {
        params[name] = $(value).attr('value') || '';
      }
    });
    $('select').each((index, value) => {
      let name = $(value).attr('name');
      if (name) {
        params[name] = $('option:selected', value).attr('value') || '';
      }
    });
    return params;
  }
}
