import { DomElement, DomElementAttributes } from "./domElement";

export type  UIAttributes = DomElementAttributes & {
   
}
export class UI extends DomElement<'div'> {
    public touchControls: HTMLDivElement;
    public constructor(attr: UIAttributes = {}) {
        super('div', attr);
        this.dom.style.width = '100%';
        this.dom.style.height = '100%';
        this.dom.style.zIndex = '3';
        this.dom.style.pointerEvents = 'none';
        this.touchControls = document.createElement('div');
        this.dom.appendChild(this.touchControls)
    }
}