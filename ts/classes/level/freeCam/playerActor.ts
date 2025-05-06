import { Actor } from "../../actor/actor";
import { PlayerController } from './playerController';
import { v3 } from "../../util/math/vector3";
import { TickerReturnData } from '../../ticker';
import { PlayerCamera } from './playerCamera';
export class PlayerActor extends Actor {
    public camera: PlayerCamera;
    constructor() {
        super({
            position: v3(-10, 1.3, 0),
            controllers: [
                new PlayerController()
            ]
        });
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