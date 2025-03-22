export type EaseFunction = (progress: number) => number;
export type EaseKeys = 'linear'|'easeInQuad'|'easeOutQuad'|'easeInOutQuad'|'easeInCubic'|'easeOutCubic'|'easeInOutCubic'|'easeInQuart'|'easeOutQuart'|'easeInOutQuart'|'easeInQuint'|'easeOutQuint'|'easeInOutQuint'|'easeInSine'|'easeOutSine'|'easeInOutSine'|'easeInExpo'|'easeOutExpo'|'easeInOutExpo'|'easeInCirc'|'easeOutCirc'|'easeInOutCirc'|'easeInBack'|'easeOutBack'|'easeInOutBack';

export abstract class Ease {
    static linear(x:number) {
        return x;
    }
    static easeInQuad(x:number) {
        return x * x;
    }
    static easeOutQuad(x:number) {
        return 1 - (1 - x) * (1 - x);
    }
    static easeInOutQuad(x:number) {
        return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    }
    static easeInCubic(x:number) {
        return x * x * x;
    }
    static easeOutCubic(x:number) {
        return 1 - Math.pow(1 - x, 3);
    }
    static easeInOutCubic(x:number) {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }
    static easeInQuart(x:number) {
        return x * x * x * x;
    }
    static easeOutQuart(x:number) {
        return 1 - Math.pow(1 - x, 4);
    }
    static easeInOutQuart(x:number) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    }
    static easeInQuint(x:number) {
        return x * x * x * x * x;
    }
    static easeOutQuint(x:number) {
        return 1 - Math.pow(1 - x, 5);
    }
    static easeInOutQuint(x:number) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
    }
    static easeInSine(x:number) {
        return 1 - Math.cos((x * Math.PI) / 2);
    }
    static easeOutSine(x:number) {
        return Math.sin((x * Math.PI) / 2);
    }
    static easeInOutSine(x:number) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    static easeInExpo(x:number) {
        return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
    }
    static easeOutExpo(x:number) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }
    static easeInOutExpo(x:number) {
        return x === 0
            ? 0
            : x === 1
                ? 1
                : x < 0.5
                    ? Math.pow(2, 20 * x - 10) / 2
                    : (2 - Math.pow(2, -20 * x + 10)) / 2;
    }
    static easeInCirc(x:number) {
        return 1 - Math.sqrt(1 - Math.pow(x, 2));
    }
    static easeOutCirc(x:number) {
        return Math.sqrt(1 - Math.pow(x - 1, 2));
    }
    static easeInOutCirc(x:number) {
        return x < 0.5
            ? (1 - Math.sqrt(1 - Math.pow(2 * x, 2))) / 2
            : (Math.sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
    }
    static easeInBack(x:number) {
        return 2.70158 * x * x * x - 1.70158 * x * x;
    }
    static easeOutBack(x:number) {
        return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
    }
    static easeInOutBack(x:number) {
        return x < 0.5
            ? (Math.pow(2 * x, 2) * (7.18982 * x - 2.59491)) / 2
            : (Math.pow(2 * x - 2, 2) * (3.59491 * (x * 2 - 2) + 2.59491) + 2) / 2;
    }
};