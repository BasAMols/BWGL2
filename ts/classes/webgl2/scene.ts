import { mat4 } from 'gl-matrix';
import { Camera } from './camera';
import { ShaderManager } from './shaderManager';
import { VertexArray, IndexBuffer } from './buffer';

export interface SceneObject {
    vao: VertexArray;
    indexBuffer?: IndexBuffer;
    shaderManager: ShaderManager;
    modelMatrix: mat4;
    drawMode: number;
    drawCount: number;
    drawType?: number;
}

export class Scene {
    private gl: WebGL2RenderingContext;
    private camera: Camera;
    private objects: SceneObject[] = [];
    private clearColor: [number, number, number, number] = [0.0, 0.0, 0.0, 1.0];

    constructor(gl: WebGL2RenderingContext, camera?: Camera) {
        this.gl = gl;
        this.camera = camera || new Camera();
    }

    public add(object: SceneObject): void {
        this.objects.push(object);
    }

    public remove(object: SceneObject): void {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
    }

    public getCamera(): Camera {
        return this.camera;
    }

    public setClearColor(r: number, g: number, b: number, a: number = 1.0): void {
        this.clearColor = [r, g, b, a];
        this.gl.clearColor(r, g, b, a);
    }

    public render(): void {
        // Clear the canvas
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const viewMatrix = this.camera.getViewMatrix();
        const projectionMatrix = this.camera.getProjectionMatrix();

        // Render each object
        for (const object of this.objects) {
            // Set uniforms
            object.shaderManager.setUniform('uModelMatrix', object.modelMatrix as Float32Array);
            object.shaderManager.setUniform('uViewMatrix', viewMatrix as Float32Array);
            object.shaderManager.setUniform('uProjectionMatrix', projectionMatrix as Float32Array);

            // Bind VAO
            object.vao.bind();

            // Draw
            if (object.indexBuffer) {
                // Indexed drawing
                this.gl.drawElements(
                    object.drawMode,
                    object.drawCount,
                    object.drawType || this.gl.UNSIGNED_SHORT,
                    0
                );
            } else {
                // Non-indexed drawing
                this.gl.drawArrays(
                    object.drawMode,
                    0,
                    object.drawCount
                );
            }

            // Cleanup
            object.vao.unbind();
        }
    }

    public dispose(): void {
        // Clean up resources
        for (const object of this.objects) {
            object.vao.dispose();
            object.indexBuffer?.dispose();
        }
        this.objects = [];
    }
} 