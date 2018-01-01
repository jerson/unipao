const TAG = 'NumberUtils';
export default class NumberUtils {
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
