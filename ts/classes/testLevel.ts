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
        this.add(this.cube1 = Cube.create({
            rotation: v3(0, 0, 0)
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