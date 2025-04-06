import { v3, Vector3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { SpotLight, DirectionalLight } from './webgl2/lights/light';
import { Quaternion } from './util/math/quaternion';
import { Arrow } from './webgl2/meshes/arrow';
import { IcoSphere } from './webgl2/meshes/icoSphere';
import { Plane } from './webgl2/meshes/plane';
import { Material } from './webgl2/material';
import { v2, Vector2 } from './util/math/vector2';
import { Cube } from './webgl2/meshes/cube';
import { Wedge } from './webgl2/meshes/wedge';
import { Cone } from './webgl2/meshes/cone';
import { ContainerObject } from './webgl2/meshes/containerObject';

export class TestLevel extends Scene {
    private mesh: SceneObject;
    protected clearColor: [number, number, number, number] = [0.01, 0.01, 0.01, 1.0];  // Near-black background for better contrast
    arrow: Arrow;
    spotLight: SpotLight;
    spotLight2: SpotLight;
    spotLight3: SpotLight;
    static: SceneObject;
    mesh2: SceneObject;
    dynamic: SceneObject;
    frontWall: SceneObject;
    spotLight4: SpotLight;
    floorPlane: SceneObject;
    keyLight: DirectionalLight;

    constructor() {
        super(new Camera({ position: v3(0, 1, 6), target: v3(0, 0, 0), fov: 50 }), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0.0 // Increased to illuminate shadowed areas better
        });

        const rotation = new Quaternion();
        rotation.setAxisAngle(v3(1, 0, 0), 0);

        // Add a main directional light (key light) for better overall illumination
        this.keyLight = new DirectionalLight({
            direction: v3(-0.5, -3, -   1 ).normalize(),
            color: v3(1, 0.98, 0.9),   // Slightly warm white
            intensity: 0.15,         // Reduced from 1.2,
            enabled: true
        });
        this.addLight(this.keyLight);

        for (let i = 0; i < 3; i++) {
            let vari = ["spotLight", "spotLight2", "spotLight3"][i] as "spotLight" | "spotLight2" | "spotLight3";
            let color = [v3(1, 0, 0), v3(0, 1, 0), v3(0, 0, 1)][i];
            this[vari] = new SpotLight({
                color: color,
                intensity: 30,
                cutOff: 0.94,
                outerCutOff: 0.91,
                meshContainer: this,
                enabled: true
            });
            this.addLight(this[vari]);
        }

        this.add(this.floorPlane = Plane.create({
            position: v3(0, -2, 0),
            scale: v2(10, 10),
            material: Material.library('rough', v3(0.7, 0.7, 0.73))
        }));

        this.add(Plane.create({
            position: v3(0, 0.5, -4),
            scale: v2(5, 10),
            rotation: Quaternion.fromEuler(-Math.PI / 2, 0, Math.PI / 2),
            material: Material.library('rough', v3(0.7, 0.7, 0.73))
        }));

        this.add(this.frontWall = Plane.create({
            position: v3(0, 0.5, 4),
            flipNormal: true,
            scale: v2(5, 10),
            rotation: Quaternion.fromEuler(-Math.PI / 2, 0, Math.PI / 2),
        }));

        // Create main sphere with a more reflective material to better show colored lights
        this.add(this.mesh = IcoSphere.create({
            position: v3(0, 0, -2.5),
            scale: v3(2.5, 2.5, 2.5),
            smoothShading: false,
            subdivisions: 2,
            material: Material.library('metal', v3(0.95, 0.6, 0.95))
        }));

        // Create a variety of objects with different PBR materials
        for (let i = 0; i < 2; i++) {
            const container = new ContainerObject({
                position: v3(4.5 * i, 0, -4 * i),
                rotation: Quaternion.fromEuler(0, (Math.PI) * i, 0),
            });
            const positions = [
                v3(-2 + 5.5 * i, -1.25, -2 - 1),
                v3(-3.5 + 5.5 * i, -1.25, -2 - 1),
                v3(-2.75 + 5.5 * i, -1.25, -1),
                v3(-2.75 + 5.5 * i, 0.25, -1.64 - 0.6)
            ].sort(() => Math.random() - 0.5);

            // Create a sphere with smooth, ceramic-like material
            this.add(IcoSphere.create({
                position: positions[0],
                scale: v3(1.5, 1.5, 1.5),
                smoothShading: true,
                subdivisions: 2,
                parent: container,
                material: Material.library('metal', v3(0.2, 0.7, 0.9))
            }));

            // Create a cube with copper-like metal material
            this.add(Cube.create({
                position: positions[1],
                scale: v3(1.5, 1.5, 1.5),
                parent: container,
                material: Material.library('plastic', v3(0.85, 0.45, 0.35))
            }));

            // Create a wedge with a rubber-like material
            this.add(Wedge.create({
                rotation: Quaternion.fromEuler(0, Math.PI / 2, 0),
                position: positions[2],
                scale: v3(1.5, 1.5, 1.5),
                parent: container,
                material: Material.library('plastic', v3(0.15, 0.8, 0.15))
            }));

            // Create a cone with glowing, emissive properties
            this.add(Cone.create({
                position: positions[3],
                scale: v3(2, 1.5, 2),
                rotation: Quaternion.fromEuler(0, Math.PI / 2, 0),
                smoothShading: false,
                sides: 12,
                parent: container,
                material: Material.library('metal', v3(0.15, 0.8, 0.15))
            }));

            this.add(container);
        }



        this.camera.setPosition(v3(-1, 3, 6));
        this.camera.setTarget(v3(0, 0, 0));

        this.click(v2(0.5, 0.3));
    }

    click(vector2: Vector2) {
        super.click(vector2);
        const pos2 = Vector3.screenToWorldPlane(vector2, this.camera, v3(0, 0, 1), 4);

        if (pos2) {
            // Keep the light at a constant height but track the position
            this.spotLight3.setPosition(pos2);
            this.spotLight3.lookAt(v3(0, 0, 0));
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

        this.spotLight.setPosition(
            (Math.sin((obj.total + 1000) * 0.0006) % 1) * 4,
            (Math.sin((obj.total + 8000) * 0.002) % 1) * 4 + 3,
            6
        );
        this.spotLight.lookAt(v3(0, 0, 0));

        this.spotLight2.setPosition(
            (Math.sin((obj.total + 300) * 0.0015 + 0.3) % 1) * 4,
            ((Math.sin((obj.total + 4000) * 0.001) % 1) + 0.6) * 4 + 3,
            6
        );
        this.spotLight2.lookAt(v3(0, 0, 0));

        // this.spotLight3.setPosition(
        //     (Math.sin((obj.total + 1000) * 0.001) % 1) * 4,
        //     ((Math.sin((obj.total + 2000) * 0.0015) % 1) + 0.6) * 4 + 3,
        //     6
        // );
        // this.spotLight3.lookAt(v3(0, 0, 0));

        this.camera.setPosition(
            v3(
                (Math.sin(obj.total * 0.0008) % 1) * 5,
                (Math.sin(obj.total * 0.0012) % 1) * 1,
                (Math.sin(obj.total * 0.0005) % 1) * 2 + 9,
            )
        );
    }
}