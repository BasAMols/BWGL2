import { glob } from '../../../game';
import { TickerReturnData } from '../../ticker';
import { v2, Vector2 } from '../../util/math/vector2';
import { v3, Vector3 } from '../../util/math/vector3';
import { Util } from '../../util/utils';
import { Camera } from '../../webgl2/camera';
import { SceneObject } from '../../webgl2/meshes/sceneObject';
import { Scene } from '../../webgl2/scene';

export class PlayerCamera extends Camera {
    offset: Vector3 = v3(5, 1, 0);
    rotation: Vector3 = v3(0, 0, 0);
    smoothedRotation: Vector2 = v2(0, 0);
    constructor(public scene: Scene, public parent: SceneObject) {
        super({ position: v3(0, 0, 0), fov: 90, near: 0.1, far: 500 });
    }   

    tick(obj: TickerReturnData) {
            
        if (glob.device.locked) {
            const r = glob.input.axis('camera')?.scale(0.5).scale(obj.intervalS10 / 1000);
            this.smoothedRotation = this.smoothedRotation.add(r);
            this.fov = Util.clamp(this.fov + glob.input.button('zoom') * 0.05, 25, 120);
        }

        if (obj.frame % 1 === 0) {
            this.rotate(new Vector3( -this.smoothedRotation.y, -this.smoothedRotation.x, 0));
            this.smoothedRotation = v2(0, 0);
        }

        this.setPosition(this.parent.transform.getWorldPosition());
    }
}