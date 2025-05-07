import { Vector2, v2 } from '../util/math/vector2';


export abstract class InputReader<T extends number | Vector2> {
    tick(): void {
        //void
    }
    abstract get value(): T;
}

// export class TouchReader<T extends number|Vector2> extends InputReader<T>{
//     get value(): T {
//         throw new Error('Method not implemented.');
//     }

// }

// export class ControllerReader<T extends number|Vector2> extends InputReader<T>{
//     get value(): T {
//         throw new Error('Method not implemented.');
//     }

// }

export abstract class Input<T extends number | Vector2> {
    constructor(protected readers: InputReader<T>[]) {

    }
    protected abstract _value: T;
    abstract get value(): T;
    public tick() {
        this.readers.forEach((r) => {
            r.tick();
        });
    }
}

export class JoyStick extends Input<Vector2> {
    protected _value: Vector2;
    get value(): Vector2 {
        let total = v2(0);
        this.readers.forEach((r) => {
            total = total.add(r.value);
        });
        return total;
    }
    public addReader(...reader: InputReader<Vector2>[]) {
        this.readers.push(...reader);
    }
}
export class Button extends Input<number> {
    protected _value: number;
    get value(): number {
        let total = 0;
        this.readers.forEach((r) => {
            total += r.value;
        });
        return total;
    }
    public addReader(...reader: InputReader<number>[]) {
        this.readers.push(...reader);
    }
}

export class InputMap {
    joysticks: Record<string, JoyStick> = {};
    buttons: Record<string, Button> = {};
    constructor(
        joysticks: Record<string, InputReader<Vector2>[]> = {},
        buttons: Record<string, InputReader<number>[]> = {}
    ) {
        this.addJoystick(joysticks);
        this.addButton(buttons);
    }


    public tick() {
        Object.values(this.joysticks).forEach((j) => {
            j.tick();
        });
        Object.values(this.buttons).forEach((j) => {
            j.tick();
        });
    }

    public axis(key: string) {
        return this.joysticks[key]?.value;
    }

    public button(key: string) {
        return this.buttons[key]?.value;
    }

    public addJoystick(...joysticks: (Record<string, InputReader<Vector2>[]>)[]) {
        joysticks.forEach((joysticks) => {
            Object.entries(joysticks).forEach(([key, readers]) => {
                if (this.joysticks[key]) {
                    this.joysticks[key].addReader(...readers);
                } else {
                    this.joysticks[key] = new JoyStick(readers);
                }
            });
        });
    }

    public addButton(...buttons: Record<string, InputReader<number>[]>[]) {
        buttons.forEach((buttons) => {
            Object.entries(buttons).forEach(([key, readers]) => {
                if (this.buttons[key]) {
                    this.buttons[key].addReader(...readers);
                } else {
                    this.buttons[key] = new Button(readers);
                }
            });
        });
    }
}