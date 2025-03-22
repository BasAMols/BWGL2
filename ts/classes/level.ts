import { glob } from '../game';
import { DomElement } from './elements/domElement';
import { GlElementAttributes, GlElementType } from './elements/elementBase';
import { GlElement } from './elements/elementBase';
import { UI } from './elements/UI';
import { InputMap } from './input/input';
import { TickerReturnData } from './ticker';
import { Vector2 } from './util/math/vector2';
import { Vector3 } from './util/math/vector3';


export type levelAttributes = GlElementAttributes & {
    size3?: Vector3;
};
export abstract class Level extends GlElement {
    abstract start: Vector2;
    public type: GlElementType = 'group';
    // public levelZones: Zone[] = [];
    // public lights: Light[] = [];
    // private colliderMeshes: GLCuboid[] = [];
    public interface: UI = new UI();
    public abstract inputMap: InputMap;

    private _camera: {
        target: Vector3;
        rotation: Vector3;
        offset: Vector3;
        fov: number;
    } = {
            target: Vector3.f(0),
            rotation: Vector3.f(0),
            offset: Vector3.f(0),
            fov: 60,
        };


    public get camera(): typeof this._camera {
        return this._camera;
    }
    public set camera(value: typeof this._camera) {
        this._camera = value;
    }


    addUi(element: DomElement<any>) {
        this.interface.appendChild(element);
    }

    // addZone(c: Zone) {
    //     // this.levelZones.push(c);

    //     // const mesh = new GLCuboid({
    //     //     size: c.size,
    //     //     colors: [Colors.r],
    //     //     opacity: 0.3,
    //     //     anchorPoint: c.anchorPoint
    //     // });
    //     // this.colliderMeshes.push(mesh);
    //     // this.addChild(mesh);
    // }

    // addLight(c: Light) {
    //     this.lights.push(c);
    //     this.addChild(c);
    // }

    constructor(attr: levelAttributes = {}) {
        super(attr);
        this.size = this.size;
    }

    public build(): void {
        glob.game.active = this;
        this.interface.build();
    }

    public tick(obj: TickerReturnData): void {
        super.tick(obj);

        // this.colliderMeshes.forEach((c, i) => {
        //     c.position = this.levelZones[i].globalPosition;
        //     c.size = this.levelZones[i].size.clone();
        // });

    }

    public afterTick(obj: TickerReturnData): void {
        super.afterTick(obj);
        this.inputMap.tick();
    }

}
