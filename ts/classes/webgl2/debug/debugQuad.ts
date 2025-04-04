import { VertexArray, VertexBuffer, IndexBuffer } from '../buffer';
import { ShaderManager } from '../shaderManager';

// Vertex shader for debug quad
const debugQuadVsSource = `#version 300 es
precision highp float;

in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;

void main() {
    v_texCoord = a_texCoord;
    gl_Position = vec4(a_position, 0.0, 1.0);
}`;

// Fragment shader for debug quad
const debugQuadFsSource = `#version 300 es
precision highp float;

uniform sampler2D u_depthMap;
uniform int u_textureType;  // 0 = color, 1 = depth
in vec2 v_texCoord;
out vec4 fragColor;

void main() {
    if (u_textureType == 1) {
        // For depth textures
        float depthValue = texture(u_depthMap, v_texCoord).r;
        // Visualize depth values more clearly by using a non-linear mapping
        float visualDepth = pow(depthValue, 0.5); // Use square root to make differences more visible
        fragColor = vec4(vec3(visualDepth), 1.0);
    } else {
        // For color textures
        fragColor = texture(u_depthMap, v_texCoord);
    }
}`;

export class DebugQuad {
    private vao: VertexArray;
    private vertexBuffer: VertexBuffer;
    private texCoordBuffer: VertexBuffer;
    private indexBuffer: IndexBuffer;
    private drawCount: number;

    constructor(
        private gl: WebGL2RenderingContext,
        private shaderManager: ShaderManager,
        // Position and size in normalized device coordinates (-1 to 1)
        private x: number = -1.0,
        private y: number = -1.0,
        private width: number = 0.5,
        private height: number = 0.5
    ) {
        // Create shader program
        this.shaderManager.loadShaderProgram('debug_quad', debugQuadVsSource, debugQuadFsSource);

        // Create buffers and VAO
        this.vao = new VertexArray(this.gl);
        this.vertexBuffer = new VertexBuffer(this.gl);
        this.texCoordBuffer = new VertexBuffer(this.gl);
        this.indexBuffer = new IndexBuffer(this.gl);

        // Initialize geometry
        this.setupGeometry();
    }

    private setupGeometry(): void {
        const positions = new Float32Array([
            this.x, this.y,                    // bottom-left
            this.x + this.width, this.y,       // bottom-right
            this.x + this.width, this.y + this.height, // top-right
            this.x, this.y + this.height       // top-left
        ]);

        const texCoords = new Float32Array([
            0.0, 0.0,  // bottom-left
            1.0, 0.0,  // bottom-right
            1.0, 1.0,  // top-right
            0.0, 1.0   // top-left
        ]);

        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);

        this.vao.bind();

        // Position buffer
        this.vertexBuffer.setData(positions);
        this.vao.setAttributePointer(
            this.shaderManager.getAttributeLocation('a_position'),
            2,
            this.gl.FLOAT,
            false,
            0,
            0
        );

        // Texture coordinate buffer
        this.texCoordBuffer.setData(texCoords);
        this.vao.setAttributePointer(
            this.shaderManager.getAttributeLocation('a_texCoord'),
            2,
            this.gl.FLOAT,
            false,
            0,
            0
        );

        // Index buffer
        this.indexBuffer.setData(indices);
        this.drawCount = indices.length;
    }

    render(texture: WebGLTexture, isDepthTexture: boolean = false) {
        this.shaderManager.useProgram('debug_quad');
        
        // Bind the texture
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.shaderManager.setUniform('u_depthMap', 0);
        
        // Set texture type
        this.shaderManager.setUniform('u_textureType', isDepthTexture ? 1 : 0);

        // Disable depth testing for the debug quad
        this.gl.disable(this.gl.DEPTH_TEST);
        
        // Render the quad
        this.vao.bind();
        this.gl.drawElements(this.gl.TRIANGLES, this.drawCount, this.gl.UNSIGNED_SHORT, 0);
        
        // Re-enable depth testing
        this.gl.enable(this.gl.DEPTH_TEST);
    }
} 