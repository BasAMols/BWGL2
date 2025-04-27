import { v3 } from "../../util/math/vector3";
import { DirectionalLight } from '../../webgl2/lights/light';
import { ContainerObject } from '../../webgl2/meshes/containerObject';
import { Scene } from '../../webgl2/scene';
export class Sky extends ContainerObject{
    sun: DirectionalLight;
    constructor(level: Scene) {
        super();
        level.setEnvironmentMap('textures/envmap/sky');
        level.addLight(this.sun = new DirectionalLight({
            direction: v3(0.2, -0.5, -1.3).rotateXZ(-0.70).normalize(),  // Match sun position in skybox
            color: v3(1, 0.98, 0.95),  // Slightly warm sunlight
            intensity: 2,  // Increased intensity
            enabled: true,
        }));
        level.addLight(new DirectionalLight({
            direction: v3(-0.2, -0.5, 1.3).rotateXZ(-0.70).normalize(),  // Match sun position in skybox
            color: v3(0.95, 0.98, 1),  // Slightly blue skylight
            intensity: 0.2,  // Increased intensity
            enabled: true,
        }));
    }
}