import { glob } from '../../game';
import { TickerReturnData } from '../ticker';
import { Events } from "../util/event";

export type ElementAttributes = {

};

export abstract class Element {
    public abstract rendererType: 'dom' | 'gl';

    private events: Events<unknown>[] = [];

    get t(): TickerReturnData {
        return glob.game.t;
    }

    public parent!: Element;

    public build(): void {
        //
    }

    addEvent(e: Events<unknown>) {
        this.events.push(e);
    }

    getEvent(id: string) {
        return this.events.find((e) => id === e.id);
    }
}
