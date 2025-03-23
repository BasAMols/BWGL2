import { VertexBuffer, IndexBuffer, VertexArray } from './buffer';
import { ShaderManager } from './shaderManager';
import { fragmentShaderSource } from './shaders/fragmentShaderSource';
import { vertexShaderSource } from './shaders/vertexShaderSource';
import { shadowVertexShaderSource } from './shaders/shadowVertexShader';

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

        // Load and use shader programs
        this.shaderManager.loadShaderProgram('basic', vertexShaderSource, fragmentShaderSource);
        this.shaderManager.loadShaderProgram('shadow', shadowVertexShaderSource, `#version 300 es
            precision highp float;
            out vec4 fragColor;
            void main() {
                // Only depth values are written
            }
        `);
        this.shaderManager.useProgram('basic');

        // Initialize light arrays
        const numLights = 10;
        const types = new Int32Array(numLights);
        const positions = new Float32Array(numLights * 3);
        const directions = new Float32Array(numLights * 3);
        const colors = new Float32Array(numLights * 3);
        const intensities = new Float32Array(numLights);
        const constants = new Float32Array(numLights);
        const linears = new Float32Array(numLights);
        const quadratics = new Float32Array(numLights);
        const cutOffs = new Float32Array(numLights);
        const outerCutOffs = new Float32Array(numLights);

        // Initialize all lights as inactive
        types.fill(-1);
        constants.fill(1.0); // Default attenuation constant

        // Set default uniform values
        this.shaderManager.setUniform('uNumLights', 0);
        this.shaderManager.setUniform('uLightTypes', types);
        this.shaderManager.setUniform('uLightPositions', positions);
        this.shaderManager.setUniform('uLightDirections', directions);
        this.shaderManager.setUniform('uLightColors', colors);
        this.shaderManager.setUniform('uLightIntensities', intensities);
        this.shaderManager.setUniform('uLightConstants', constants);
        this.shaderManager.setUniform('uLightLinears', linears);
        this.shaderManager.setUniform('uLightQuadratics', quadratics);
        this.shaderManager.setUniform('uLightCutOffs', cutOffs);
        this.shaderManager.setUniform('uLightOuterCutOffs', outerCutOffs);

        // Set default material values
        this.shaderManager.setUniform('uMaterial.ambient', new Float32Array([0.2, 0.2, 0.2]));
        this.shaderManager.setUniform('uMaterial.diffuse', new Float32Array([0.8, 0.8, 0.8]));
        this.shaderManager.setUniform('uMaterial.specular', new Float32Array([1.0, 1.0, 1.0]));
        this.shaderManager.setUniform('uMaterial.shininess', 32.0);
        this.shaderManager.setUniform('uUseTexture', 0);

        this.shaderManager.setUniform('uViewPos', new Float32Array([3.0, 2.0, 3.0]));

        // Enable depth testing and backface culling
        this.ctx.enable(this.ctx.DEPTH_TEST);
        this.ctx.enable(this.ctx.CULL_FACE);
    }

    private initializeWebGL2(): WebGL2RenderingContext {
        const ctx = this.canvas.getContext('webgl2');
        if (!ctx) {
            throw new Error('WebGL 2 not supported');
        }
        return ctx;
    }
}
