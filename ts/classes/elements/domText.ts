import { DomElement, DomElementAttributes } from "./domElement";

export type  DomTextAttributes = DomElementAttributes & {
    text?: string,
    color?: string,
    fontSize?: number,
    fontWeight?: number,
    fontFamily?: string,
    padding?: [number,number,number,number],
}
export class DomText extends DomElement<'div'> {
    set color (v: string) {
        this.dom.style.color = v; 
    }
    set fontSize (v: number) {
        this.dom.style.fontSize = String(v)+'px'; 
    }
    set fontWeight (v: number) {
        this.dom.style.fontWeight = String(v); 
    }
    set fontFamily (v: string) {
        this.dom.style.fontFamily = v; 
    }
    public get text() {
        return this.dom.innerHTML;
    }
    public set text (v: string) {
        this.dom.innerHTML = v?v:''; 
    }
    public set padding (v: [number,number,number,number]) {
        this.dom.style.padding = v.join('px ')+'px'; 
    }
    public constructor(attr: DomTextAttributes = {}) {
        super('div', attr);
        this.color = attr.color;
        this.text = attr.text;
        this.fontSize = attr.fontSize;
        this.fontWeight = attr.fontWeight;
        this.fontFamily = attr.fontFamily;
        this.padding = attr.padding || [0,0,0,0];

        this.dom.style.pointerEvents = 'none';
        this.dom.style.userSelect = 'none';
        this.dom.style.zIndex = '1';
        this.dom.style.whiteSpace = 'pre-line';
    }
}