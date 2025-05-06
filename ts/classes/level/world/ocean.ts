import { Actor } from "../../actor/actor";
import { TickerReturnData } from '../../ticker';
import { v2 } from '../../util/math/vector2';
import { v3 } from "../../util/math/vector3";
import { PlaneMesh } from '../../webgl2/meshes/plane';
import { SceneObject } from '../../webgl2/meshes/sceneObject';
export class Ocean extends Actor {
    waterPlane: SceneObject;
    dirtPlane: SceneObject;
    constructor() {
        super();

        // // Create a reflective plane
        // this.add(this.waterPlane = PlaneMesh.create({
        //     position: v3(0, 0, 0),  // Lower position for better sky reflections - world position affects reflection quality
        //     material: {
        //         baseColor: v3(0.4, 0.8, 0.9),  // Deep blue-green tint for ocean
        //         roughness: 0.5,  // Smoother surface for calm water, but not perfectly reflective
        //         metallic: 0.8,    // Good reflection without being too mirror-like
        //         ambientOcclusion: 0.99,
        //         emissive: v3(0.01, 0.03, 0.05)  // Subtle glow for depth
        //     },
        //     scale: v2(1000, 1000),  // Adjust scale to see more of the reflection
        // }));

        // Create a dirt ground plane
        this.add(this.dirtPlane = PlaneMesh.create({
            position: v3(0, -0.1, 0),  // Slightly below water level
            material: {
                baseColor: v3(0.3, 0.2, 0.1),  // Brown dirt color
                roughness: 0.95,  // Very rough for dirt texture
                metallic: 0.0,   // Non-metallic material
                ambientOcclusion: 0.7, // Some ambient occlusion for depth
                emissive: v3(0, 0, 0)  // No emission for dirt
            },
            scale: v2(1000, 1000),  // Large scale for ground plane
        }));
    }
    tick(obj: TickerReturnData): void {
        super.tick(obj);
        // this.waterPlane.transform.setPosition(v3(0, Math.sin(obj.total * 0.001) * 15 + 10, 0));
    }
}