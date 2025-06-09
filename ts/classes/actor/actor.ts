import { InputReader } from '../input/input';
import { TickerReturnData } from '../ticker';
import { Matrix4 } from '../util/math/matrix4';
import { Quaternion } from '../util/math/quaternion';
import { Vector2 } from '../util/math/vector2';
import { v3, Vector3 } from '../util/math/vector3';
import { ContainerObject } from '../webgl2/meshes/containerObject';
import { SceneObjectProps } from '../webgl2/meshes/sceneObject';
import { Controller } from './controller';

export interface ActorProps extends SceneObjectProps {
    controllers?: Controller[];
}

export class Actor extends ContainerObject {
    controllers: Controller[] = [];
    joysticks: Record<string, InputReader<Vector2>[]> = {};
    buttons: Record<string, InputReader<number>[]> = {};
    controllerList: {
        preTick: Controller[];
        postTick: Controller[];
        preRender: Controller[];
        postRender: Controller[];
    } = {
            preTick: [],
            postTick: [],
            preRender: [],
            postRender: [],
        };
    constructor(props: ActorProps = {}) {
        super(props);
        props.controllers?.forEach((controller) => {
            this.addController(controller);
        });
    }
    public build(): void {
        this.controllers.forEach((controller) => {
            controller.build?.();
        });
        this.scene.inputMap.addJoystick(this.joysticks);
        this.scene.inputMap.addButton(this.buttons);
    }
    addController(controller: Controller) {
        this.controllers.push(controller);
        controller.register(this);
        this.controllerList[controller.order].push(controller);
    }
    removeController(controller: Controller) {
        this.controllers = this.controllers.filter((c) => c !== controller);
        controller.unregister(this);
        this.controllerList[controller.props.order] = this.controllerList[controller.props.order].filter((c) => c !== controller);
    }
    render(obj: TickerReturnData, viewMatrix: Matrix4, projectionMatrix: Matrix4) {

        this.controllerList.preTick.forEach((controller) => {
            controller.tick(obj);
        });
        this.tick(obj);
        this.controllerList.postTick.forEach((controller) => {
            controller.tick(obj);
        });

        this.controllerList.preRender.forEach((controller) => {
            controller.tick(obj);
        });
        super.render(obj, viewMatrix, projectionMatrix);
        this.controllerList.postRender.forEach((controller) => {
            controller.tick(obj);
        });
    }
    tick(obj: TickerReturnData) {
    }
    afterTick(obj: TickerReturnData) {
        // Initialize data on first frame
        if (!this.dynamic._data) {
            this.dynamic._data = {
                parent: this,
                ticker: obj,
                lastPosition: this.transform.getWorldPosition(),
                lastRotation: this.transform.getWorldRotation(),
                velocity: v3(0),
                speed: 0,
            };
            return;
        }

        // Calculate velocity using previous frame's position
        const currentPosition = this.transform.getWorldPosition();
        const displacement = currentPosition.subtract(this.dynamic._data.lastPosition);
        const velocity = displacement.scale(1000 / obj.intervalS10); // Convert to m/s
        const speed = velocity.magnitude() * 3.6; // Convert m/s to km/h

        // Update data for next frame
        this.dynamic._data = {
            parent: this,
            ticker: obj,
            lastPosition: currentPosition,
            lastRotation: this.transform.getWorldRotation(),
            velocity: velocity,
            speed: speed,
        };
    }
    endTick(obj: TickerReturnData) {
        
    }
    public dynamic:{
        _data?: {
            parent: Actor,
            ticker: TickerReturnData,
            lastPosition: Vector3,
            lastRotation: Quaternion,
            velocity: Vector3|undefined,
            speed: number|undefined,
        },
        velocity: () => Vector3,
        kph: () => number,
    } = {
        velocity () {
            return this._data?.velocity || v3(0);
        },
        kph() {
            return this._data?.speed || 0;
        }
    }

    public get speed() {
        return this.dynamic.kph();
    }


}

