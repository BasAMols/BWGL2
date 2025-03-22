import { DomElement } from '../elements/domElement';
import { DomText } from '../elements/domText';
import { Vector2 } from './math/vector2';


export class Loader extends DomElement<'div'> {
    bar: DomElement<'div'>;
    barBackground: DomElement<'div'>;
    text: DomText;
    public constructor( ) {
        super('div',{
            position: new Vector2(5, 5),
            size: new Vector2(600, 70),
            background: '#272727',
        });

        this.bar = new DomElement('div', {
            size: new Vector2(600, 70),
            background: '#80808070',
        })
        this.dom.appendChild(this.bar.dom);

        this.text = new DomText({
            text: '',
            fontSize: 35,
            fontWeight: 900,
            color: 'white',
            size: new Vector2(600, 70),
            position: new Vector2(30, -10),
            fontFamily: 'monospace',
        });
        this.dom.appendChild(this.text.dom);
    }

    public update(value: number, total: number){
        this.text.text = `loaded ${total - value} out of ${total} assets`;
        this.bar.width = 600 * (total - value) / total;
    }
}