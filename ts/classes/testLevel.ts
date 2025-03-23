import { v3 } from './util/math/vector3';
import { Cube } from './webgl2/meshes/cube';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { Quaternion } from './util/math/quaternion';
export class TestLevel extends Scene {
    cube1: SceneObject;
    protected clearColor: [number, number, number, number] = [1, 0, 0, 1];
    constructor() {
        super(new Camera(v3(3, 2, 3), v3(0, 0, 0), 45));
        this.camera.setFov(45);

        const rotation = new Quaternion(); // identity quaternion
        rotation.setAxisAngle(v3(0, 1, 0), Math.PI / 2); // rotate 90 degrees around Y axis


        this.add(this.cube1 = Cube.create({
            position: v3(0, 0, 0),
            rotation: rotation
        }));
        this.add(Cube.create({
            position: v3(1.5, 0, 0),
        }));
        this.add(Cube.create({
            position: v3(0, 0, 1.5),
        }));
        this.add(Cube.create({
            position: v3(1.5, 0, 1.5),
        }));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
    }
}