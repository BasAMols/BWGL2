import { TickerReturnData } from '../ticker';
import { Actor } from "./actor";

export interface ControllerProps {
    order?: 'preTick' | 'postTick' | 'preRender' | 'postRender';
}

export class Controller {
    actor: Actor;
    props: ControllerProps;
    order: 'preTick' | 'postTick' | 'preRender' | 'postRender';
    
    constructor(props: ControllerProps = {}) {
        this.props = props;
        this.order = props.order ?? 'preTick';
    }
    register(actor: Actor) {
        this.actor = actor;
    }
    unregister(actor: Actor) {
        this.actor = null;
    }
    tick(obj: TickerReturnData) {

    }
    build() {

    }
}