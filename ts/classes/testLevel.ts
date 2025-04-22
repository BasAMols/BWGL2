import { v3 } from './util/math/vector3';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { DirectionalLight } from './webgl2/lights/light';
import { v2 } from './util/math/vector2';
import { Plane } from './webgl2/meshes/plane';
import { EnvironmentMapLoader } from './webgl2/environmentMap';
import { FBXLoader } from './webgl2/meshes/fbxLoader';
import { Quaternion } from './util/math/quaternion';

export class TestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.2, 0.3, 0.5, 1.0];  // Match sky color
    sun: DirectionalLight;
    baseRotation: number;
    waterPlane: import("c:/Users/basm/Documents/Development/BWGL2/ts/classes/webgl2/meshes/sceneObject").SceneObject;

    constructor() {
        // Position camera to see reflections better
        super(new Camera({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 }), {
            ambientLightColor: v3(1, 1, 1),
            ambientLightIntensity: 0.3  // Very subtle ambient lighting
        });

        // Create a reflective plane
        this.add(this.waterPlane = Plane.create({
            position: v3(0, 10, 0),  // Lower position for better sky reflections - world position affects reflection quality
            material: {
                baseColor: v3(0.4, 0.5, 0.7),  // Deep blue-green tint for ocean
                roughness: 0.4,  // Smoother surface for calm water, but not perfectly reflective
                metallic: 0.9,    // Good reflection without being too mirror-like
                ambientOcclusion: 1,
                emissive: v3(0.01, 0.03, 0.05)  // Subtle glow for depth
            },
            scale: v2(100000, 100000),  // Adjust scale to see more of the reflection
        }));

        // Adjust lighting to match skybox
        this.addLight(this.sun = new DirectionalLight({
            direction: v3(0.2, -1, -1.3).normalize(),  // Match sun position in skybox
            color: v3(1, 0.98, 0.95),  // Slightly warm sunlight
            intensity: 3,  // Increased intensity
            enabled: true,
        }));

        this.build();

        this.baseRotation = 0;
    }

    async build() {
        // Load environment map using the EnvironmentMapLoader
        this.setEnvironmentMap(await EnvironmentMapLoader.loadFromDirectory('textures/envmap/sky'));

        this.add(await FBXLoader.loadFromUrl('fbx/island1.fbx', {
            position: v3(0, 0, 0),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));
        this.add(await FBXLoader.loadFromUrl('fbx/island2.fbx', {
            position: v3(0, 0, 0),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));
        this.add(await FBXLoader.loadFromUrl('fbx/island3.fbx', {
            position: v3(0, 0, 0),
            rotation: Quaternion.fromEuler(0, 0, 0),
        }));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);

        // Slower, gentler camera movement
        const radius = 6000;
        const height = 1300;
        const v = v3(
            radius,
            height,
            0
        ).rotateXY(this.baseRotation - obj.total * 0.0001);
        this.camera.setPosition(v.add(v3(0, 0, 0)));
        this.camera.setTarget(v3(0, -1000, 0));  // Keep looking at the reflective plane

        // Slowly rotate the sun to match skybox movement
        const sunRadius = 3;
        const v2 = v3(
            sunRadius,
            -1,
            0
        ).normalize().rotateXY(this.baseRotation - obj.total * -0.0001);
        this.sun.setDirection(v2);

        this.waterPlane.transform.setPosition(v3(0, Math.sin(obj.total * 0.001) * 15 + 10, 0));
    }
}