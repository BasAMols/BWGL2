import { glob } from '../../../game';
import { Controller } from "../../actor/controller";
import { TickerReturnData } from '../../ticker';
import { v3, Vector3 } from "../../util/math/vector3";
import { PlayerActor } from './playerActor';
import { Quaternion } from '../../util/math/quaternion';
export class PlayerController extends Controller {
    private velocity: Vector3 = v3(0);
    public actor: PlayerActor;
    private speed: number = 0.02;

    build() {
        super.build();
        // this.actor.scene.ui.add(UI.slider({ value: this.speed, step: 0.1,  label: 'Speed', min: 0.2, max: 10, onChange: (value) => {
        //     this.speed = Math.max(value, 0.2)
        // }, width: 600 }));
    }

    tick(obj: TickerReturnData) {

        this.velocity = v3(
            glob.input.axis('movement')?.x,
            0,
            -glob.input.axis('movement')?.y,
        ).scale(this.speed).rotateXZ(-this.actor.camera.yaw - Math.PI);

        if (this.velocity.magnitude() > 0) {
            this.actor.transform.setRotation(Quaternion.fromEuler(0, this.velocity.xz.angle(), 0));
        }

        this.actor.transform.setPosition(this.actor.transform.getLocalPosition().add(this.velocity.scale(obj.intervalS10 / 6)));

    }
}
