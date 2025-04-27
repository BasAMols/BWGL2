import { glob } from '../../../game';
import { Controller } from "../../actor/controller";
import { TickerReturnData } from '../../ticker';
import { v3, Vector3 } from "../../util/math/vector3";
import { Plane } from './freeCam';
import { Quaternion } from '../../util/math/quaternion';
import { UI } from '../../elements/UI';
export class PlaneController extends Controller {
    private velocity: Vector3 = v3(0);
    public actor: Plane;
    private speed: number = 4;

    build() {
        super.build();
        this.actor.scene.ui.add(UI.slider({ value: this.speed, step: 0.1,  label: 'Speed', min: 0.2, max: 10, onChange: (value) => {
            this.speed = Math.max(value, 0.2)
        }, width: 600 }));
    }

    tick(obj: TickerReturnData) {
        this.velocity = v3(
            glob.input.axis('movement')?.x,
            glob.input.button('height'),
            -glob.input.axis('movement')?.y,
        ).scale(this.speed).rotateXZ(this.actor.camera.angle - Math.PI / 2);


        if (this.velocity.magnitude() > 0) {
            this.actor.transform.setRotation(Quaternion.fromEuler(0, this.velocity.xz.angle(), 0));
        }

        this.actor.transform.setPosition(this.actor.transform.getLocalPosition().add(this.velocity.scale(obj.intervalS10 / 6)));

    }
}
