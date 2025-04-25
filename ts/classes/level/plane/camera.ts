import { TickerReturnData } from '../../ticker';
import { v3 } from '../../util/math/vector3';
import { Camera } from '../../webgl2/camera';
import { SceneObject } from '../../webgl2/meshes/sceneObject';
import { Scene } from '../../webgl2/scene';

export class PlaneCamera extends Camera {
    constructor(public scene: Scene, public parent: SceneObject) {
        super({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 });
    }   

    tick(obj: TickerReturnData) {
          // Slower, gentler camera movement
          const radius = 4000 + Math.sin(obj.total * 0.0005) * 2000;
          const height = 2000;
          const v = v3(
              radius,
              height,
              0
          ).rotateXY(obj.total * 0.0001 % Math.PI*2);
          this.setPosition(v.add(v3(0, Math.sin(obj.total * 0.0005) * 1000, 0)));
          this.setTarget(this.parent.transform.getWorldPosition());  // Keep looking at the reflective plane
    }
}