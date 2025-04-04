
import { vec3, mat4 } from 'gl-matrix';
import { Game } from './game';

document.addEventListener("DOMContentLoaded", async () => {
    const g = new Game();
    document.body.appendChild(g.renderer.dom);
});


// Vertex shader for shadow mapping
const shadowVsSource = `#version 300 es
precision highp float;

in vec3 aPosition;

uniform mat4 uLightSpace;
uniform mat4 uModel;

void main() {
    gl_Position = uLightSpace * uModel * vec4(aPosition, 1.0);
}`;

const shadowFsSource = `#version 300 es
precision highp float;
out vec4 fragColor;

void main() {
    // Only depth information is written
}`;

// Main rendering shaders
const vsSource = `#version 300 es
precision highp float;

in vec3 aPosition;
in vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uLightSpace;

out vec3 vNormal;
out vec3 vFragPos;
out vec4 vFragPosLightSpace;

void main() {
    vec4 worldPos = uModel * vec4(aPosition, 1.0);
    vFragPos = worldPos.xyz;
    vNormal = mat3(transpose(inverse(uModel))) * aNormal;
    vFragPosLightSpace = uLightSpace * worldPos;
    gl_Position = uProjection * uView * worldPos;
}`;

const fsSource = `#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vFragPos;
in vec4 vFragPosLightSpace;

uniform vec3 uLightPos;
uniform vec3 uViewPos;
uniform sampler2D uShadowMap;

out vec4 fragColor;

float calculateShadow(vec4 fragPosLightSpace) {
    // Perspective divide
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // Transform to [0,1] range
    projCoords = projCoords * 0.5 + 0.5;
    
    float closestDepth = texture(uShadowMap, projCoords.xy).r;
    float currentDepth = projCoords.z;
    
    float bias = 0.005;
    return currentDepth - bias > closestDepth ? 1.0 : 0.0;
}

void main() {
    vec3 color = vec3(0.7);
    vec3 normal = normalize(vNormal);
    vec3 lightColor = vec3(1.0);
    
    // Ambient
    vec3 ambient = 0.2 * color;
    
    // Diffuse
    vec3 lightDir = normalize(uLightPos - vFragPos);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;
    
    // Specular
    vec3 viewDir = normalize(uViewPos - vFragPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = spec * lightColor;
    
    float shadow = calculateShadow(vFragPosLightSpace);
    vec3 lighting = (ambient + (1.0 - shadow) * (diffuse + specular)) * color;
    
    fragColor = vec4(lighting, 1.0);
}`;

class ShadowDemo {
    private gl: WebGL2RenderingContext;
    private shadowProgram: WebGLProgram;
    private mainProgram: WebGLProgram;
    private shadowFramebuffer: WebGLFramebuffer;
    private shadowMap: WebGLTexture;
    private cubeVAO: WebGLVertexArrayObject;
    private planeVAO: WebGLVertexArrayObject;
    private shadowMapSize = 1024;
    private debugQuadVAO: WebGLVertexArrayObject;
    private debugProgram: WebGLProgram;
    private startTime: number;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext('webgl2')!;
        if (!this.gl) {
            throw new Error('WebGL 2 not supported');
        }
        this.startTime = performance.now();

        // Enable depth testing
        this.gl.enable(this.gl.DEPTH_TEST);

        // Create shader programs
        this.shadowProgram = this.createShaderProgram(shadowVsSource, shadowFsSource);
        this.mainProgram = this.createShaderProgram(vsSource, fsSource);

        // Create shadow map texture and framebuffer
        [this.shadowFramebuffer, this.shadowMap] = this.createShadowMap();

        // Create geometry
        this.cubeVAO = this.createCube();
        this.planeVAO = this.createPlane();

