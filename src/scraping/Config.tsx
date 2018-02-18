import NumberUtils from './utils/NumberUtils';

const TAG = 'Config';
export default class Config {
  static URL = 'https://campusvirtual.upao.edu.pe';
  static URL_INFO = 'https://ss01.upao.edu.pe:8081';
  static URL_STATIC = 'https://static.upao.edu.pe';

  static getUserAgentMobile() {
    let agents = [
      'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'
    ];
    return agents[NumberUtils.getRandomInt(0, agents.length - 1)];
  }

  static getUserAgentDesktop() {
    let agents = [
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'
    ];
    return agents[NumberUtils.getRandomInt(0, agents.length - 1)];
  }
}
