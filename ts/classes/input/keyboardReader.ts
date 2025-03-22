import { glob } from '../../game';
import { Vector2, v2 } from '../util/math/vector2';
import { InputReader } from './input';

export class KeyboardReader extends InputReader<number> {
    key: string;
    constructor(key: string) {
        super();
        glob.device.keyboard.register(
            key,
            (frame) => {
                if (!this._state) {
                    this._frameFired = frame;
                }
                this._state = true;
            },
            () => {
                this._state = false;
            }
        );
    }
    private _state: boolean = false;
    private _frameFired: number = 0;
    get value(): number {
        return Number(this._state);
    }
    get first(): boolean {
        return this._frameFired === glob.frame;
    }
}

export class KeyboardJoyStickReader extends InputReader<Vector2> {
    constructor(keys: [string, string, string, string]) {
        super();
        keys.forEach((k, i) => {
            glob.device.keyboard.register(
                k,
                () => { 
                    if (!this._state[Math.floor(i / 2)][i % 2]) {
                        this._frameFired[i] = glob.frame;
                    }
                    this._state[Math.floor(i / 2)][i % 2] = true; 
                    this.setVector(); 
                },
                () => { 
                    this._state[Math.floor(i / 2)][i % 2] = false; 
                    this._frameFired[i] = undefined;
                    this.setVector(); 
                }
            );
        });
    }

    private setVector() {
        this._vector = v2(
            -this._state[0][0] + +this._state[0][1],
            -this._state[1][0] + +this._state[1][1]
        );
    }

    private _state: [[boolean, boolean], [boolean, boolean]] = [[false, false], [false, false]];
    private _vector: Vector2 = v2(0);
    get value(): Vector2 {
        return this._vector;
    }
    private _frameFired: [number, number] = [0, 0];
    get first(): boolean {
        return this._frameFired[0] === glob.frame || this._frameFired[1] === glob.frame;
    }
}

export class KeyboardAxisReader extends InputReader<number> {
    constructor(keys: [string, string]) {
        super();
        keys.forEach((k, i) => {
            glob.device.keyboard.register(
                k,
                (frame) => { 
                    if (!this._state[i]) {
                        this._frameFired[i] = frame;
                    }
                    this._state[i] = true; 
                    this.setValue(); 
                },
                () => { 
                    this._state[i] = false; 
                    this._frameFired[i] = undefined;
                    this.setValue(); 
                }
            );
        });
    }

    private setValue() {
        this._value = -this._state[0] + +this._state[1];
    }

    private _state: [boolean, boolean] = [false, false];
    private _value: number = 0;
    get value(): number {
        return this._value;
    }
    private _frameFired: [number, number] = [0, 0];
    get first(): boolean {
        return this._frameFired[0] === glob.frame || this._frameFired[1] === glob.frame;
    }
}
