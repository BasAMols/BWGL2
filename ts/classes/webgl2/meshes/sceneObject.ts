    import { VertexArray, IndexBuffer } from '../buffer';
import { ShaderManager } from '../shaderManager';
import { glob } from '../../../game';
import { Matrix4 } from '../../util/math/matrix4';

export interface SceneObjectData {
    vao: VertexArray;
    indexBuffer?: IndexBuffer;
    shaderManager: ShaderManager;
    modelMatrix: Matrix4;
    drawMode: number;
    drawCount: number;
    drawType?: number;
}

export class SceneObject implements SceneObjectData {
    public readonly vao: VertexArray;
    public readonly indexBuffer?: IndexBuffer;
    public readonly shaderManager: ShaderManager;
    public readonly modelMatrix: Matrix4;
    public readonly drawMode: number;
    public readonly drawCount: number;
    public readonly drawType?: number;

    constructor(data: SceneObjectData) {
        this.vao = data.vao;
        this.indexBuffer = data.indexBuffer;
        this.shaderManager = data.shaderManager;
        this.modelMatrix = data.modelMatrix;
        this.drawMode = data.drawMode;
        this.drawCount = data.drawCount;
        this.drawType = data.drawType;
    }

    public render(viewMatrix: Matrix4, projectionMatrix: Matrix4) {
       // Set uniforms
       this.shaderManager.setUniform('uModelMatrix', this.modelMatrix.mat4 as Float32Array);
       this.shaderManager.setUniform('uViewMatrix', viewMatrix.mat4 as Float32Array);
       this.shaderManager.setUniform('uProjectionMatrix', projectionMatrix.mat4 as Float32Array);

       // Bind VAO
       this.vao.bind();

       // Draw
       if (this.indexBuffer) {
           // Indexed drawing
           glob.ctx.drawElements(
               this.drawMode,
               this.drawCount,
               this.drawType || glob.ctx.UNSIGNED_SHORT,
               0
           );
       } else {
           // Non-indexed drawing
           glob.ctx.drawArrays(
               this.drawMode,
               0,
               this.drawCount
           );
       }

       // Cleanup
       this.vao.unbind();
    }
}