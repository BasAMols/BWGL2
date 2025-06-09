import { glob } from '../../../../game';
import { TickerReturnData } from '../../../ticker';
import { Util } from '../../../util/utils';
import { JumpController } from '../../../controllers/c_jump';
import { PlayerActor } from './a_player';
import { v3 } from '../../../util/math/vector3';

export class PlayerController extends JumpController {
    public actor: PlayerActor;
    public speed: number = 1;
    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.speed = Util.clamp(this.speed + glob.input.button('speed') * 0.01, 0.1, 0.5);
        this.speedFactor = (glob.device.keyboard.shift() ? 1 : this.speed);

        this.actor.transform.setPosition(this.actor.transform.getWorldPosition().clamp(v3(-0.9, 0, -1.15), v3(0.9, 100, 1.9)));
    }

    protected override getJumpInput(): boolean {
        return glob.input.button('jump') > 0.5;
    }
}
