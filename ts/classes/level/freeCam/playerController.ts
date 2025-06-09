import { glob } from '../../../game';
import { TickerReturnData } from '../../ticker';
import { PlayerActor } from './playerActor';
import { MovementController } from './movementController';
import { Util } from '../../util/utils';
export class JumpController extends MovementController {
    public actor: PlayerActor;
    public onground: boolean = true;
    public jumpDuration: number = 0;

    static GRAVITY = 9.81 / 2500; // m/s^2
    static JUMP_VELOCITY = 5 / 500; // m/s

    tick(obj: TickerReturnData) {
        super.tick(obj);

        
        //  Assume 0.2 for normal walking speed in the this.speed value
        this.speedFactor = Util.clamp(this.speedFactor + glob.input.button('speed') * 0.01, 0.1, 1.0);

        
        if (glob.input.button('jump')) {
            if (this.onground){
                this.jumpDuration = 0;
                this.movement.currentVelocity.y = JumpController.JUMP_VELOCITY
            } else {
                if (this.jumpDuration < 250) {
                    this.jumpDuration+=obj.intervalS10;
                    this.movement.currentVelocity.y += JumpController.JUMP_VELOCITY*(1-(this.jumpDuration/250));
                }
            }
            
        }
        if (!this.onground) {
            this.movement.currentVelocity.y -= JumpController.GRAVITY * obj.intervalS10 / 6;
        }

        if (this.actor.transform.getLocalPosition().y < 0) {
            this.actor.transform.setY(0);
            this.onground = true;
            this.jumpDuration = 0;
        } else {
            this.onground = false;
        }
    }
}
