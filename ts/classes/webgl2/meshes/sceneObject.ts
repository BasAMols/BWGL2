    import { VertexArray, IndexBuffer } from '../buffer';
import { ShaderManager } from '../shaderManager';
import { glob } from '../../../game';
import { m4, Matrix4 } from '../../util/math/matrix4';
import { Vector3, v3 } from '../../util/math/vector3';

export interface SceneObjectData {
    vao: VertexArray;
    indexBuffer: IndexBuffer;
    shaderManager: ShaderManager;
    modelMatrix: Matrix4;
    drawMode: number;
    drawCount: number;
    drawType: number;
}

export interface SceneObjectProps {
    position?: Vector3;
    scale?: Vector3;
    rotation?: Vector3;
}

export class SceneObject implements SceneObjectData {
    public readonly vao: VertexArray;
    public readonly indexBuffer: IndexBuffer;
    public readonly shaderManager: ShaderManager;
    public readonly modelMatrix: Matrix4;
    public readonly drawMode: number = glob.ctx.TRIANGLES;
    public readonly drawCount: number;
    public readonly drawType: number = glob.ctx.UNSIGNED_SHORT;

    constructor(data: Omit<SceneObjectData, 'modelMatrix' | 'shaderManager' | 'drawMode' |'drawType'>, props: SceneObjectProps = {}) {
        this.vao = data.vao;
        this.indexBuffer = data.indexBuffer;
        this.shaderManager = glob.shaderManager;
        this.drawCount = data.drawCount;

        this.modelMatrix = m4();
        this.modelMatrix.translate(props.position || v3(0));
        this.modelMatrix.rotate(props.rotation || v3(0));
        this.modelMatrix.scale(props.scale || v3(1));
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