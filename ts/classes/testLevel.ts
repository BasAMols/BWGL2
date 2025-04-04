import { v3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { Plane } from './webgl2/meshes/plane';
import { PointLight } from './webgl2/lights/light';
import { Material } from './webgl2/material';
import { Quaternion } from './util/math/quaternion';
import { Cone } from './webgl2/meshes/cone';

export class TestLevel extends Scene {
    private cube: SceneObject;
    protected clearColor: [number, number, number, number] = [0, 0, 0, 1];  // Match demo's black background

    constructor() {
        super(new Camera(v3(3, 3, 3), v3(0, 0, 0), 45), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0.1  // reduced from 0 to allow some ambient light
        });
        this.camera.setFov(45);

        const rotation = new Quaternion();
        rotation.setAxisAngle(v3(1, 0, 0), 0);

        this.add(Plane.create({
            position: v3(0, -1, 0),
            scale: v3(10, 10, 10),
            material: new Material({
                ambient: v3(1,0,0).scale(0.2).vec,
                diffuse: v3(1,0,0).vec,
                specular: v3(1,1,1).vec
            })
        }));
        // Add main cube slightly elevated
        this.add(this.cube = Cone.create({
            sides: 4, 
            smoothShading: false,
            rotation: rotation,
            position: v3(0, 1, 0),
            scale: v3(1, 0.8, 1),
        }));

        // Add point light from a good angle to cast shadows
        this.addLight(new PointLight(
            v3(4, 4, 2),     // higher position to cast better shadows
            v3(1, 1, 1),     // white light
            1.5,             // increased intensity
            1.0,             // constant
            0.09,            // linear
            0.032,           // quadratic
            this
        ));

        // Add second point light for better illumination
        this.addLight(new PointLight(
            v3(-2, 3, -2),   // opposite position
            v3(0.8, 0.8, 1.0), // slightly blue tint
            1.0,             // intensity
            1.0,             // constant
            0.09,            // linear
            0.032,           // quadratic
            this
        ));

    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        
        // Rotate the cube slowly
        if (this.cube) {
            const rotation = new Quaternion();
            rotation.setAxisAngle(v3(0, 1, 0), 0.01);
            this.cube.transform.setRotation(
                rotation.multiply(this.cube.transform.getLocalRotation())
            );
        }
    }
}