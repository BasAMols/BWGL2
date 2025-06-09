import { Actor } from "../../actor/actor";
import { v3 } from "../../util/math/vector3";
import { TickerReturnData } from '../../ticker';
import { PlayerCamera } from './playerCamera';
import { MouseScrollReader } from '../../input/mouseReader';
import { KeyboardAxisReader, KeyboardJoyStickReader, KeyboardReader } from '../../input/keyboardReader';
import { Cube } from '../../webgl2/meshes/cube';
import { Quaternion } from '../../util/math/quaternion';
import { Material } from '../../webgl2/material';
import { PlayerController } from './playerController';
export class PlayerActor extends Actor {
    public camera: PlayerCamera;

    constructor() {
        super({
            position: v3(-10, 1, 0),
            controllers: [
                new PlayerController({
                    turnSpeed: 480,            // Fast turning (480°/sec)
                    acceleration: 3,           // Quick acceleration
                    deceleration: 4,           // Quick deceleration
                    brakeDeceleration: 6,      // Responsive braking
                    maxSpeed: 30,              // 30 km/h max speed
                    maxJumps: 2,                  // Allow double jump
                 })
            ]
        });
        this.joysticks = {
            'movement': [new KeyboardJoyStickReader(['a', 'd', 's', 'w'])],
        };
        this.buttons = {
            'jump': [new KeyboardReader(' ')],
            'zoom': [new MouseScrollReader(), new KeyboardAxisReader(['-', '='])],
            'speed': [new KeyboardAxisReader(['q', 'e'])],
        };
    }
    public build(): void {
        super.build();
        this.camera = new PlayerCamera(this.scene, this);
        this.scene.camera = this.camera;

        this.add(Cube.create({
            position: v3(0, 1, 0),
            rotation: Quaternion.fromEuler(0, 0, 0),
            scale: v3(1, 2, 1),
            material: new Material({
                baseColor: v3(1, 0, 0),
                roughness: 0.5,
                metallic: 0.5,
                ambientOcclusion: 0.5,
                emissive: v3(0, 0, 0),
            })
        }));

    }
    tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}