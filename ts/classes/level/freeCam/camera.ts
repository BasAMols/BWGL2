import { glob } from '../../../game';
import { TickerReturnData } from '../../ticker';
import { v3, Vector3 } from '../../util/math/vector3';
import { Camera } from '../../webgl2/camera';
import { SceneObject } from '../../webgl2/meshes/sceneObject';
import { Scene } from '../../webgl2/scene';

export class PlaneCamera extends Camera {
    offset: Vector3 = v3(1000, 600, 0);
    angle: number = 0;
    constructor(public scene: Scene, public parent: SceneObject) {
        super({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40, near: 10, far: 10000 });
    }   

    tick(obj: TickerReturnData) {
        this.angle +=  glob.input.axis('camera')?.x * 0.01;
        this.offset.y += glob.input.axis('camera')?.y * 2;
        this.offset.x += glob.input.button('cameraHeight') * 2;

        this.setPosition(this.parent.transform.getWorldPosition().add(this.offset.rotateXZ(this.angle)));
        this.setTarget(this.parent.transform.getWorldPosition());
    }
}