import { TickerReturnData } from '../ticker';
import { Matrix4 } from '../util/math/matrix4';
import { ContainerObject } from '../webgl2/meshes/containerObject';
import { SceneObjectProps } from '../webgl2/meshes/sceneObject';
import { Controller } from './controller';

export interface ActorProps extends SceneObjectProps {
    controllers?: Controller[];
}

export class Actor extends ContainerObject {
    controllers: Controller[] = [];
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
}

