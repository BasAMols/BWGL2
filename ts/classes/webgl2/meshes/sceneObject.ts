import { VertexArray, IndexBuffer } from '../buffer';
import { ShaderManager } from '../shaderManager';
import { glob } from '../../../game';
import { Matrix4 } from '../../util/math/matrix4';
import { Vector3 } from '../../util/math/vector3';
import { Transform } from '../../util/math/transform';
import { Quaternion } from '../../util/math/quaternion';

export interface SceneObjectData {
    vao: VertexArray;
    indexBuffer: IndexBuffer;
    shaderManager: ShaderManager;
    drawMode: number;
    drawCount: number;
    drawType: number;
}

export interface SceneObjectProps {
    position?: Vector3;
    scale?: Vector3;
    rotation?: Quaternion;
    parent?: SceneObject;
}

export class SceneObject implements SceneObjectData {
    public readonly vao: VertexArray;
    public readonly indexBuffer: IndexBuffer;
    public readonly shaderManager: ShaderManager;
    public readonly transform: Transform;
    public readonly drawMode: number = glob.ctx.TRIANGLES;
    public readonly drawCount: number;
    public readonly drawType: number = glob.ctx.UNSIGNED_SHORT;

    constructor(data: Omit<SceneObjectData, 'shaderManager' | 'drawMode' |'drawType'>, props: SceneObjectProps = {}) {
        this.vao = data.vao;
        this.indexBuffer = data.indexBuffer;
        this.shaderManager = glob.shaderManager;
        this.drawCount = data.drawCount;

        this.transform = new Transform();
        if (props.position) this.transform.setPosition(props.position);
        if (props.scale) this.transform.setScale(props.scale);
        if (props.rotation) this.transform.setRotation(props.rotation);
        if (props.parent) {
            this.transform.setParent(props.parent.transform);
        }
    }

    public render(viewMatrix: Matrix4, projectionMatrix: Matrix4) {
       // Set uniforms
       this.shaderManager.setUniform('uModelMatrix', this.transform.getWorldMatrix().mat4 as Float32Array);
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