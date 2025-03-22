

import { DomText, DomTextAttributes } from './domText';

export type  DomButtonAttributes = DomTextAttributes & {
    onClick: ()=>void
}
export class DomButton extends DomText {
    public onClick: ()=>void;
    public constructor(attr: DomButtonAttributes) {
        super(attr);        
        this.onClick = attr.onClick;
        this.dom.style.pointerEvents = 'auto';
        this.dom.style.cursor = 'pointer';
        this.dom.onclick = this.onClick;
    }
}