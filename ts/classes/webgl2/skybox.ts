import { glob } from '../../game';
import { VertexArray } from './buffer';
import { skyboxVertexShader } from './shaders/skyboxVertexShader';
import { skyboxFragmentShader } from './shaders/skyboxFragmentShader';
import { EnvironmentMap } from './environmentMap';

export class Skybox {
    private vao: VertexArray;
    private environmentMap: EnvironmentMap | null = null;

    constructor() {
        // Create and load skybox shader program
        try {
            // Try to use the program first to see if it exists
            glob.shaderManager.useProgram('skybox');
        } catch (error) {
            // Program doesn't exist, create it
            glob.shaderManager.loadShaderProgram('skybox', skyboxVertexShader, skyboxFragmentShader);
        }

        // Create a cube for the skybox
        this.vao = new VertexArray(glob.ctx);
        this.initCube();
    }

    private initCube(): void {
        // Define the vertices for a unit cube centered at the origin
        const vertices = new Float32Array([
            // Positions          
            -1.0,  1.0, -1.0,
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,

            -1.0, -1.0,  1.0,
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            -1.0, -1.0,  1.0,

             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,

            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0
        ]);

        // Create and bind vertex buffer
        this.vao.bind();
        
        // Create a position buffer with attribute 0
        const positionBuffer = glob.ctx.createBuffer();
        glob.ctx.bindBuffer(glob.ctx.ARRAY_BUFFER, positionBuffer);
        glob.ctx.bufferData(glob.ctx.ARRAY_BUFFER, vertices, glob.ctx.STATIC_DRAW);
        glob.ctx.enableVertexAttribArray(0);
        glob.ctx.vertexAttribPointer(0, 3, glob.ctx.FLOAT, false, 0, 0);
        
        this.vao.unbind();
    }

    public setEnvironmentMap(environmentMap: EnvironmentMap): void {
        this.environmentMap = environmentMap;
    }

    public render(viewMatrix: Float32Array, projectionMatrix: Float32Array): void {
        // Skip if no environment map is set
        if (!this.environmentMap) return;

        const gl = glob.ctx;

        // Disable depth writing but enable depth testing
        gl.depthMask(false);
        gl.depthFunc(gl.LEQUAL); // Important for skybox to render at the back

        // Use skybox shader program
        glob.shaderManager.useProgram('skybox');

        // Set view and projection matrices
        glob.shaderManager.setUniform('u_viewMatrix', viewMatrix);
        glob.shaderManager.setUniform('u_projectionMatrix', projectionMatrix);

        // Bind the environment map to texture unit 0
        gl.activeTexture(gl.TEXTURE0);
        this.environmentMap.bindCubemap(0);
        glob.shaderManager.setUniform('u_environmentMap', 0);

        // Render the cube
        this.vao.bind();
        gl.drawArrays(gl.TRIANGLES, 0, 36);
        this.vao.unbind();

        // Reset depth mask
        gl.depthMask(true);
        gl.depthFunc(gl.LESS);
    }

    public dispose(): void {
        this.vao.dispose();
    }
} 