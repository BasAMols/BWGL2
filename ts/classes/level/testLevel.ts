import { v3 } from '../util/math/vector3';
import { TickerReturnData } from '../ticker';
import { Scene } from '../webgl2/scene';
import { Camera } from '../webgl2/camera';
import { Plane } from './plane/plane';
import { Ocean } from './world/ocean';
import { Island } from './world/island';
import { Sky } from './world/sky';

export class TestLevel extends Scene {
    protected clearColor: [number, number, number, number] = [0.2, 0.3, 0.5, 1.0];  // Match sky color

    constructor() {
        // Position camera to see reflections better
        super(new Camera({ position: v3(0, 100, 200), target: v3(0, 0, 0), fov: 40 }), {
            ambientLightColor: v3(0.4, 0.8, 0.9),
            ambientLightIntensity: 0.7  // Very subtle ambient lighting
        });

        this.add(new Ocean());
        this.add(new Island());
        this.add(new Sky(this));
        this.add(new Plane());

    }


    tick(obj: TickerReturnData) {
        super.tick(obj);       
    }
}