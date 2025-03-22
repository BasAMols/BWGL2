import { ElementAttributes } from '../elements/element';
import { Vector2, v2 } from '../util/math/vector2';
import { TickerReturnData } from '../ticker';
import { DomElement } from './domElement';
import { Level } from '../level';
import { Events } from '../util/event';
import { glob } from '../../game';

export type DomElementAttributes = ElementAttributes & {
    id?: string,
    size?: Vector2,
    background?: string,
    position?: Vector2;
};
export class Renderer extends DomElement<'canvas'> {
    public tickerData: TickerReturnData;

    constructor() {
        super('canvas');
        this.dom.style.position = 'absolute';
        this.dom.style.pointerEvents = 'all';
        this.dom.style.bottom = '0px';
        this.dom.style.touchAction = 'none';
        this.dom.tabIndex = 1;

        window.addEventListener("resize", () => {
            this.resize();
        });

        this.addEvent(new Events('resize'));
        this.resize();
    }

    resize() {
        this.size = v2(document.body.clientWidth, document.body.clientHeight);
        this.dom.style.width = `${this.size.x}px`;
        this.dom.setAttribute('width', String(this.size.x));

        this.dom.style.height = `${this.size.y}px`;
        this.dom.setAttribute('height', String(this.size.y));

        this.getEvent('resize').alert(this.size);

    }

    public get width() {
        return Math.round(Number(this.dom.style.width.replace(/\D/g, '')));
    }
    public set width(value: number) {
        this.dom.style.width = `${value}px`;
        this.dom.setAttribute('width', String(value));
    }

    public get height() {
        return Math.round(Number(this.dom.style.height.replace(/\D/g, '')));
    }
    public set height(value: number) {
        this.dom.style.height = `${value}px`;
        this.dom.setAttribute('height', String(value));
    }

    public addLevel(child: Level) {
        child.build();
    }

    private _context: '2d' | '3d';
    public get context(): '2d' | '3d' {
        return this._context;
    }
    public set context(value: '2d' | '3d') {
        this._context = value;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.tickerData = obj;
        glob.game.active?.tick(obj);
        
    }
}


