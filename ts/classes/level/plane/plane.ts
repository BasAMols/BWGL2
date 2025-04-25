import { Actor } from "../../actor/actor";
import { PlaneController } from './planeController';
import { v3 } from "../../util/math/vector3";
import { Cube } from '../../webgl2/meshes/cube';
import { TickerReturnData } from '../../ticker';
import { PlaneCamera } from './camera';
export class Plane extends Actor {
    public camera: PlaneCamera;
    constructor() {
        super({
            controllers: [
                new PlaneController()
            ]
        });
    }
    public build(): void {
        this.add(Cube.create({
            position: v3(0, 200, 0),
            scale: v3(100, 100, 100),
            material: {
                baseColor: v3(0.5, 0.5, 0.5),
                roughness: 0.5,
                metallic: 0.5,
                ambientOcclusion: 1,
                emissive: v3(0.1, 0.1, 0.1)
            }
        }));
        this.scene.camera = new PlaneCamera(this.scene, this);
    }
    tick(obj: TickerReturnData): void {
        super.tick(obj);
    }
}