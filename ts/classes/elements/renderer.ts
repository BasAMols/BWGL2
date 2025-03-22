import { ElementAttributes } from '../elements/element';
import { Vector2, v2 } from '../util/math/vector2';
import { TickerReturnData } from '../ticker';
import { DomElement } from './domElement';
import { Level } from '../level';
import { Events } from '../util/event';
import { glob } from '../../game';
import { WebGL2Initializer } from '../webgl2/initialise';
import { Scene } from '../webgl2/scene';
import { Camera } from '../webgl2/camera';
import { vec3 } from 'gl-matrix';
import { IndexBuffer, VertexArray, VertexBuffer } from '../webgl2/buffer';
import { ShaderManager } from '../webgl2/shaderManager';
import { Cube } from '../meshes/cube';
import { fragmentShaderSource } from '../webgl2/shaders/fragmentShaderSource';
import { vertexShaderSource } from '../webgl2/shaders/vertexShaderSource';

export type DomElementAttributes = ElementAttributes & {
    id?: string,
    size?: Vector2,
    background?: string,
    position?: Vector2;
};

export class Renderer extends DomElement<'canvas'> {
    public tickerData: TickerReturnData;
    private webgl: WebGL2Initializer;
    private scene: Scene;
    private camera: Camera;
    public readonly ctx: WebGL2RenderingContext;

    public vertexBuffer: VertexBuffer;
    public indexBuffer: IndexBuffer;
    public vao: VertexArray;
    public shaderManager: ShaderManager;

    constructor() {
        super('canvas');
        this.dom.style.position = 'absolute';
        this.dom.style.pointerEvents = 'all';
        this.dom.style.bottom = '0px';
        this.dom.style.touchAction = 'none';
        this.dom.tabIndex = 1;

        this.webgl = new WebGL2Initializer(this.dom);
        this.ctx = this.webgl.getContext();

        // Initialize basic WebGL objects
        this.shaderManager = new ShaderManager(this.ctx);
        this.vao = new VertexArray(this.ctx);
        this.vertexBuffer = new VertexBuffer(this.ctx);
        this.indexBuffer = new IndexBuffer(this.ctx);

        // Set up camera with better position to see multiple faces
        const position = vec3.fromValues(3, 2, 3);
        const target = vec3.fromValues(0, 0, 0);
        const up = vec3.fromValues(0, 1, 0);
        this.camera = new Camera(position, target, up, 45);

        // Set up scene
        this.scene = new Scene(this.ctx);
        this.scene.setCamera(this.camera);

        window.addEventListener("resize", () => {
            this.resize();
        });

        this.addEvent(new Events('resize'));
        this.resize();
        this.init();
    }

    public init() {
        // Load and use shader program
        this.shaderManager.loadShaderProgram('basic', vertexShaderSource, fragmentShaderSource);
        this.shaderManager.useProgram('basic');

        // Set default uniform values
        this.shaderManager.setUniform('uLightPos', new Float32Array([5.0, 5.0, 5.0]));
        this.shaderManager.setUniform('uLightColor', new Float32Array([1.0, 1.0, 1.0]));
        this.shaderManager.setUniform('uUseTexture', 0);
        this.shaderManager.setUniform('uViewPos', new Float32Array([3.0, 2.0, 3.0]));  // Match camera position

        // Create cube with rotation to better show faces
        const cube = Cube.createSceneObject(
            this.ctx,
            this.shaderManager,
            vec3.fromValues(0, 0, 0),     // Position at origin
            vec3.fromValues(1, 1, 1),      // Unit scale
            vec3.fromValues(0.2, 0.5, 0)   // Rotation in radians
        );
        
        this.scene.add(cube);
    }

    resize() {
        this.size = v2(document.body.clientWidth, document.body.clientHeight);
        this.dom.style.width = `${this.size.x}px`;
        this.dom.setAttribute('width', String(this.size.x));
        this.dom.style.height = `${this.size.y}px`;
        this.dom.setAttribute('height', String(this.size.y));

        this.getEvent('resize').alert(this.size);
        this.webgl.resizeCanvas(this.width, this.height);
        
        // Update camera aspect ratio
        if (this.camera) {
            this.camera.setAspect(this.width / this.height);
        }
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

        this.scene.render();
    }
}


