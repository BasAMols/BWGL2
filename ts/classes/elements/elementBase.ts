import { TickerReturnData } from '../ticker';
import { Matrix4 } from '../util/math/matrix4';
import { Vector2, v2 } from '../util/math/vector2';
import { Vector3, v3 } from '../util/math/vector3';
import { Element, ElementAttributes } from './element';

export type GlElementAttributes = ElementAttributes & {
    autoReady?: boolean,
    // controllers?: GlController[];
    composite?: GlobalCompositeOperation;
    size?: Vector3;
    position?: Vector3;
    rotation?: Vector3;
    anchorPoint?: Vector3;
};
export interface GlElement {
    mouseMove?(e: MouseEvent): void;
    keyDown?(e: KeyboardEvent): void;
    keyUp?(e: KeyboardEvent): void;
    click?(e: MouseEvent): void;
    scroll?(e: WheelEvent): void;
    drag?(d: Vector2): void;
}

export type GlElementType = 'controller' | 'object' | 'mesh' | 'collider' | 'group';

export abstract class GlElement extends Element {
    public abstract type: GlElementType;
    public rendererType = 'gl' as const;
    public autoReady: boolean;
    public anchorPoint: Vector3;
    public parent: GlElement;
    private transformMatrix: Matrix4;
    // public zones: Zone[] = [];
    private _position: Vector3 = v3(0);
    public get position(): Vector3 {
        return this._position;
    }
    public set position(value: Vector3) {
        this._position = value;
    }

    private _size: Vector3 = v3(0);
    public get size(): Vector3 {
        return this._size;
    }
    public set size(value: Vector3) {
        this._size = value;
    }
    private _rotation: Vector3 = v3(0);
    public get rotation(): Vector3 {
        return this._rotation;
    }
    public set rotation(value: Vector3) {
        this._rotation = value;
    }

    public get localMatrix() {
        return new Matrix4()
            .translate((this.position || v3(0)).multiply(new Vector3(1, 1, -1)))
            .translate((this.anchorPoint || v3(0)).multiply(1, 1, -1))
            .rotate((this.rotation || v3(0)).multiply(new Vector3(1, -1, -1)))
            .translate((this.anchorPoint || v3(0)).multiply(-1, -1, 1));
    }

    public get globalMatrix(): Matrix4 {
        return (this.parent?.globalMatrix || new Matrix4()).multiply(this.localMatrix);
    }

    public get globalPosition(): Vector3 {
        return this.globalMatrix.position.multiply(v3(1, 1, -1));
    }

    public get worldRotation(): Vector3 {
        return (this.parent?.worldRotation || v3()).add(this.rotation);
    }

    public get screenPosition(): Vector2 {
        return v2(0);
    }

    private _active: boolean = true;
    private _visible: boolean = true;
    public get visible(): boolean {
        return this._visible;
    }
    public set visible(value: boolean) {
        this._visible = value;
    }
    public readyState: boolean = false;
    public get active(): boolean {
        return this._active;
    }
    public set active(value: boolean) {
        this._active = value;
    }

    public children: GlElement[] = [];
    // public controllers: GlController[] = [];
    public anchoredPosition: Vector2 = Vector2.zero;

    // public get camera(): typeof this.mode.camera {
    //     return this.mode.camera;
    // }
    // public set camera(c: typeof this.mode.camera) {
    //     this.mode.camera = c;
    // }

    // public get axis(): (v: string) => Vector2 {
    //     return this.level.inputMap.axis.bind(this.level.inputMap);
    // }

    // public get button(): (v: string) => number {
    //     return this.level.inputMap.button.bind(this.level.inputMap);
    // }

    constructor(attr: GlElementAttributes = {}) {
        super();
        this.autoReady = attr.autoReady !== undefined ? attr.autoReady : true;
        // this.addControllers(attr.controllers || []);

        this.size = attr.size || this.parent?.size || v3(0);
        this.position = attr.position || v3(0);
        this.rotation = attr.rotation || v3(0);
        this.anchorPoint = attr.anchorPoint || v3(0);
    }


    public ready() {
        this.build();
        // glob.game.waitCount--;
    }

    public addChild(child: GlElement): typeof child {
        child.parent ??= this;
        // glob.game.waitCount++;
        this.children.push(child);
        if (child.autoReady) {
            child.ready();
        }
        // GlElement.registerControllers(child);
        child.readyState = true;
        return child;
    }

    // public removeChild(child: GlElement) {
    //     if (this.children.includes(child)) {
    //         this.children.splice(this.children.indexOf(child), 1);
    //     }
    // }

    // public addControllers(c: GlController[]) {
    //     if (c.length > 0) {
    //         this.controllers.push(...c);
    //     }
    // }

    // public static registerControllers(child: GlElement) {
    //     child.controllers.forEach((controller) => {
    //         if (controller.parent === undefined) {
    //             controller.parent ??= child;
    //             controller.build();

    //             if (controller.type === 'collider' && controller.level) {
    //                 child.level.addZone(controller as Zone);
    //                 child.zones.push(controller as Zone);
    //             }
    //         }
    //     });
    // }

    public tick(obj: TickerReturnData) {

        // this.controllers.filter((child) => child.active && child.order === 'before').forEach((c) => c.tick(obj));
        this.children.filter((child) => child.active).forEach((c) => c.tick(obj));
        this.children.filter((child) => child.active).forEach((c) => c.afterTick(obj));
    }

    public afterTick(obj: TickerReturnData) {
        // this.controllers.filter((child) => child.active && child.order === 'after').forEach((c) => c.tick(obj));
    }
}