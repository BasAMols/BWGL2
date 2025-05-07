import { Actor } from "../../actor/actor";
import { PlayerController } from './playerController';
import { v3 } from "../../util/math/vector3";
import { TickerReturnData } from '../../ticker';
import { PlayerCamera } from './playerCamera';
import { MouseMoveReader, MouseScrollReader } from '../../input/mouseReader';
import { KeyboardAxisReader, KeyboardJoyStickReader, KeyboardReader } from '../../input/keyboardReader';
export class PlayerActor extends Actor {
    public camera: PlayerCamera;
    constructor() {
        super({
            position: v3(-10, 1.3, 0),
            controllers: [
                new PlayerController()
            ]
        });
        this.joysticks = {
            'movement': [new KeyboardJoyStickReader(['a', 'd', 's', 'w'])],
            'camera': [new MouseMoveReader()],
        };
        this.buttons = {
            'jump': [new KeyboardReader(' ')],
            'zoom': [new MouseScrollReader()],
            'speed': [new KeyboardAxisReader(['q', 'e'])],
        };
    }
    public build(): void {
        super.build();
        this.camera = new PlayerCamera(this.scene, this);
        this.scene.camera = this.camera;
    }
    tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}