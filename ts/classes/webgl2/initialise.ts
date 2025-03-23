import { VertexBuffer, IndexBuffer, VertexArray } from './buffer';
import { ShaderManager } from './shaderManager';
import { fragmentShaderSource } from './shaders/fragmentShaderSource';
import { vertexShaderSource } from './shaders/vertexShaderSource';

export class WebGL2Initializer {
    private canvas: HTMLCanvasElement;
    public readonly ctx: WebGL2RenderingContext | null = null;
    
    public vertexBuffer: VertexBuffer;
    public indexBuffer: IndexBuffer;
    public vao: VertexArray;
    public shaderManager: ShaderManager;

    constructor(canvas: HTMLCanvasElement) {
        if (!canvas) {
            throw new Error(`Canvas not found`);
        }
        this.canvas = canvas;
        this.ctx = this.initializeWebGL2();

        // Initialize basic WebGL objects
        this.shaderManager = new ShaderManager(this.ctx);
        this.vao = new VertexArray(this.ctx);
        this.vertexBuffer = new VertexBuffer(this.ctx);
        this.indexBuffer = new IndexBuffer(this.ctx);

        // Load and use shader program
        this.shaderManager.loadShaderProgram('basic', vertexShaderSource, fragmentShaderSource);
        this.shaderManager.useProgram('basic');

        // Set default uniform values
        this.shaderManager.setUniform('uLightPos', new Float32Array([5.0, 5.0, 5.0]));
        this.shaderManager.setUniform('uLightColor', new Float32Array([1.0, 1.0, 1.0]));
        this.shaderManager.setUniform('uUseTexture', 0);
        this.shaderManager.setUniform('uViewPos', new Float32Array([3.0, 2.0, 3.0]));  // Match camera position
    }

    private initializeWebGL2(): WebGL2RenderingContext | null {
        let ctx: WebGL2RenderingContext | null = null;
        try {
            ctx = this.canvas.getContext('webgl2');
            if (!ctx) {
                throw new Error('WebGL2 not supported');
            }

            // Enable common WebGL features
            ctx.enable(ctx.DEPTH_TEST);
            ctx.enable(ctx.CULL_FACE);
            ctx.cullFace(ctx.BACK);
            ctx.frontFace(ctx.CCW);
        } catch (error) {
            console.error('Failed to initialize WebGL2:', error);
            throw error;
        }
        return ctx;
    }
}
