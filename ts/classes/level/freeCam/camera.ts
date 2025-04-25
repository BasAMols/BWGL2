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
        super({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 });
    }   

    tick(obj: TickerReturnData) {
        //   // Slower, gentler camera movement
        //   const radius = 4000 + Math.sin(obj.total * 0.0005) * 2000;
        //   const height = 2000;
        //   const v = v3(
        //       radius,
        //       height,
        //       0
        //   ).rotateXY(obj.total * 0.0001 % Math.PI*2);
        //   this.setPosition(v.add(v3(0, Math.sin(obj.total * 0.0005) * 1000, 0)));
        this.angle +=  glob.input.axis('camera')?.x * 0.01;
        this.offset.y += glob.input.axis('camera')?.y * 2;
        this.offset.x += glob.input.button('cameraHeight') * 2;


        this.setPosition(this.parent.transform.getWorldPosition().add(this.offset.rotateXZ(this.angle)));
        this.setTarget(this.parent.transform.getWorldPosition());
    }
}