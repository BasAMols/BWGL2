import { v3 } from '../util/math/vector3';
import { TickerReturnData } from '../ticker';
import { Scene } from '../webgl2/scene';
import { Camera } from '../webgl2/camera';
import { PlayerActor } from './freeCam/playerActor';
import { Ocean } from './world/ocean';
import { Island } from './world/island';
import { Sky } from './world/sky';
import { InputMap } from '../input/input';
import { KeyboardJoyStickReader } from '../input/keyboardReader';
import { UI, UIElement } from '../elements/UI';
import { v2 } from '../util/math/vector2';
import { MouseMoveReader } from '../input/mouseReader';

export class TestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.2, 0.3, 0.5, 1.0];  // Match sky color
    public ui: UI = new UI();
    positionData: UIElement<string>;
    plane: PlayerActor;
    fpsData: UIElement<string>;
    rotationData: UIElement<string>;


    private set nearPlane(value: number) {
        this.camera.near = value;
    }

    private set farPlane(value: number) {
        this.camera.far = value;
    }

    private set fov(value: number) {
        this.camera.fov = value;
    }   

    constructor() {
        // Position camera to see reflections better
        super(new Camera({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 }), {
            ambientLightColor: v3(0.4, 0.8, 0.9),
            ambientLightIntensity: 0.7,  // Very subtle ambient lighting,
            inputMap: new InputMap(
                {
                    'movement': [new KeyboardJoyStickReader(['a', 'd', 's', 'w'])],
                    'camera': [new MouseMoveReader()],
                }
            )
        });

        this.add(new Ocean());
        this.add(new Island());
        this.add(new Sky(this));
        this.add(this.plane = new PlayerActor());
        const data = UI.data({ value: '0', label: 'precision', size: v2(400, 100) });
        
        // this.ui.add(UI.slider({ value: this.camera.near, step: 1,  label: 'Near', min: 0, max: 100, onChange: (value) => {
        //     this.nearPlane = Math.max(value, 0.1)
        //     data.change((this.camera.far / this.camera.near).toString())
        // }, width: 600 }));
        // this.ui.add(UI.slider({ value: this.camera.far,step: 100, label: 'Far ', min: 0, max: 100000, onChange: (value) => {
        //     this.farPlane = Math.max(value, 0.1)
        //     data.change((this.camera.far / this.camera.near).toString())
        // }, width: 600   }));

        this.ui.add(data);

        this.ui.add(UI.slider({ value: this.camera.fov, label: 'FOV ', min: 1, max: 100, onChange: (value) => {
            this.fov = value
        }, width: 600 }));

        this.ui.add((this.positionData = UI.data({ label: 'P', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.rotationData = UI.data({ label: 'R', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.fpsData = UI.data({  label: 'FPS', size: v2(400, 100) })), 'bottom');
        this.ui.expanded = false;

    }


    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.positionData.change(
            this.plane.transform.getWorldPosition().array.map(v => v.toFixed(0)).join('m, ') + 'm'
        );
        this.rotationData.change(
            this.plane.camera.getAngle().array.map(v => v.toFixed(2)).join(', ')
        );
        this.fpsData.change(obj.frameRate.toFixed(2) + '/' + obj.maxRate.toFixed(2));
    }
}