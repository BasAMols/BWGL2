import { Actor } from "../../actor/actor";
import { TickerReturnData } from '../../ticker';
import { v2 } from '../../util/math/vector2';
import { v3 } from "../../util/math/vector3";
import { PlaneMesh } from '../../webgl2/meshes/plane';
import { SceneObject } from '../../webgl2/meshes/sceneObject';
export class Ocean extends Actor {
    waterPlane: SceneObject;
    constructor() {
        super();

        // Create a reflective plane
        this.add(this.waterPlane = PlaneMesh.create({
            position: v3(0, 10, 0),  // Lower position for better sky reflections - world position affects reflection quality
            material: {
                baseColor: v3(0.4, 0.8, 0.9),  // Deep blue-green tint for ocean
                roughness: 0.4,  // Smoother surface for calm water, but not perfectly reflective
                metallic: 0.8,    // Good reflection without being too mirror-like
                ambientOcclusion: 0.8,
                emissive: v3(0.01, 0.03, 0.05)  // Subtle glow for depth
            },
            scale: v2(100000, 100000),  // Adjust scale to see more of the reflection
        }));
    }
    tick(obj: TickerReturnData): void {
        super.tick(obj);
        this.waterPlane.transform.setPosition(v3(0, Math.sin(obj.total * 0.001) * 15 + 10, 0));
    }
}