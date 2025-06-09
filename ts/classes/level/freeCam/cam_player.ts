import { glob } from '../../../game';
import { TickerReturnData } from '../../ticker';
import { Ease } from '../../util/ease';
import { v2, Vector2 } from '../../util/math/vector2';
import { v3, Vector3 } from '../../util/math/vector3';
import { Util } from '../../util/utils';
import { Camera } from '../../webgl2/camera';
import { SceneObject } from '../../webgl2/meshes/sceneObject';
import { Scene } from '../../webgl2/scene';

export class PlayerCamera extends Camera {
    rotation: Vector3 = v3(0, 0, 0);
    smoothedRotation: Vector2 = v2(0, 0);
    zoom: number = 0;

    static closeTransform: [Vector3, number] = [v3(-4, 3, 5), 45];
    static farTransform: [Vector3, number] = [v3(0, 15, 4), 70];

    offset: Vector3 = v3(0, 0, 0);

    constructor(public scene: Scene, public parent: SceneObject) {
        super({ position: v3(0, 2000, 0), target: v3(0, 1, 0), fov: 30, near: 0.1, far: 100 });

        this.calculateZoom(0);

    }   

    calculateZoom(zoom: number = this.zoom) {
        this.zoom = zoom;
        this.fov = Util.lerp(PlayerCamera.closeTransform[1], PlayerCamera.farTransform[1], zoom, {ease: Ease.easeInOutQuad});
        this.offset = Util.lerp(PlayerCamera.closeTransform[0], PlayerCamera.farTransform[0], zoom, {ease: Ease.easeInOutQuad});
    }
    

    tick(obj: TickerReturnData) {
            
        if (glob.device.locked) {
            this.calculateZoom(Util.clamp(this.zoom + glob.input.button('zoom') * 0.0005, 0, 1));
        }

        
        this.setPosition(this.parent.transform.getWorldPosition().add(this.offset));
        this.setTarget(this.parent.transform.getWorldPosition().add(v3(0, 1.5, 0)));
    }
}