import { v3 } from './util/math/vector3';
import { SceneObject } from './webgl2/meshes/sceneObject';
import { TickerReturnData } from './ticker';
import { Scene } from './webgl2/scene';
import { Camera } from './webgl2/camera';
import { Plane } from './webgl2/meshes/plane';
import { PointLight, AmbientLight } from './webgl2/lights/light';
import { Cube } from './webgl2/meshes/cube';
import { Material } from './webgl2/material';

export class TestLevel extends Scene {
    private cube: SceneObject;
    protected clearColor: [number, number, number, number] = [0, 0, 0, 1];  // Match demo's black background

    constructor() {
        const camera = new Camera(v3(3, 3, 5), v3(0, 0, 0));
        super(camera);

        // Set clear color to black
        this.clearColor = [0, 0, 0, 1];

        // Set ambient light
        this.lightManager.setAmbientLight(new AmbientLight(v3(1, 1, 1), 0.2));

        // Create a plane at the origin
        const plane = Plane.create({
            position: v3(0, 0, 0),
            scale: v3(5, 1, 5),
            material: new Material({
                ambient: v3(0.7, 0.7, 0.7).scale(0.2).vec,
                diffuse: v3(0.7, 0.7, 0.7).vec,
                specular: v3(0.3, 0.3, 0.3).vec,
                shininess: 32.0
            })
        });
        this.add(plane);

        // Create a cube above the plane
        const cube = Cube.create({
            position: v3(0, 1, 0),
            scale: v3(1, 1, 1),
            colors: [0.7, 0.7, 0.7]  // Gray color for all faces
        });
        this.add(cube);

        // Add a point light
        const light = new PointLight(v3(5, 5, 5), v3(1, 1, 1), 1.0, 1.0, 0.0, 0.0, this);
        this.lightManager.addLight(light);

        // Enable shadow map visualization
        this.toggleShadowMapDebug(true);
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        // Remove rotation for now to match demo
    }
}