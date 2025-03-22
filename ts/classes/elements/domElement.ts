import { Element, ElementAttributes } from '../elements/element';
import { Vector2, v2 } from '../util/math/vector2';
import { TickerReturnData } from '../ticker';


export type DomElementAttributes = ElementAttributes & {
    id?: string,
    background?: string,
    position?: Vector2;
    size?: Vector2;
};
export class DomElement<T extends keyof HTMLElementTagNameMap> extends Element {
    public dom: HTMLElementTagNameMap[T];
    public children: DomElement<any>[] = [];
    public rendererType = 'dom' as const;
    private _position: Vector2 = v2(0);
    public get position(): Vector2 {
        return this._position;
    }
    public set position(value: Vector2) {
        this._position = value;
        this.x = value.x;
        this.y = value.y
    }
    public size: Vector2 = v2(0);

    public get id() { return this.dom.id; }

    public set id(value: string) {
        if (value) {
            this.dom.id = value;
        }
    }

    public get x(): number {
        return Math.round(Number(this.dom.style.left.replace(/\D/g,'')));
    }
    public set x(n: number) {
        if (this.dom){
            this.dom.style.left = `${n}px`;
        }
    }
    public get y(): number {
        return Math.round(Number(this.dom.style.bottom.replace(/\D/g,'')));
    }
    public set y(n: number) {
        if (this.dom){
            this.dom.style.bottom = `${n}px`;
        }
    }

    public set visible(value: boolean) {
        this.dom? this.dom.style.display = value ? 'block' : 'none': null
    }

    public set background(v: string) {
        this.dom.style.background = v;
    }

    public get width() {
        return Math.round(Number(this.dom.style.width.replace(/\D/g,'')));
    }
    public set width(value: number) {
        if (this.dom) {
            this.dom.style.width = `${value}px`;
            this.dom.setAttribute('width', String(value));
        }
    }

    public get height() {
        return Math.round(Number(this.dom.style.height.replace(/\D/g,'')));
    }
    public set height(value: number) {
        if (this.dom) {
            this.dom.style.height = `${value}px`;
            this.dom.setAttribute('height', String(value));
        }
    }

    constructor(type: T, attr: DomElementAttributes = {}) {
        super();
        this.dom = document.createElement(type);
        this.dom.style.position = 'absolute';
        this.dom.style.transformOrigin = 'bottom left';
        this.dom.style.pointerEvents = 'none';
        this.dom.style.bottom = '0px';	
        this.id = attr.id || '';
        this.background = attr.background || '';
        this.size = attr.size || Vector2.zero;
        this.position = attr.position || Vector2.zero;
        
    }

    public ready() {
        this.build();
    }

    public tick(obj: TickerReturnData): void {
        this.children.forEach((c)=>{
            c.tick(obj);
        })
    }

    public appendChild(e: DomElement<any>) {
        this.dom.appendChild(e.dom);
    }

    public addChild(child: DomElement<any>) {
        this.children.push(child);
        this.dom.appendChild(child.dom);
    }

    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLAnchorElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.dom.addEventListener(type, listener, options);
    };
    removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLAnchorElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        this.dom.removeEventListener(type, listener, options);
    };



}
