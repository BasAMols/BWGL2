import { Vector2 } from '../util/math/vector2';
import { DomElement, DomElementAttributes } from "./domElement";

export type  UIAttributes = DomElementAttributes & {
   
}

export interface UIElement<T> {
    dom: HTMLElement;
    change: (value: T) => void;
}

export class UI extends DomElement<'div'> {
    public touchControls: HTMLDivElement;
    collapseDiv: HTMLDivElement;
    bottomDiv: HTMLDivElement;
    private _expanded: boolean = false;
    public get expanded(): boolean {
        return this._expanded;
    }
    public set expanded(value: boolean) {
        this._expanded = value;
        this.collapseDiv.classList.toggle('ui_collapse_div_expanded', value);
    }
    public constructor(attr: UIAttributes = {}) {
        super('div', attr);
        this.dom.classList.add('ui_container');
        
        this.collapseDiv = document.createElement('div');
        this.collapseDiv.classList.add('ui_collapse_div');
        this.dom.appendChild(this.collapseDiv);

        const collapseButton = document.createElement('div');
        collapseButton.classList.add('ui_collapse_button');
        collapseButton.addEventListener('click', () => {
            this.expanded = !this.expanded;
        });
        this.collapseDiv.appendChild(collapseButton);
        
        this.bottomDiv = document.createElement('div');
        this.bottomDiv.classList.add('ui_bottom_div');
        this.dom.appendChild(this.bottomDiv);
        
        this.touchControls = document.createElement('div');
        this.dom.appendChild(this.touchControls)
    }

    public add(element: UIElement<any>, location: 'collapse' | 'bottom' = 'collapse') {
        if (location === 'collapse') {
            this.collapseDiv.appendChild(element.dom);
        } else {
            this.bottomDiv.appendChild(element.dom);
        }
    }

    public static slider(data: { 
        min: number; 
        max: number; 
        onChange: (value: number) => void; 
        position?: {
            x: number;
            y: number;
            anchor: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
        },
        value?:number,
        step?:number,
        width?: number,
        label?: string,

    }): UIElement<number> {
        const wrapper = document.createElement('div');
        wrapper.classList.add('ui_slider_wrap');

        if (data.position) {
            wrapper.style.position = 'absolute';
            wrapper.style[data.position.anchor.includes('top') ? 'top' : 'bottom'] = `${data.position.y}px`;
            wrapper.style[data.position.anchor.includes('left') ? 'left' : 'right'] = `${data.position.x}px`;
        }
        
        const valueDiv = document.createElement('input');
        valueDiv.type = 'number';
        valueDiv.value = data.value?.toString()??data.min.toString();
        valueDiv.step = data.step?.toString()??'1';
        valueDiv.style.maxWidth = (data.max.toString().length*15+6) + 'px';
        valueDiv.addEventListener('input', (e) => {
            data.onChange(Number(valueDiv.value));
        });
        wrapper.appendChild(valueDiv);
        valueDiv.classList.add('ui_slider_value');
        
        const slider = document.createElement('input') as HTMLInputElement;
        slider.type = 'range';
        slider.min = data.min.toString();
        slider.max = data.max.toString();
        slider.value = data.value?.toString()??data.min.toString();
        slider.step = data.step?.toString()??'1';
        slider.addEventListener('input', (e) => {
            data.onChange(Number(slider.value));
            valueDiv.value = slider.value;
        });
        slider.style.width = data.width?.toString()??100 + 'px';
        slider.classList.add('ui_slider_input');
      

        if (data.label) {
            const label = document.createElement('div');
            label.textContent = data.label;
            label.classList.add('ui_slider_label');
            wrapper.appendChild(label);
        }
        
        wrapper.appendChild(slider);

        return {
            dom: wrapper,
            change: (value: number) => {
                slider.value = value.toString();
                valueDiv.value = value.toString();
            }
        };
    }
    public static data(data: { 
        position?: {
            x: number;
            y: number;
            anchor: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
        },
        value?:string
        size?: Vector2,
        label?: string,

    }): UIElement<string> {
        const wrapper = document.createElement('div');
        wrapper.classList.add('ui_data_wrap');
        wrapper.style.width = data.size?.x?.toString()??100 + 'px';
        wrapper.style.height = data.size?.y?.toString()??100 + 'px';

        if (data.position) {
            wrapper.style.position = 'absolute';
            wrapper.style[data.position.anchor.includes('top') ? 'top' : 'bottom'] = `${data.position.y}px`;
            wrapper.style[data.position.anchor.includes('left') ? 'left' : 'right'] = `${data.position.x}px`;
        }
        
        if (data.label) {
            const label = document.createElement('div');
            label.textContent = data.label;
            label.classList.add('ui_data_label');
            wrapper.appendChild(label);
        }

        const valueDiv = document.createElement('div');
        valueDiv.textContent = data.value??'';
        wrapper.appendChild(valueDiv);
        valueDiv.classList.add('ui_data_value');

        return {
            dom: wrapper,
            change: (value: string) => {
                valueDiv.textContent = value;
            }
        };
    }
}