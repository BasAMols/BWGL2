import { v3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { PointLight, SpotLight } from './webgl2/lights/light';
import { Quaternion } from './util/math/quaternion';
import { Arrow } from './webgl2/meshes/arrow';
import { IcoSphere } from './webgl2/meshes/icoSphere';
import { Plane } from './webgl2/meshes/plane';
import { Material } from './webgl2/material';

export class TestLevel extends Scene {
    private mesh: SceneObject;
    protected clearColor: [number, number, number, number] = [0, 0, 0, 1];  // Match demo's black background
    arrow: Arrow;
    spotLight: SpotLight;
    spotLight2: SpotLight;
    spotLight3: SpotLight;

    constructor() {
        super(new Camera({ position: v3(0, 1, 6), target: v3(0, 0, 0), fov: 60 }), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0.05  // reduced from 0 to allow some ambient light
        });

        const rotation = new Quaternion();
        rotation.setAxisAngle(v3(1, 0, 0), 0);

        this.add(Plane.create({
            position: v3(0, -2, 0),
            scale: v3(10, 10, 10),
            material: new Material({
                diffuse: v3(1, 1, 1),
                specular: v3(1, 1, 1),
                shininess: 3
            })
        }));

        this.add(Plane.create({
            position: v3(0, 0, -4),
            scale: v3(10, 10, 10),
            rotation: Quaternion.fromEuler(-Math.PI / 2, 0, Math.PI / 2),
            material: new Material({
                diffuse: v3(1, 1, 1),
                specular: v3(1, 1, 1),
                shininess: 3
            }),

        }));


        this.add(this.mesh = IcoSphere.create({
            position: v3(0, 0, 0),
            scale: v3(2.5, 2.5, 2.5),
            colors: [[1, 1, 1], [1, 1, 1]],
            smoothShading: false,
            subdivisions: 0,
            // ignoreLighting: true,
        }));
        this.add( IcoSphere.create({
            position: v3(-2, -1.25, -2),
            scale: v3(1.5, 1.5, 1.5),
            colors: [[1, 1, 1], [1, 1, 1]],
            smoothShading: true,
            subdivisions: 4,
        }));
        this.add( IcoSphere.create({
            position: v3(-3.5, -1.25, -2),
            scale: v3(1.5, 1.5, 1.5),
            colors: [[1, 1, 1], [1, 1, 1]],
            smoothShading: true,
            subdivisions: 4,
        }));
        this.add( IcoSphere.create({
            position: v3(-2.75, -1.25, -.75),
            scale: v3(1.5, 1.5, 1.5),
            colors: [[1, 1, 1], [1, 1, 1]],
            smoothShading: true,
            subdivisions: 4,
        }));
        this.add( IcoSphere.create({
            position: v3(-2.75, 0, -1.325),
            scale: v3(1.5, 1.5, 1.5),
            colors: [[1, 1, 1], [1, 1, 1]],
            smoothShading: true,
            subdivisions: 4,
        }));

        // Add point light from a good angle to cast shadows
        this.addLight(new PointLight({
            position: v3(0, 5, 4),     // higher position to cast better shadows
            color: v3(1, 1, 1),     
            intensity: 0.1,
            meshContainer: this,
        }));

        // // Add point light from a good angle to cast shadows
        // this.addLight(new PointLight({
        //     position: v3(1, 0, 3),     // higher position to cast better shadows
        //     color: v3(1, 0.2, 0.2),     
        //     intensity: 0.8,   
        //     meshContainer: this,  
        // }));

        // // Add point light from a good angle to cast shadows
        // this.addLight(new PointLight({
        //     position: v3(-0.5, 1, 3),     // higher position to cast better shadows
        //     color: v3(0.2, 1, 0.2),     
        //     intensity: 0.8, 
        //     meshContainer: this,            // increased intensity
        // }));

        this.spotLight = new SpotLight({
            position: v3(0, 0, 0),
            color: v3(1, 0, 0),
            intensity: 0.5,
            cutOff: 0.99,
            direction: v3(0, 0, -1),
            outerCutOff: 0.9,
            meshContainer: this,
        });
        this.addLight(this.spotLight);

        this.spotLight2 = new SpotLight({
            position: v3(0, 0, 0),
            color: v3(0, 0, 1),
            intensity: 0.5,
            cutOff: 0.99,
            direction: v3(0, 0, -1),
            outerCutOff: 0.9,
            meshContainer: this,
        });
        this.addLight(this.spotLight2);

        this.spotLight3 = new SpotLight({
            position: v3(0, 0, 0),
            color: v3(0, 1, 0),
            intensity: 0.5,
            cutOff: 0.99,
            direction: v3(0, 0, -1),
            outerCutOff: 0.9,
            meshContainer: this,
        });
        this.addLight(this.spotLight3);
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);

        // Rotate the cube slowly
        if (this.mesh) {
            const rotation = new Quaternion();
            rotation.setAxisAngle(v3(0, 1, 0), 0.01);
            this.mesh.transform.setRotation(
                rotation.multiply(this.mesh.transform.getLocalRotation())
            );
        }

        // if (this.arrow) {
        //     this.arrow.transform.setPosition(
        //         v3(((obj.total *0.0001) % 1) * 8 - 4, 1, 2)
        //     );
        //     this.arrow.lookAt(v3(0, 0, 0));
        // }

        if (this.spotLight) {
            this.spotLight.setPosition(
                v3(
                    (Math.sin((obj.total + 1000) * 0.0006) % 1) * 4,
                    (Math.sin((obj.total + 8000) * 0.002) % 1) * 3+2,
                    6,
                )
            );

            this.spotLight.lookAt(v3(0, 0, 0));
        }

        if (this.spotLight2) {
            this.spotLight2.setPosition(
                v3(
                    (Math.sin((obj.total + 300) * 0.0015 + 0.3) % 1) * 4,
                    ((Math.sin((obj.total + 4000) * 0.001) % 1)+0.6) * 3+2,
                    6,
                )
            );

            this.spotLight2.lookAt(v3(0, 0, 0));
        }

        if (this.spotLight3) {
            this.spotLight3.setPosition(
                v3(
                    (Math.sin((obj.total + 1000) * 0.001) % 1) * 4,
                    (Math.sin((obj.total + 2000) * 0.0015) % 1) * 3 + 2,
                    6,
                )
            );

            this.spotLight3.lookAt(v3(0, 0, 0));
        }

        this.camera.setPosition(
            v3(
                (Math.sin(obj.total * 0.0005) % 1) * 2,
                0,
                8
            )
        );

    }
}