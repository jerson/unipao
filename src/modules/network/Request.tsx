import Auth from '../session/Auth';
import Log from '../logger/Log';

export interface UserSettings {
  baseUrl: string;
}

export interface Settings {
  baseUrl: string;
}

export interface Options {
  secure?: boolean;
}

export interface Body {
  [key: string]: string | number;
}

export interface Headers {
  [key: string]: string;
}

export interface Ids {
  [key: string]: string;
}

export interface Response {
  status: number;
  body: any;
  headers: {
    [key: string]: string;
  };
}

export type Id = string;
export type Method = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE';

export default class Request {
  static settings: Settings = { baseUrl: '' };
  static requests: Ids = {};

  static init(settings: UserSettings) {
    if (settings) {
      this.settings = Object.assign({}, this.settings, settings);
    }
  }

  static abort(id: string) {
    //TODO
  }

  static async get(
    path: string,
    body?: Body,
    options?: Options
  ): Promise<Response> {
    let form: string[] = [];
    let query = '';
    let requestBody: Body = {};
    if (body) {
      let params = { ...body };
      this.addItemsToForm(form, [], params);
      requestBody = {};
    } else {
      requestBody = {};
    }

    if (form.length > 0) {
      query = `?${form.join('&')}`;
    }

    return this.defaultRequest('GET', path + query, requestBody, options);
  }

  static async delete(
    path: string,
    body?: Body,
    options?: Options
  ): Promise<Response> {
    let form: string[] = [];
    let query = '';
    let requestBody: Body = {};
    if (body) {
      let params = { ...body };
      this.addItemsToForm(form, [], params);
      requestBody = {};
    } else {
      requestBody = {};
    }

    if (form.length > 0) {
      query = `?${form.join('&')}`;
    }

    return this.defaultRequest('DELETE', path + query, requestBody, options);
  }

  static async head(
    path: string,
    body: Body,
    options?: Options
  ): Promise<Response> {
    let form: string[] = [];
    let query = '';
    let requestBody: Body = {};
    if (body) {
      let params = { ...body };
      this.addItemsToForm(form, [], params);
      requestBody = {};
    } else {
      requestBody = {};
    }

    if (form.length > 0) {
      query = `?${form.join('&')}`;
    }

    return this.defaultRequest('HEAD', path + query, requestBody, options);
  }

  static async post(
    path: string,
    body: Body,
    options?: Options
  ): Promise<Response> {
    return this.defaultRequest('POST', path, body, options);
  }

  static async put(
    path: string,
    body: Body,
    options?: Options
  ): Promise<Response> {
    return this.defaultRequest('PUT', path, body, options);
  }

  static async remove(
    path: string,
    body: Body,
    options?: Options
  ): Promise<Response> {
    return this.defaultRequest('DELETE', path, body, options);
  }

  private static async defaultRequest(
    method: Method,
    path: string,
    body: Body,
    options?: Options
  ): Promise<Response> {
    let isMultipart = body instanceof FormData;
    let requestHeaders: Headers = {};
    if (options) {
      requestHeaders = this.getHeaders(options);
    }
    if (!isMultipart) {
      requestHeaders['Accept'] = 'application/json';
      requestHeaders['Content-Type'] = 'application/json';
    }
    let fullPath = this.getFullPath(path);
    let response: Response = {
      status: 500,
      body: { error: true, code: 0, message: 'Desconocido' },
      headers: {}
    };

    try {
      Log.debug('[FETCH]', method, fullPath, body);
      let requestBody: any = undefined;
      let allowBody = !(method === 'GET' || method === 'HEAD');
      if (allowBody) {
        if (isMultipart) {
          requestBody = body;
        } else {
          body['hash_token'] = Auth.settings.hashToken;

          if (options && options.secure) {
            body['token'] = Auth.getAccessToken();
            body['id_usuario'] = Auth.getUserId();
          }

          requestBody = JSON.stringify(body);
        }
      }

      let fetchResponse = await fetch(fullPath, {
        method,
        headers: {
          ...requestHeaders
        },
        body: requestBody
      });
      let headers: Headers = {};
      fetchResponse.headers.forEach((name, key) => {
        headers[key] = name;
      });

      let resBody = await fetchResponse.json();
      let success = typeof resBody.success === 'number' ? resBody.success : -1;
      if (success === 0) {
        // Emitter.emit('onForceLogout', true);
        response = {
          status: 555,
          headers: headers || {},
          body: resBody
        };
      } else {
        response = {
          status: fetchResponse.status,
          headers: headers || {},
          body: resBody
        };
      }
    } catch (e) {
      Log.warn(e);
      // let message = e.message || '';
      // if (message.indexOf('Network request failed') !== -1) {
      //     response = {
      //         status: 200,
      //         headers: {},
      //         body: {}
      //     }
      // }
    }

    if (response.status === 200) {
      return response;
    } else {
      throw response;
    }
  }

  private static getHeaders(options: Options): Headers {
    return {};
  }

  private static getFullPath(path: string): string {
    return path.indexOf('http') === 0
      ? path
      : this.settings.baseUrl + '/' + path;
  }

  private static addItemsToForm(form: string[], names: string[], obj: any) {
    if (obj === undefined || obj === '' || obj === null) {
      return this.addItemToForm(form, names, '');
    }

    if (
      typeof obj === 'string' ||
      typeof obj === 'number' ||
      obj === true ||
      obj === false
    ) {
      return this.addItemToForm(form, names, obj);
    }

    if (obj instanceof Date) {
      return this.addItemToForm(form, names, obj.toJSON());
    }

    // array or otherwise array-like
    if (obj instanceof Array) {
      return obj.forEach((v, i) => {
        names.push(`[${i}]`);
        this.addItemsToForm(form, names, v);
        names.pop();
      });
    }

    if (typeof obj === 'object') {
      return Object.keys(obj).forEach(k => {
        names.push(k);
        this.addItemsToForm(form, names, obj[k]);
        names.pop();
      });
    }
  }

  private static addItemToForm(form: string[], names: string[], value: string) {
    let name = encodeURIComponent(names.join('.').replace(/\.\[/g, '['));
    value = encodeURIComponent(value.toString());
    form.push(`${name}=${value}`);
  }
}
