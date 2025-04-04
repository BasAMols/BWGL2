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
import { v2 } from './util/math/vector2';
import { Cube } from './webgl2/meshes/cube';
import { Wedge } from './webgl2/meshes/wedge';
import { Cone } from './webgl2/meshes/cone';
import { ContainerObject } from './webgl2/meshes/containerObject';

export class TestLevel extends Scene {
    private mesh: SceneObject;
    protected clearColor: [number, number, number, number] = [0, 0, 0, 1];  // Match demo's black background
    arrow: Arrow;
    spotLight: SpotLight;
    spotLight2: SpotLight;
    spotLight3: SpotLight;

    constructor() {
        super(new Camera({ position: v3(0, 1, 6), target: v3(0, 0, 0), fov: 40 }), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0.05  // reduced from 0 to allow some ambient light
        });

        const rotation = new Quaternion();
        rotation.setAxisAngle(v3(1, 0, 0), 0);

        this.add(Plane.create({
            position: v3(0, -2, 0),
            scale: v2(10, 10),
            material: new Material({
                diffuse: v3(0, 1, 1),
                specular: v3(1, 1, 1),
                shininess: 3
            })
        }));

        this.add(Plane.create({
            position: v3(0, 0.5, -4),
            scale: v2(5, 10),
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
            color: [1, 1, 1],
            smoothShading: false,
            subdivisions: 0,
            // ignoreLighting: true,
        }));

        for (let i = 0; i < 2; i++) {
            const container = new ContainerObject({
                position: v3(4.5*i, 0, -4*i),
                rotation: Quaternion.fromEuler(0, (Math.PI)*i, 0),
            });
            const positions = [
                v3(-2 + 5.5 * i, -1.25, -2 - 1), 
                v3(-3.5 + 5.5 * i, -1.25, -2 - 1),
                v3(-2.75 + 5.5 * i, -1.25, -1),
                v3(-2.75 + 5.5 * i, 0.25, -1.64 - 0.6)
            ].sort(() => Math.random() - 0.5);

            this.add(IcoSphere.create({
                position: positions[0],
                scale: v3(1.5, 1.5, 1.5),
                color: [Math.random(), Math.random(), Math.random()],
                smoothShading: false,
                subdivisions: 4,
                parent: container,
            }));
            this.add(Cube.create({
                position: positions[1],
                scale: v3(1.5, 1.5, 1.5),
                colors: [Math.random(), Math.random(), Math.random()],
                parent: container,
            }));
            this.add(Wedge.create({
                rotation: Quaternion.fromEuler(0, Math.PI / 2, 0),
                position: positions[2],
                scale: v3(1.5, 1.5, 1.5),
                colors: [Math.random(), Math.random(), Math.random()],
                parent: container,
            }));
            this.add(Cone.create({
                position: positions[3],
                scale: v3(2, 1.5, 2),
                colors: [Math.random(), Math.random(), Math.random()],
                rotation: Quaternion.fromEuler(0, Math.PI / 2, 0),
                smoothShading: false,
                sides: 3,
                parent: container,
            }));
            this.add(container);
        }


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

        for (let i = 0; i < 3; i++) {
            let vari = ["spotLight", "spotLight2", "spotLight3"][i] as "spotLight" | "spotLight2" | "spotLight3";
            let color = [v3(1, 0, 0), v3(0, 0, 1), v3(0, 1, 0)][i];
            this[vari] = new SpotLight({
                color: color,
                intensity: 0.7,
                cutOff: 0.99,
                outerCutOff: 0.9,
            });
            this.addLight(this[vari]);
        }
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
        this.spotLight.setPosition(
            v3(
                (Math.sin((obj.total + 1000) * 0.0006) % 1) * 4,
                (Math.sin((obj.total + 8000) * 0.002) % 1) * 4 + 3,
                6,
            )
        );

        this.spotLight.lookAt(v3(0, 0, 0));
        this.spotLight2.setPosition(
            v3(
                (Math.sin((obj.total + 300) * 0.0015 + 0.3) % 1) * 4,
                ((Math.sin((obj.total + 4000) * 0.001) % 1) + 0.6) * 4 + 3,
                6,
            )
        );

        this.spotLight2.lookAt(v3(0, 0, 0));
        this.spotLight3.setPosition(
            v3(
                (Math.sin((obj.total + 1000) * 0.001) % 1) * 4,
                (Math.sin((obj.total + 2000) * 0.0015) % 1) * 4 + 3,
                6,
            )
        );

        this.spotLight3.lookAt(v3(0, 0, 0));
        this.camera.setPosition(
            v3(
                (Math.sin(obj.total * 0.0008) % 1) * 5,
                (Math.sin(obj.total * 0.0012) % 1) * 1,
                (Math.sin(obj.total * 0.0005) % 1) * 2 + 9,
            )
        );

    }
}