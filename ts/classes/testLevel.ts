import { v3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { Quaternion } from './util/math/quaternion';
import { Plane } from './webgl2/meshes/plane';
import { PointLight } from './webgl2/lights/light';
import { IcoSphere } from './webgl2/meshes/icoSphere';

export class TestLevel extends Scene {
    private cube: SceneObject;
    protected clearColor: [number, number, number, number] = [0.2, 0, 0, 1];

    constructor() {
        super(new Camera(v3(3, 1, 3), v3(0, 0, 0), 45), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0
        });
        this.camera.setFov(45);

        const rotation = new Quaternion(); // identity quaternion
        rotation.setAxisAngle(v3(1, 0, 0), 0); // rotate 90 degrees around Y axis

        // Add a ground plane
        this.add(Plane.create({
            position: v3(0, -0.7, 0),
            scale: v3(3, 3, 3),
            color: [1, 1, 1],
            flipNormal: false
        }));

        // Add a cube
        this.add(this.cube = IcoSphere.create({
            subdivisions: 0,
            smoothShading: false,
            rotation: rotation,
            position: v3(0, 0, 0)
        }));

        // // Add directional light (sun-like)
        // this.addLight(new DirectionalLight(
        //     v3(-1, -1, -1).normalize(), // direction
        //     v3(1, 1, 0.9), // warm sunlight color
        //     0.8 // intensity
        // ));


        // Add point light (like a lamp)
        this.addLight(new PointLight(
            v3(0.5, 0.5, 1), // position
            v3(0.2, 0.8, 1.0), // blue-ish color
            1.0, // intensity
            1.0, // constant
            0.09, // linear
            0.032, // quadratic,
            this
        ));
        // Add point light (like a lamp)
        this.addLight(new PointLight(
            v3(1, 1, 0.5), // position
            v3(0.2, 0.8, 1.0), // blue-ish color
            1.0, // intensity
            1.0, // constant
            0.09, // linear
            0.032, // quadratic,
            this
        ));

        // // Add spot light (like a flashlight)
        // this.addLight(new SpotLight(
        //     v3(0, 1, 1), // position
        //     v3(0, -1, -1).normalize(), // direction
        //     v3(1, 0.8, 0.6), // warm color
        //     1.0, // intensity
        //     0.5, // cutOff (30 degrees)
        //     0.5, // outerCutOff (45 degrees),
        //     this
        // ));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);

        // Rotate the cube slowly
        if (this.cube) {
            const rotation = new Quaternion();
            rotation.setAxisAngle(v3(0, 1, 0), 0.01); // Fixed rotation speed
            this.cube.transform.setRotation(
                rotation.multiply(this.cube.transform.getLocalRotation())
            );
        }
    }
}