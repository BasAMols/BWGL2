import { Renderer } from './classes/elements/renderer';
import { PadManager } from './classes/input/gamepadManager';
import { InputDevices } from './classes/input/inputDevices';
import { TestLevel } from './classes/testLevel';
import { Ticker, TickerReturnData } from './classes/ticker';
import { Events } from './classes/util/event';
import { Loader } from './classes/util/loader';
import { Scene } from './classes/webgl2/scene';

export var glob = new class {
    public game: Game;
    public get renderer() {
        return this.game.renderer;
    }
    public get shaderManager() {
        return this.renderer.shaderManager;
    }
    public device: InputDevices = new InputDevices();
    public get mobile(): boolean {
        return this.device.mobile;
    }
    public frame: number = 0;
    public get ctx(): WebGL2RenderingContext {
        return this.renderer.ctx;
    }
    public events: Record<string, Events<any>> = {};
};

export class Game {
    public ticker: Ticker;
    public renderer: Renderer;
    public readyToStart: boolean = false;
    private _waitCount: number = 0;
    private started: boolean = false;
    private loader: Loader;
    
    public total: number = 0;

    public levels: Record<string, Scene> = {};
    public active: Scene;

    public padManager: PadManager = new PadManager();
    get t(): TickerReturnData {
        return this.renderer.tickerData;
    }
    public get waitCount(): number {
        return this._waitCount;
    }
    public set waitCount(value: number) {
        if (value > this._waitCount) {
            this.total++;
        }
        if (!this.started) {
            if (value === 0 && this.readyToStart) {
                this.start();
            } else {
                this.loader.update(value, this.total);
            }
        }
        this._waitCount = value;

    }

    public constructor() {
        glob.game = this;
        this.init();
        glob.device.ready();
    }


    init() {
        this.renderer = new Renderer();

        this.loader = new Loader();
        this.renderer.addChild(this.loader);

        this.ticker = new Ticker();
        this.ticker.add(this.tick.bind(this));

        this.addLevel('test', new TestLevel());

        if (this.waitCount === 0) {
            this.start();
        } else {
            this.readyToStart = true;
        }
    }

    public tick(obj: TickerReturnData) {
        this.renderer.tick(obj);
    }

    protected addLevel(s: string, level: Scene) {
        this.levels[s] = level;
        // if (level.interface) {
        //     document.body.appendChild(level.interface.dom)
        // }
        this.active = level;
    }

    public get level(): Scene {
        return this.active;
    }

    public start() {
        this.started = true;
        this.loader.visible = false;
        this.ticker.start();
    }
}


