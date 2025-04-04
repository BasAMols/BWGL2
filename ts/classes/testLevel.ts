import { v3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { Plane } from './webgl2/meshes/plane';
import { PointLight } from './webgl2/lights/light';
import { Material } from './webgl2/material';
import { Quaternion } from './util/math/quaternion';
import { Arrow } from './webgl2/meshes/arrow';
import { IcoSphere } from './webgl2/meshes/icoSphere';

export class TestLevel extends Scene {
    private cube: SceneObject;
    protected clearColor: [number, number, number, number] = [0, 0, 0, 1];  // Match demo's black background
    arrow: Arrow;

    constructor() {
        super(new Camera({ position: v3(0, 1, 6), target: v3(0, 0, 0), fov: 45 }), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0.1  // reduced from 0 to allow some ambient light
        });

        const rotation = new Quaternion();
        rotation.setAxisAngle(v3(1, 0, 0), 0);

        this.add(Plane.create({
            position: v3(0, -1, 0),
            scale: v3(10, 10, 10),
            material: new Material({
                diffuse: v3(1, 1, 1),
                specular: v3(1, 1, 1)
            })
        }));

        this.add(Plane.create({
            position: v3(0, 0, -3),
            scale: v3(10, 10, 10),
            rotation: Quaternion.fromEuler(-Math.PI / 2, 0, Math.PI / 2),
            material: new Material({
                diffuse: v3(1, 1, 1),
                specular: v3(1, 1, 1)
            }),
            
        }));

        // // Add main cube slightly elevated
        this.add(this.cube = IcoSphere.create({
            position: v3(0, 0, 0),
            scale: v3(1, 1, 1),
            colors: [1, 0, 0],
            smoothShading: false,
        }));

        this.arrow = new Arrow(this, {
            shaftColor: [0.5, 0.5, 0.5],
            headColor: [0.5, 0.5, 0.5],
            length: 0.4,
            shaftRadius: 0.1,
            headLength: 0.15,
            headRadius: 0.2,
            position: v3(-1, 1, 2),
            lookAt: v3(0, 0, 0),
        });
        this.add(this.arrow);
        
        // Add point light from a good angle to cast shadows
        this.addLight(new PointLight({
            position: v3(-1, -0.5, 4),     // higher position to cast better shadows
            color: v3(0.2, 0.2, 1),     
            intensity: 1,             // increased intensity
        }));

        // Add point light from a good angle to cast shadows
        this.addLight(new PointLight({
            position: v3(1, 0, 3),     // higher position to cast better shadows
            color: v3(1, 0.2, 0.2),     
            intensity: 1,             // increased intensity
        }));

        // Add point light from a good angle to cast shadows
        this.addLight(new PointLight({
            position: v3(-2, 4, 4),     // higher position to cast better shadows
            color: v3(0.2, 1, 0.2),     
            intensity: 1,             // increased intensity
        }));
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

        if (this.arrow) {
            this.arrow.transform.setPosition(
                v3(((obj.total *0.0001) % 1) * 8 - 4, 1, 2)
            );
            this.arrow.lookAt(v3(0, 0, 0));
        }

    }
}