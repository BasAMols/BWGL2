import { Actor } from "../../../actor/actor";
import { v3 } from "../../../util/math/vector3";
import { TickerReturnData } from '../../../ticker';
import { PlayerCamera } from './cam_player';
import { MouseScrollReader } from '../../../input/mouseReader';
import { KeyboardAxisReader, KeyboardJoyStickReader, KeyboardReader } from '../../../input/keyboardReader';
import { Cube } from '../../../webgl2/meshes/cube';
import { Quaternion } from '../../../util/math/quaternion';
import { Material } from '../../../webgl2/material';
import { PlayerController } from './c_player';
export class PlayerActor extends Actor {
    public camera: PlayerCamera;

    constructor() {
        super({
            position: v3(0, 0, 0),
            controllers: [
                new PlayerController({
                    movement: {
                        maxSpeed: 30,              // 30 km/h max speed
                        acceleration: 3,           // Quick acceleration
                        deceleration: 4,           // Quick deceleration
                        brakeDeceleration: 6,      // Responsive braking
                        reference: 'world',       // Movement relative to camera (default)
                        turnSpeed: 480,            // Fast turning (480°/sec)
                    },
                    inputMapping: {
                        forward: '-x',
                        right: '-z',
                        up: '+y',
                    }
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
            position: v3(0, 1.05, 0),
            rotation: Quaternion.fromEuler(0, Math.PI/2, 0),
            scale: v3(0.4, 1.3, 0.3),
            material: new Material({
                baseColor: v3(1, 0, 0),
                roughness: 0.5,
                metallic: 0.5,
                ambientOcclusion: 0.5,
                emissive: v3(0, 0, 0),
            })
        }));
        this.add(Cube.create({
            position: v3(0.1, 1.9, 0),
            rotation: Quaternion.fromEuler(0, Math.PI/2, 0),
            scale: v3(0.2, 0.3, 0.3),
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