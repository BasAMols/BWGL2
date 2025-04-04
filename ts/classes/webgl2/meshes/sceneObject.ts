import { VertexArray, IndexBuffer } from '../buffer';
import { ShaderManager } from '../shaderManager';
import { glob } from '../../../game';
import { Matrix4 } from '../../util/math/matrix4';
import { v3, Vector3 } from '../../util/math/vector3';
import { Transform } from '../../util/math/transform';
import { Quaternion } from '../../util/math/quaternion';
import { hslToRgb } from '../../util/math/color';
export interface SceneObjectData {
    vao: VertexArray;
    indexBuffer: IndexBuffer;
    shaderManager: ShaderManager;
    drawMode: number;
    drawCount: number;
    drawType: number;
    ignoreLighting: boolean;
}

export interface SceneObjectProps {
    position?: Vector3;
    scale?: Vector3;
    rotation?: Quaternion;
    parent?: SceneObject;
    ignoreLighting?: boolean;
    pickColor?: number;
}

export class SceneObject implements SceneObjectData {
    public readonly vao: VertexArray;
    public readonly indexBuffer: IndexBuffer;
    public readonly shaderManager: ShaderManager;
    public readonly transform: Transform;
    public readonly drawMode: number = glob.ctx.TRIANGLES;
    public readonly drawCount: number;
    public readonly drawType: number = glob.ctx.UNSIGNED_SHORT;
    public readonly ignoreLighting: boolean = false;
    private set pickColor(value: number) {
        if (value === 0) {
            this.pickColorArray = v3(1, 1, 1);
        } else if (value === -1) {
            this.pickColorArray = undefined;
        } else {
            this.pickColorArray = hslToRgb(value/255, 1, 0.5);
        }
    }
    public pickColorArray: Vector3 | undefined;
    public colorMatch(color: Vector3): boolean {
        if (!this.pickColorArray) return false;
        return this.pickColorArray.equals(color);
    }
    public static getAttributeLocation(name: string): number {
        return glob.shaderManager.getAttributeLocation(`a_${name}`);
    }

    constructor(data: Omit<SceneObjectData, 'shaderManager' | 'drawMode' |'drawType'>, props: SceneObjectProps = {}) {
        this.vao = data.vao;
        this.indexBuffer = data.indexBuffer;
        this.shaderManager = glob.shaderManager;
        this.drawCount = data.drawCount;
        this.ignoreLighting = data.ignoreLighting ?? false;
        this.pickColor = props.pickColor ?? 0;

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

        // Set transform uniforms if they exist in the current shader
        if (this.shaderManager.hasUniform('u_modelMatrix')) {
            this.shaderManager.setUniform('u_modelMatrix', modelMatrix.mat4 as Float32Array);
        }
        if (this.shaderManager.hasUniform('u_viewMatrix')) {
            this.shaderManager.setUniform('u_viewMatrix', viewMatrix.mat4 as Float32Array);
        }
        if (this.shaderManager.hasUniform('u_projectionMatrix')) {
            this.shaderManager.setUniform('u_projectionMatrix', projectionMatrix.mat4 as Float32Array);
        }

        // Only calculate and set normal matrix if the shader needs it
        if (this.shaderManager.hasUniform('u_normalMatrix')) {
            const normalMatrix = modelMatrix.clone();
            normalMatrix.invert();
            normalMatrix.transpose();
            const normalMat3 = new Float32Array([
                normalMatrix.mat4[0], normalMatrix.mat4[1], normalMatrix.mat4[2],
                normalMatrix.mat4[4], normalMatrix.mat4[5], normalMatrix.mat4[6],
                normalMatrix.mat4[8], normalMatrix.mat4[9], normalMatrix.mat4[10]
            ]);
            this.shaderManager.setUniform('u_normalMatrix', normalMat3);
        }

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