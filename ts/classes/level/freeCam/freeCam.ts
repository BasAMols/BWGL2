import { Actor } from "../../actor/actor";
import { PlaneController } from './freeCamController';
import { v3 } from "../../util/math/vector3";
import { TickerReturnData } from '../../ticker';
import { PlaneCamera } from './camera';
import { IcoSphere } from '../../webgl2/meshes/icoSphere';
import { Material } from '../../webgl2/material';
export class Plane extends Actor {
    public camera: PlaneCamera;
    constructor() {
        super({
            position: v3(0, 200, 0),
            controllers: [
                new PlaneController()
            ]
        });
    }
    public build(): void {
        this.add(IcoSphere.create({
            scale: v3(1, 1, 1),
            subdivisions: 4,
            smoothShading: true,
            material: new Material({
                baseColor: v3(1, 1, 1),
                roughness: 1,
                metallic: 0,
                ambientOcclusion: 0,
            })
        }));
        this.camera = new PlaneCamera(this.scene, this);
        this.scene.camera = this.camera;
    }
    tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}