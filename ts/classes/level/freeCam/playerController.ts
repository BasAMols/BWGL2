import { glob } from '../../../game';
import { Controller } from "../../actor/controller";
import { TickerReturnData } from '../../ticker';
import { v3, Vector3 } from "../../util/math/vector3";
import { PlayerActor } from './playerActor';
import { Quaternion } from '../../util/math/quaternion';
import { Util } from '../../util/utils';
export class PlayerController extends Controller {
    private velocity: Vector3 = v3(0);
    public actor: PlayerActor;
    public speed: number = 0.02;
    public onground: boolean = true;
    public jumpDuration: number = 0;

    tick(obj: TickerReturnData) {

        this.velocity = v3(
            glob.input.axis('movement')?.x* this.speed,
            this.velocity.y,
            -glob.input.axis('movement')?.y* this.speed,
        ).rotateXZ(-this.actor.camera.yaw - Math.PI);


        const GRAVITY = 9.81 / 2500; // m/s^2
        const JUMP_VELOCITY = 5 / 500; // m/s

        this.speed = Util.clamp(this.speed + glob.input.button('speed') * 0.001, 0.01, 0.1);
        
        if (glob.input.button('jump')) {
            if (this.onground){
                this.jumpDuration = 0;
                this.velocity.y = JUMP_VELOCITY
            } else {
                if (this.jumpDuration < 250) {
                    this.jumpDuration+=obj.intervalS10;
                    this.velocity.y += JUMP_VELOCITY*(1-(this.jumpDuration/250));
                }
            }
            
        }
        if (!this.onground) {
            this.velocity.y -= GRAVITY * obj.intervalS10 / 6;
        }

        if (this.velocity.magnitude() > 0) {
            this.actor.transform.setRotation(Quaternion.fromEuler(0, this.velocity.xz.angle(), 0));
        }

        this.actor.transform.setPosition(this.actor.transform.getLocalPosition().add(this.velocity.scale(obj.intervalS10 / 6)));

        if (this.actor.transform.getLocalPosition().y < 1.3) {
            this.actor.transform.setY(1.3);
            this.onground = true;
            this.jumpDuration = 0;
        } else {
            this.onground = false;
        }
    }
}
