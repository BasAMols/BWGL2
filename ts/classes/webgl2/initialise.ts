import { VertexBuffer, IndexBuffer, VertexArray } from './buffer';
import { ShaderManager } from './shaderManager';
import { fragmentShaderSource } from './shaders/fragmentShaderSource';
import { vertexShaderSource } from './shaders/vertexShaderSource';
import { shadowVertexShaderSource } from './shaders/shadowVertexShader';
import { pbrVertexShader } from './shaders/pbrVertexShader';
import { pbrFragmentShader } from './shaders/pbrFragmentShader';
import { debugDepthVertexShader, debugDepthFragmentShader } from './shaders/debugDepthShader';

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
        this.shaderManager.loadShaderProgram('pbr', pbrVertexShader, pbrFragmentShader);
        this.shaderManager.loadShaderProgram('shadow', shadowVertexShaderSource, `#version 300 es
            precision highp float;
            out vec4 fragColor;
            void main() {
                // Explicitly output a color (not used) but required for valid fragment shader
                // The actual depth is written automatically by WebGL
                fragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `);
        
        // Add debug shader for shadow map visualization
        this.shaderManager.loadShaderProgram('debug', debugDepthVertexShader, debugDepthFragmentShader);
        
        // Use PBR shader as default
        this.shaderManager.useProgram('pbr');

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
        this.shaderManager.setUniform('u_numLights', 0);
        this.shaderManager.setUniform('u_lightTypes', types);
        this.shaderManager.setUniform('u_lightPositions', positions);
        this.shaderManager.setUniform('u_lightDirections', directions);
        this.shaderManager.setUniform('u_lightColors', colors);
        this.shaderManager.setUniform('u_lightIntensities', intensities);
        this.shaderManager.setUniform('u_lightConstants', constants);
        this.shaderManager.setUniform('u_lightLinears', linears);
        this.shaderManager.setUniform('u_lightQuadratics', quadratics);
        this.shaderManager.setUniform('u_lightCutOffs', cutOffs);
        this.shaderManager.setUniform('u_lightOuterCutOffs', outerCutOffs);

        // Initialize shadow mapping arrays
        const castsShadow = new Int32Array(numLights);
        const lightSpaceMatrices = new Float32Array(numLights * 16); // 4x4 matrices
        castsShadow.fill(1); // Default to not casting shadows

        this.shaderManager.setUniform('u_castsShadow', castsShadow);
        this.shaderManager.setUniform('u_lightSpaceMatrices', lightSpaceMatrices);

        // Enhance ambient lighting and gamma correction
        this.shaderManager.setUniform('u_material.baseColor', new Float32Array([0.8, 0.8, 0.8]));
        this.shaderManager.setUniform('u_material.roughness', 0.5);
        this.shaderManager.setUniform('u_material.metallic', 0.0);
        this.shaderManager.setUniform('u_material.ambientOcclusion', 1.0);
        this.shaderManager.setUniform('u_material.emissive', new Float32Array([0.0, 0.0, 0.0]));
        
        // Initialize texture flags to false by default
        this.shaderManager.setUniform('u_material.hasAlbedoMap', 0);
        this.shaderManager.setUniform('u_material.hasNormalMap', 0);
        this.shaderManager.setUniform('u_material.hasMetallicMap', 0);
        this.shaderManager.setUniform('u_material.hasRoughnessMap', 0);
        this.shaderManager.setUniform('u_material.hasAoMap', 0);
        this.shaderManager.setUniform('u_material.hasEmissiveMap', 0);

        // Initialize environment mapping uniforms
        this.shaderManager.setUniform('u_useEnvironmentMap', 0);
        this.shaderManager.setUniform('u_environmentMap', 11);
        this.shaderManager.setUniform('u_irradianceMap', 12);
        this.shaderManager.setUniform('u_prefilterMap', 13);
        this.shaderManager.setUniform('u_brdfLUT', 14);

        this.ctx.enable(this.ctx.DEPTH_TEST);
        // this.ctx.enable(this.ctx.CULL_FACE); // temperary disable culling
        this.ctx.enable(this.ctx.BLEND);
        this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
        
    }

    private initializeWebGL2(): WebGL2RenderingContext {
        const ctx = this.canvas.getContext('webgl2');
        if (!ctx) {
            throw new Error('WebGL 2 not supported');
        }
        return ctx;
    }
}
