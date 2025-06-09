import { glob } from '../../../../game';
import { TickerReturnData } from '../../../ticker';
import { Ease } from '../../../util/ease';
import { v2, Vector2 } from '../../../util/math/vector2';
import { v3, Vector3 } from '../../../util/math/vector3';
import { Util } from '../../../util/utils';
import { Camera } from '../../../webgl2/camera';
import { Scene } from '../../../webgl2/scene';
import { PlayerActor } from './a_player';
import { PlayerController } from './c_player';

export class PlayerCamera extends Camera {
    rotation: Vector3 = v3(0, 0, 0);
    smoothedRotation: Vector2 = v2(0, 0);
    zoom: number = 0;

    static closeTransform: [Vector3, number] = [v3(3, 4, 1.5), 60];
    static farTransform: [Vector3, number] = [v3(4, 15, 0), 50];

    offset: Vector3 = v3(0, 0, 0);

    targetZoom: number = 0;

    constructor(public scene: Scene, public parent: PlayerActor) {
        super({ position: v3(0, 2000, 0), target: v3(0, 1, 0), fov: 30, near: 3, far: 100 });
        this.calculateZoom(0);
    }   

    calculateZoom(zoom: number = this.zoom) {
        this.zoom = zoom;
        this.fov = Util.lerp(PlayerCamera.closeTransform[1], PlayerCamera.farTransform[1], zoom, {ease: Ease.easeInOutQuad});
        this.offset = Util.lerp(PlayerCamera.closeTransform[0], PlayerCamera.farTransform[0], zoom, {ease: Ease.easeInOutQuad});
        (this.parent.controllers[0] as PlayerController).movementReference = this.zoom < 0.5 ? 'camera' : 'world';
        (this.parent.controllers[0] as PlayerController).inputMapping.forward = this.zoom < 0.5 ? '-z' : '-x';
        (this.parent.controllers[0] as PlayerController).inputMapping.right = this.zoom < 0.5 ? '+x' : '-z';

    }
    

    tick(obj: TickerReturnData) {

            if (glob.input.button('zoom') > 0.5) {
                this.targetZoom = 1;
            }
            if (glob.input.button('zoom') < -0.5) {
                this.targetZoom = 0;
            }

        if (this.targetZoom !== this.zoom) {
            this.zoom = Util.clamp(this.targetZoom < this.zoom ? this.zoom - 0.01 : this.zoom + 0.01, 0, 1);
        }
            
        this.calculateZoom(Util.clamp(this.zoom, 0, 1));
        
        this.setPosition(this.parent.transform.getWorldPosition().add(this.offset));
        this.setTarget(this.parent.transform.getWorldPosition().add(v3(0, 1.5, 0)));
    }
}