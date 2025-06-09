import { glob } from '../../../game';
import { TickerReturnData } from '../../ticker';
import { Util } from '../../util/utils';
import { JumpController } from './c_jump';
import { PlayerActor } from './a_player';

export class PlayerController extends JumpController {
    public actor: PlayerActor;
    public speed: number = 1;
    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.speed = Util.clamp(this.speed + glob.input.button('speed') * 0.01, 0.1, 0.5);
        this.speedFactor = (glob.device.keyboard.shift() ? 1 : this.speed);
    }

    protected override getJumpInput(): boolean {
        return glob.input.button('jump') > 0.5;
    }
}
