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

    public static getAttributeLocation(name: string): number {
        return glob.shaderManager.getAttributeLocation(`a_${name}`);
    }

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
        const modelMatrix = this.transform.getWorldMatrix();

        // Set uniforms
        this.shaderManager.setUniform('u_modelMatrix', modelMatrix.mat4 as Float32Array);
        this.shaderManager.setUniform('u_viewMatrix', viewMatrix.mat4 as Float32Array);
        this.shaderManager.setUniform('u_projectionMatrix', projectionMatrix.mat4 as Float32Array);

        // Calculate and set normal matrix (inverse transpose of model matrix)
        const normalMatrix = modelMatrix.clone();
        normalMatrix.invert();
        normalMatrix.transpose();
        const normalMat3 = new Float32Array([
            normalMatrix.mat4[0], normalMatrix.mat4[1], normalMatrix.mat4[2],
            normalMatrix.mat4[4], normalMatrix.mat4[5], normalMatrix.mat4[6],
            normalMatrix.mat4[8], normalMatrix.mat4[9], normalMatrix.mat4[10]
        ]);
        this.shaderManager.setUniform('u_normalMatrix', normalMat3);

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