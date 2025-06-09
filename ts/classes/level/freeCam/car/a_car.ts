import { Actor } from "../../../actor/actor";
import { v3 } from "../../../util/math/vector3";
import { TickerReturnData } from '../../../ticker';
import { MouseScrollReader } from '../../../input/mouseReader';
import { KeyboardAxisReader, KeyboardJoyStickReader, KeyboardReader } from '../../../input/keyboardReader';
import { Cube } from '../../../webgl2/meshes/cube';
import { Quaternion } from '../../../util/math/quaternion';
import { Material } from '../../../webgl2/material';
import { CarController } from './c_car';
import { ContainerObject } from '../../../webgl2/meshes/containerObject';
import { Cylinder } from '../../../webgl2/meshes/cylinder';
export class CarActor extends Actor {

    constructor(levelWrapper: ContainerObject) {
        super({
            position: v3(0, 0, 0),
            controllers: [
                new CarController({
                    movement: {
                        maxSpeed: 30,              // 30 km/h max speed
                        acceleration: 3,           // Quick acceleration
                        deceleration: 4,           // Quick deceleration
                        brakeDeceleration: 6,      // Responsive braking
                        reference: 'world',       // Movement relative to camera (default)
                        turnSpeed: 480,            // Fast turning (480°/sec)
                        rotateToMovement: false
                    },
                 }, levelWrapper)
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

        this.add(Cube.create({
            position: v3(0, 0.3, 0),
            rotation: Quaternion.fromEuler(0, 0, 0),
            scale: v3(2, 0.2, 4),
            material: new Material({
                baseColor: v3(0.7, 0.7, 0.7),
                roughness: 0.5,
                metallic: 0.5,
                ambientOcclusion: 0.5,
                emissive: v3(0, 0, 0),
            })
        }));
        this.add(Cube.create({
            position: v3(0, 0.9, -1.7),
            rotation: Quaternion.fromEuler(0, 0, 0),
            scale: v3(2, 1, 0.6),
            material: new Material({
                baseColor: v3(0.7, 0.7, 0.7),
                roughness: 0.5,
                metallic: 0.5,
                ambientOcclusion: 0.5,
                emissive: v3(0, 0, 0),
            })
        }));
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                this.add(Cylinder.create({
                    position: v3((1.05*x-0.55)*2.2, 0.4, (1*y-0.5)*3),
                    rotation: Quaternion.fromEuler(0, 0, Math.PI/2),
                    scale: v3(0.8, 0.2, 0.8),
                    material: new Material({
                        baseColor: v3(0.7, 0.7, 0.7),
                    })
                }));
            }
        }
    }
    tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}