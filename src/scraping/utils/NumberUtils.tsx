const TAG = 'NumberUtils';
export default class NumberUtils {
    static getRandomInt(min:number, max:number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
