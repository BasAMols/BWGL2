import { v3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { SpotLight, DirectionalLight } from './webgl2/lights/light';
import { Quaternion } from './util/math/quaternion';
import { Arrow } from './webgl2/meshes/arrow';
import { Vector2 } from './util/math/vector2';
import { FBXLoader } from './webgl2/meshes/fbxLoader';

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
            ambientLightIntensity: 10
        });

        const rotation = new Quaternion();
        rotation.setAxisAngle(v3(1, 0, 0), 0);

        // this.addLight(new DirectionalLight({ //key
        //     direction: v3(0.5, -3, -1).normalize(),
        //     color: v3(1, 1, 1),
        //     intensity: 13,
        //     enabled: true,
        // }));
        // this.addLight(new DirectionalLight({ //fill
        //     direction: v3(-0.5, -3, -1).normalize(),
        //     color: v3(1, 1, 1),
        //     intensity: 5,
        //     enabled: true,
        // }));
        // this.addLight(new DirectionalLight({ //back
        //     direction: v3(-0.5, -3, 1).normalize(),
        //     color: v3(1, 1, 1),
        //     intensity: 2,
        //     enabled: true,
        // }));
        // this.addLight(new DirectionalLight({ //back
        //     direction: v3(0.5, 3, 1).normalize(),
        //     color: v3(1, 1, 1),
        //     intensity: 2,
        //     enabled: true,
        // }));

        this.build();

        this.camera.setPosition((v3(-1, 6, 1)));
        this.camera.setTarget(v3(-1, 0, 0));

    }

    async build() {
            // this.add(await FBXLoader.loadFromUrl('/fbx/cube.fbx', {
            //     smoothShading: false,
            //     position: v3(0, -1, 0),
            // }));

            this.add(await FBXLoader.loadFromUrl('/fbx/cube.fbx', {
                position: v3(0, 2, 0),
            }));
    }

    click(vector2: Vector2) {
        // super.click(vector2);
        // const pos2 = Vector3.screenToWorldPlane(vector2, this.camera, v3(0, 0, 1), 4);

        // if (pos2) {
        //     this.spotLight3.setPosition(pos2);
        //     this.spotLight3.lookAt(v3(0, 0, 0));
        // }

    }

    tick(obj: TickerReturnData) {
        super.tick(obj);


        const v = v3(6, 5, 0).rotateXY(obj.total * 0.001 % (Math.PI * 2));
        this.camera.setPosition(v.add(v3(-0.7, 0, 0)));
        this.camera.setTarget(v3(-0.7, 1, 0));

    }
}