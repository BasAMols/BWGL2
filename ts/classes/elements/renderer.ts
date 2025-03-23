import { ElementAttributes } from '../elements/element';
import { Vector2, v2 } from '../util/math/vector2';
import { TickerReturnData } from '../ticker';
import { DomElement } from './domElement';
import { Events } from '../util/event';
import { glob } from '../../game';
import { WebGL2Initializer } from '../webgl2/initialise';

export type DomElementAttributes = ElementAttributes & {
    id?: string,
    size?: Vector2,
    background?: string,
    position?: Vector2;
};

export class Renderer extends DomElement<'canvas'> {
    public tickerData: TickerReturnData;
    private webgl: WebGL2Initializer;
    public get ctx(): WebGL2RenderingContext {
        return this.webgl.ctx;
    }
    public get shaderManager() {
        return this.webgl.shaderManager;
    }


    constructor() {
        super('canvas');
        this.dom.style.position = 'absolute';
        this.dom.style.pointerEvents = 'all';
        this.dom.style.bottom = '0px';
        this.dom.style.touchAction = 'none';
        this.dom.tabIndex = 1;

        this.webgl = new WebGL2Initializer(this.dom);

        window.addEventListener("resize", () => {
            this.resize();
        });

        glob.events.resize = new Events('resize');
        this.resize();
    }

    resize() {
        this.size = v2(document.body.clientWidth, document.body.clientHeight);
        this.dom.style.width = `${this.size.x}px`;
        this.dom.setAttribute('width', String(this.size.x));
        this.dom.style.height = `${this.size.y}px`;
        this.dom.setAttribute('height', String(this.size.y));

        glob.events.resize.alert(this.size);
        this.ctx.viewport(0, 0, this.size.x, this.size.y);
    }

    public get width() {
        return this.size.x;
    }
    public set width(value: number) {
        this.dom.style.width = `${value}px`;
        this.dom.setAttribute('width', String(value));
        this.size.x = value;
    }

    public get height() {
        return this.size.y;
    }
    public set height(value: number) {
        this.dom.style.height = `${value}px`;
        this.dom.setAttribute('height', String(value));
        this.size.y = value;
    }

    public tick(obj: TickerReturnData) {
        super.tick(obj);
        this.tickerData = obj;
        glob.game.active?.tick(obj);
        glob.game.active?.afterTick(obj);
    }
}


