import { v3 } from '../util/math/vector3';
import { TickerReturnData } from '../ticker';
import { Scene } from '../webgl2/scene';
import { Camera } from '../webgl2/camera';
import { UI, UIElement } from '../elements/UI';
import { v2 } from '../util/math/vector2';

export class PhysicsTestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.2, 0.3, 0.5, 1.0];  // Match sky color
    public ui: UI = new UI();
    positionData: UIElement<string>;
    fpsData: UIElement<string>;
    rotationData: UIElement<string>;


    constructor() {
        // Position camera to see reflections better
        super(new Camera({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 }), {
            ambientLightColor: v3(0.4, 0.8, 0.9),
            ambientLightIntensity: 0.7,  // Very subtle ambient lighting,
        });
        
        // this.ui.add((this.positionData = UI.data({ label: 'P', size: v2(400, 100) })), 'bottom');
        // this.ui.add((this.rotationData = UI.data({ label: 'R', size: v2(400, 100) })), 'bottom');
        this.ui.add((this.fpsData = UI.data({  label: 'FPS', size: v2(400, 100) })), 'bottom');
        this.ui.expanded = false;

    }

    tick(obj: TickerReturnData) {
        super.tick(obj);
        this.fpsData.change(obj.frameRate.toFixed(2));
    }
}