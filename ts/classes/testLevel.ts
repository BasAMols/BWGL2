import { v3 } from './util/math/vector3';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { DirectionalLight } from './webgl2/lights/light';
import { Quaternion } from './util/math/quaternion';
import { v2 } from './util/math/vector2';
import { Plane } from './webgl2/meshes/plane';

export class TestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.01, 0.01, 0.01, 1.0];  // Near-black background for better contrast
    sun: DirectionalLight;
    baseRotation: number;

    constructor() {
        super(new Camera({ position: v3(0, 1, 6), target: v3(0, 0, 0), fov: 30 }), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0
        });

        const rotation = new Quaternion();
        rotation.setAxisAngle(v3(1, 0, 0), 0);

        this.add(Plane.create({ 
            position: v3(0, 0, 0),
            material: { baseColor: v3(0.3, 0.3, 1), roughness: 0.8, metallic: 0.6, ambientOcclusion: 0.1, emissive: v3(0, 0, 0) },
            scale: v2(50000, 50000),
        }));
        this.addLight(this.sun = new DirectionalLight({ //sun
            direction: v3(0.5, -0.5, 0.5).normalize(),
            color: v3(1, 0.95, 0.8), // Warm sunlight color
            intensity: 1.2, // Slightly increased intensity for sun
            enabled: true,
        }));
        this.addLight(new DirectionalLight({ //back
            direction: v3(-0.9, 0, 0.7).normalize(),
            color: v3(1, 1, 1),
            intensity:1,
            enabled: true,
        }));
        this.addLight(new DirectionalLight({ //back
            direction: v3(0.9, -0, 0.7).normalize(),
            color: v3(1, 1, 1),
            intensity: 1,
            enabled: true,
        }));

        this.build();

        this.camera.setTarget(v3(0, -600, 0));

        this.baseRotation = Math.PI*2 * Math.random();

    }

    async build() {
        // this.add(await FBXLoader.loadFromUrl('/fbx/island3.fbx', {
        //     position: v3(0, 0, 0),
        //     rotation: Quaternion.fromEuler(0, 0, 0),
        // }));
        // this.add(await FBXLoader.loadFromUrl('/fbx/island2.fbx', {
        //     position: v3(0, 0, 0),
        //     rotation: Quaternion.fromEuler(0, 0, 0),
        // }));
        // this.add((await FBXLoader.loadFromUrl('/fbx/island1.fbx', {
        //     position: v3(0, 0, 0),
        //     rotation: Quaternion.fromEuler(0, 0, 0),
        // })));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);

        const v = v3(7000, 3000, 0).rotateXY(this.baseRotation-obj.total * 0.00005 % (Math.PI * 2));
        this.camera.setPosition(v.add(v3(0, 0, 0)));

        const v2 = v3(1, -0.6, 0).normalize().rotateXY(-obj.total * 0.0004 % (Math.PI * 2));
        this.sun.setDirection(v2.add(v3(0, 0, 0)));

    }
}