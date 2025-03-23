import { v3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { Quaternion } from './util/math/quaternion';
import { Cube } from './webgl2/meshes/cube';
export class TestLevel extends Scene {
    cube1: SceneObject;
    protected clearColor: [number, number, number, number] = [0.2, 0, 0, 1];
    constructor() {
        super(new Camera(v3(3, 2, 3), v3(0, 0, 0), 45));
        this.camera.setFov(45);

        const rotation = new Quaternion(); // identity quaternion
        rotation.setAxisAngle(v3(1, 0, 0), 0); // rotate 90 degrees around Y axis

        this.add(this.cube1 = Cube.create({
            rotation: rotation
        }));
        // this.add(Cylinder.create({
        //     sides: 16,
        //     rotation: rotation,
        //     smoothShading: false,
        //     colors: [
        //         [1.0, 0.0, 0.0], // sides - red
        //         [0.0, 1.0, 0.0], // top - green
        //         [0.0, 0.0, 1.0]  // bottom - blue
        //     ]
        // }));
        // this.add(Cone.create({
        //     position: v3(0, 0, 0),
        //     smoothShading: false,
        //     rotation: rotation,
        //     colors: [
        //         [1.0, 0.0, 0.0], // sides - red
        //         [0.0, 1.0, 0.0]  // bottom - green
        //     ]
        // }));
        // this.add(IcoSphere.create({
        //     subdivisions: 1,
        //     rotation: rotation,
        //     smoothShading: false,
        //     color: [0.0, 1.0, 0.0],
        // }));
        // this.add(Wedge.create({
        //     position: v3(0, 0, 0),
        //     rotation: rotation,
        // }));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
    }
}