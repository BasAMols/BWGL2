import { v3 } from './util/math/vector3';
import { Cube } from './webgl2/meshes/cube';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { Quaternion } from './util/math/quaternion';
import { Cylinder } from './webgl2/meshes/cylinder';
import { Cone } from './webgl2/meshes/cone';
import { IcoSphere } from './webgl2/meshes/icoSphere';
export class TestLevel extends Scene {
    cube1: SceneObject;
    protected clearColor: [number, number, number, number] = [0.2, 0, 0, 1];
    constructor() {
        super(new Camera(v3(3, 2, 3), v3(0, 0, 0), 45));
        this.camera.setFov(45);

        const rotation = new Quaternion(); // identity quaternion
        rotation.setAxisAngle(v3(0, 1, 0), Math.PI / 2); // rotate 90 degrees around Y axis


        this.add(this.cube1 = Cube.create({
            position: v3(0, 0, 0),
            rotation: rotation
        }));
        this.add(Cylinder.create({
            position: v3(1.5, 0, 0),
            sides: 32,
            smoothShading: false,
            colors: [
                [1.0, 0.0, 0.0], // sides - red
                [0.0, 1.0, 0.0], // top - green
                [0.0, 0.0, 1.0]  // bottom - blue
            ]
        }));
        this.add(Cone.create({
            position: v3(0, 0, 1.5),
            smoothShading: false,
            colors: [
                [1.0, 0.0, 0.0], // sides - red
                [0.0, 1.0, 0.0]  // bottom - green
            ]
        }));
        this.add(IcoSphere.create({
            position: v3(1.5, 0, 1.5),
            subdivisions: 0,
            smoothShading: false,
            color: [0.0, 1.0, 0.0],
        }));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
    }
}