import { glob } from '../../../game';
import { TickerReturnData } from '../../ticker';
import { Util } from '../../util/utils';
import { JumpController } from './jumpController';
import { PlayerActor } from './playerActor';

export class PlayerController extends JumpController {
    public actor: PlayerActor;
    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.speedFactor = Util.clamp(this.speedFactor + glob.input.button('speed') * 0.01, 0.1, 1.0);

    }

    protected getJumpInput(): boolean {
        return glob.input.button('jump') > 0.5;
    }
}
