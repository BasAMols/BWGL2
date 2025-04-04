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
        // Match demo's camera position exactly
        super(new Camera(v3(3, 3, 5), v3(0, 0, 0), 45));

        // Set ambient light to match demo
        this.lightManager.setAmbientLight(new AmbientLight(v3(1, 1, 1), 0.2));

        // Create the plane with demo dimensions
        this.add(Plane.create({
            position: v3(0, 0, 0),  // At origin like demo
            scale: v3(5, 1, 5),     // Match demo's plane size
            material: new Material({
                ambient: v3(0.7, 0.7, 0.7).scale(0.2).vec,
                diffuse: v3(0.7, 0.7, 0.7).vec,
                specular: v3(1, 1, 1).vec,
                shininess: 32.0
            })
        }));

        // Create cube with demo properties
        this.add(this.cube = Cube.create({
            position: v3(0, 1, 0),  // 1 unit above ground like demo
            scale: v3(1, 1, 1),     // Unit size like demo
            colors: [0.7, 0.7, 0.7]  // Match demo's gray color
        }));

        // Single light matching demo's position and properties
        this.addLight(new PointLight(
            v3(5, 5, 5),      // Match demo's light position exactly
            v3(1, 1, 1),      // White light like demo
            1.0,              // Full intensity
            1.0,              // Default attenuation values
            0.0,              // No distance falloff to match demo
            0.0,
            this
        ));
    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        // Remove rotation for now to match demo
    }
}