        // Create debug quad and shader program
        this.debugQuadVAO = this.createDebugQuad();
        this.debugProgram = this.createShaderProgram(
            // Vertex shader for debug quad
            `#version 300 es
            precision highp float;
            
            in vec2 aPosition;
            in vec2 aTexCoord;
            out vec2 vTexCoord;
            
            void main() {
                vTexCoord = aTexCoord;
                gl_Position = vec4(aPosition, 0.0, 1.0);
            }`,
            // Fragment shader for debug quad
            `#version 300 es
            precision highp float;
            
            uniform sampler2D uDepthMap;
            in vec2 vTexCoord;
            out vec4 fragColor;
            
            void main() {
                float depthValue = texture(uDepthMap, vTexCoord).r;
                fragColor = vec4(vec3(depthValue), 1.0);
            }`
        );
    }

    private createShaderProgram(vsSource: string, fsSource: string): WebGLProgram {
        const gl = this.gl;
        const vs = gl.createShader(gl.VERTEX_SHADER)!;
        const fs = gl.createShader(gl.FRAGMENT_SHADER)!;

        gl.shaderSource(vs, vsSource);
        gl.shaderSource(fs, fsSource);
        gl.compileShader(vs);
        gl.compileShader(fs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vs)!);
        }
        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fs)!);
        }

        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program)!);
        }

        return program;
    }

    private createShadowMap(): [WebGLFramebuffer, WebGLTexture] {
        const gl = this.gl;
        
        // Create and set up texture
        const texture = gl.createTexture()!;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.DEPTH_COMPONENT32F,
            this.shadowMapSize,
            this.shadowMapSize,
            0,
            gl.DEPTH_COMPONENT,
            gl.FLOAT,
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // Create and set up framebuffer
        const framebuffer = gl.createFramebuffer()!;
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.TEXTURE_2D,
            texture,
            0
        );
        gl.drawBuffers([gl.NONE]);
        gl.readBuffer(gl.NONE);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
            throw new Error('Framebuffer is not complete');
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return [framebuffer, texture];
    }

    private createCube(): WebGLVertexArrayObject {
        const gl = this.gl;
        const positions = new Float32Array([
            // Front face
            -0.5, -0.5,  0.5,
             0.5, -0.5,  0.5,
             0.5,  0.5,  0.5,
            -0.5,  0.5,  0.5,
            // Back face
            -0.5, -0.5, -0.5,
            -0.5,  0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5, -0.5, -0.5,
            // Top face
            -0.5,  0.5, -0.5,
            -0.5,  0.5,  0.5,
             0.5,  0.5,  0.5,
             0.5,  0.5, -0.5,
            // Bottom face
            -0.5, -0.5, -0.5,
             0.5, -0.5, -0.5,
             0.5, -0.5,  0.5,
            -0.5, -0.5,  0.5,
            // Right face
             0.5, -0.5, -0.5,
             0.5,  0.5, -0.5,
             0.5,  0.5,  0.5,
             0.5, -0.5,  0.5,
            // Left face
            -0.5, -0.5, -0.5,
            -0.5, -0.5,  0.5,
            -0.5,  0.5,  0.5,
            -0.5,  0.5, -0.5,
        ]);

        const normals = new Float32Array([
            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
        ]);

        const indices = new Uint16Array([
            0,  1,  2,    0,  2,  3,  // Front
            4,  5,  6,    4,  6,  7,  // Back
            8,  9,  10,   8,  10, 11, // Top
            12, 13, 14,   12, 14, 15, // Bottom
            16, 17, 18,   16, 18, 19, // Right
            20, 21, 22,   20, 22, 23  // Left
        ]);

        const vao = gl.createVertexArray()!;
        gl.bindVertexArray(vao);

        // Position buffer
        const positionBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        // Normal buffer
        const normalBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

        // Index buffer
        const indexBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        return vao;
    }

    private createPlane(): WebGLVertexArrayObject {
        const gl = this.gl;
        const positions = new Float32Array([
            -5.0, 0.0, -5.0,
             5.0, 0.0, -5.0,
             5.0, 0.0,  5.0,
            -5.0, 0.0,  5.0,
        ]);

        const normals = new Float32Array([
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
        ]);

        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
        ]);

        const vao = gl.createVertexArray()!;
        gl.bindVertexArray(vao);

        // Position buffer
        const positionBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        // Normal buffer
        const normalBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

        // Index buffer
        const indexBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        return vao;
    }

    private createDebugQuad(): WebGLVertexArrayObject {
        const gl = this.gl;
        
        // Create a quad in the bottom-left corner
        // Using normalized device coordinates (-1 to 1)
        const positions = new Float32Array([
            -1.0, -1.0,  // bottom-left
            -0.5, -1.0,  // bottom-right
            -0.5, -0.5,  // top-right
            -1.0, -0.5   // top-left
        ]);

        const texCoords = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ]);

        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);

        const vao = gl.createVertexArray()!;
        gl.bindVertexArray(vao);

        // Position buffer
        const positionBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        // Texture coordinate buffer
        const texCoordBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        // Index buffer
        const indexBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        gl.bindVertexArray(null);
        return vao;
    }

    render() {
        const gl = this.gl;

        // Calculate cube position based on time
        const elapsedTime = (performance.now() - this.startTime) / 1000; // Convert to seconds
        const xOffset = Math.sin(elapsedTime) * 2.0; // 2.0 is the amplitude

        // Light position and view
        const lightPos = vec3.fromValues(5.0, 5.0, 5.0);
        const lightView = mat4.create();
        mat4.lookAt(lightView, lightPos, [0, 0, 0], [0, 1, 0]);
        const lightProjection = mat4.create();
        mat4.ortho(lightProjection, -10, 10, -10, 10, 1, 20);
        const lightSpaceMatrix = mat4.create();
        mat4.multiply(lightSpaceMatrix, lightProjection, lightView);

        // Camera position and view
        const viewPos = vec3.fromValues(3.0, 3.0, 5.0);
        const view = mat4.create();
        mat4.lookAt(view, viewPos, [0, 0, 0], [0, 1, 0]);
        const projection = mat4.create();
        mat4.perspective(projection, 45 * Math.PI / 180, gl.canvas.width / gl.canvas.height, 0.1, 100.0);

        // 1. Render to shadow map
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadowFramebuffer);
        gl.viewport(0, 0, this.shadowMapSize, this.shadowMapSize);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        gl.useProgram(this.shadowProgram);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shadowProgram, 'uLightSpace'), false, lightSpaceMatrix);

        // Render cube to shadow map with animation
        let model = mat4.create();
        mat4.translate(model, model, [xOffset, 1, 0]);  // Use animated x position
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shadowProgram, 'uModel'), false, model);
        gl.bindVertexArray(this.cubeVAO);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        // Render plane to shadow map
        model = mat4.create();
        gl.uniformMatrix4fv(gl.getUniformLocation(this.shadowProgram, 'uModel'), false, model);
        gl.bindVertexArray(this.planeVAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        // 2. Render scene
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0, 0, 0, 1);

        gl.useProgram(this.mainProgram);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.mainProgram, 'uView'), false, view);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.mainProgram, 'uProjection'), false, projection);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.mainProgram, 'uLightSpace'), false, lightSpaceMatrix);
        gl.uniform3fv(gl.getUniformLocation(this.mainProgram, 'uLightPos'), lightPos);
        gl.uniform3fv(gl.getUniformLocation(this.mainProgram, 'uViewPos'), viewPos);

        // Bind shadow map
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.shadowMap);
        gl.uniform1i(gl.getUniformLocation(this.mainProgram, 'uShadowMap'), 0);

        // Render cube with animation
        model = mat4.create();
        mat4.translate(model, model, [xOffset, 1, 0]);  // Use animated x position
        gl.uniformMatrix4fv(gl.getUniformLocation(this.mainProgram, 'uModel'), false, model);
        gl.bindVertexArray(this.cubeVAO);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

        // Render plane
        model = mat4.create();
        gl.uniformMatrix4fv(gl.getUniformLocation(this.mainProgram, 'uModel'), false, model);
        gl.bindVertexArray(this.planeVAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        // After rendering the main scene, render the debug quad
        gl.useProgram(this.debugProgram);
        
        // Bind the shadow map texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.shadowMap);
        gl.uniform1i(gl.getUniformLocation(this.debugProgram, 'uDepthMap'), 0);

        // Disable depth testing for the debug quad
        gl.disable(gl.DEPTH_TEST);
        
        // Render the debug quad
        gl.bindVertexArray(this.debugQuadVAO);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

        // Re-enable depth testing
        gl.enable(gl.DEPTH_TEST);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'z-index: 2; position: absolute;';
    document.body.appendChild(canvas);

    const demo = new ShadowDemo(canvas);
    
    function animate() {
        demo.render();
        // console.log('test');
        
        requestAnimationFrame(animate);
    }
    animate();
    let isVisible = true;
    document.body.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            isVisible = !isVisible;
            canvas.style.display = isVisible ? 'block' : 'none';
        }
    });

});