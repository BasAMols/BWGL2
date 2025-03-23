import { v3 } from './util/math/vector3';
import { Cube } from './webgl2/meshes/cube';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
export class TestLevel extends Scene {
    cube1: SceneObject;
    constructor() {
        super(new Camera( v3(3, 2, 3), v3(0, 0, 0), 45));
        this.camera.setFov(45);
        this.add(this.cube1 = Cube.create(
            v3(0, 0, 0),     // Position at origin
            v3(1, 1, 1),      // Unit scale
            v3(0, 0, 0)   // Rotation in radians
        ));
        this.add(Cube.create(
            v3(1.5, 0, 0),     
            v3(1, 1, 1),      // Unit scale
            v3(0, 0, 0)   // Rotation in radians
        ));
        this.add(Cube.create(
            v3(0, 0, 1.5),     
            v3(1, 1, 1),      // Unit scale
            v3(0, 0, 0)   // Rotation in radians
        ));
        this.add(Cube.create(
            v3(1.5, 0, 1.5),     
            v3(1, 1, 1),      // Unit scale
            v3(0, 0, 0)   // Rotation in radians
        ));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
    }
}