import { v3 } from '../util/math/vector3';
import { TickerReturnData } from '../ticker';
import { Scene } from '../webgl2/scene';
import { Camera } from '../webgl2/camera';
import { PlayerActor } from './freeCam/playerActor';
import { Ocean } from './world/ocean';
import { Island } from './world/island';
import { Sky } from './world/sky';
import { UI, UIElement } from '../elements/UI';
import { v2 } from '../util/math/vector2';
import { PlayerController } from './freeCam/playerController';

export class TestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.2, 0.3, 0.5, 1.0];  // Match sky color
    public ui: UI = new UI();
    positionData: UIElement<string>;
    player: PlayerActor;
    fpsData: UIElement<string>;
    rotationData: UIElement<string>;
    actorData: UIElement<string>;


    constructor() {
        // Position camera to see reflections better
        super(new Camera({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 }), {
            ambientLightColor: v3(0.4, 0.8, 0.9),
            ambientLightIntensity: 0.7,  // Very subtle ambient lighting,
        });

        this.add(new Ocean());
        this.add(new Island());
        this.add(new Sky(this));
        this.add(this.player = new PlayerActor());

        this.ui.add((this.positionData = UI.data({ label: 'P', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.rotationData = UI.data({ label: 'R', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.fpsData = UI.data({  label: 'FPS', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.actorData = UI.data({  label: 'Actor', size: v2(400, 100) })), 'bottom');
        this.ui.expanded = false;

    }


    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.positionData.change(
            this.player.transform.getWorldPosition().array.map(v => v.toFixed(2)).join('m, ') + 'm'
        );
        this.rotationData.change(
            this.player.camera.getAngle().array.map(v => v.toFixed(2)).join(', ')
        );
        this.fpsData.change(obj.frameRate.toFixed(2) + '/' + obj.maxRate.toFixed(2));
        this.actorData.change('fov: ' + this.player.camera.fov.toFixed(0) + ', speed: ' + ((this.player.controllers[0] as PlayerController).speed * 10).toFixed(1) + ', jumpDuration: ' + ((this.player.controllers[0] as PlayerController).jumpDuration).toFixed(1));
    }
}