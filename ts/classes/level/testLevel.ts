import { v3 } from '../util/math/vector3';
import { TickerReturnData } from '../ticker';
import { Scene } from '../webgl2/scene';
import { Camera } from '../webgl2/camera';
import { PlayerActor } from './freeCam/player/a_player';
import { Island } from './world/island';
import { Sky } from './world/sky';
import { UI, UIElement } from '../elements/UI';
import { v2 } from '../util/math/vector2';
import { CarActor } from './freeCam/car/a_car';
import { CarController } from './freeCam/car/c_car';

export class TestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.2, 0.3, 0.5, 1.0];  // Match sky color
    public ui: UI = new UI();
    positionData: UIElement<string>;
    player: PlayerActor;
    fpsData: UIElement<string>;
    rotationData: UIElement<string>;
    actorData: UIElement<string>;
    world: Island;
    car: CarActor;

    public get progress(): number { return (this.car.controllers[0] as CarController).progress; }

    constructor() {
        // Position camera to see reflections better
        super(new Camera({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 }), {
            ambientLightColor: v3(0.4, 0.8, 0.9),
            ambientLightIntensity: 0.7,  // Very subtle ambient lighting,
        });

        this.add(this.world = new Island());
        this.add(this.car = new CarActor(this.world));
        this.add(this.player = new PlayerActor());
        this.add(new Sky(this));

        this.ui.add((this.positionData = UI.data({ label: 'P', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.rotationData = UI.data({ label: 'R', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.fpsData = UI.data({  label: 'FPS', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.actorData = UI.data({  label: 'Speed', size: v2(400, 100) })), 'bottom');
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
        this.actorData.change(`${this.player.speed.toFixed(2)} km/h`);
    }
}