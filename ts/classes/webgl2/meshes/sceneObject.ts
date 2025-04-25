import { VertexArray, IndexBuffer } from '../buffer';
import { ShaderManager } from '../shaderManager';
import { glob } from '../../../game';
import { Matrix4 } from '../../util/math/matrix4';
import { v3, Vector3 } from '../../util/math/vector3';
import { Transform } from '../../util/math/transform';
import { Quaternion } from '../../util/math/quaternion';
import { hslToRgb } from '../../util/math/color';
import { Material } from '../material';
import { TickerReturnData } from '../../ticker';
import { Scene } from '../scene';

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
    material?: Material;
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
    public readonly material?: Material;
    public parent?: SceneObject;
    public scene?: Scene;
    public visible: boolean = true;
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
        this.material = props.material;

        this.transform = new Transform();
        if (props.position) this.transform.setPosition(props.position);
        if (props.scale) this.transform.setScale(props.scale);
        if (props.rotation) this.transform.setRotation(props.rotation);
        if (props.parent) {
            this.transform.setParent(props.parent.transform);
        }
    }

    public render(obj: TickerReturnData, viewMatrix: Matrix4, projectionMatrix: Matrix4) {
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
        
        // Apply material settings if available
        if (this.material && this.shaderManager.hasUniform('u_material.baseColor')) {
            // Set base color
            this.shaderManager.setUniform('u_material.baseColor', new Float32Array(this.material.baseColor.vec));
            
            // Set PBR properties
            this.shaderManager.setUniform('u_material.roughness', this.material.roughness);
            this.shaderManager.setUniform('u_material.metallic', this.material.metallic);
            this.shaderManager.setUniform('u_material.ambientOcclusion', this.material.ambientOcclusion);
            this.shaderManager.setUniform('u_material.emissive', new Float32Array(this.material.emissive.vec));
            
            // Set texture flags
            this.shaderManager.setUniform('u_material.hasAlbedoMap', this.material.albedoMap ? 1 : 0);
            this.shaderManager.setUniform('u_material.hasNormalMap', this.material.normalMap ? 1 : 0);
            this.shaderManager.setUniform('u_material.hasMetallicMap', this.material.metallicMap ? 1 : 0);
            this.shaderManager.setUniform('u_material.hasRoughnessMap', this.material.roughnessMap ? 1 : 0);
            this.shaderManager.setUniform('u_material.hasAoMap', this.material.aoMap ? 1 : 0);
            this.shaderManager.setUniform('u_material.hasEmissiveMap', this.material.emissiveMap ? 1 : 0);
            this.shaderManager.setUniform('u_material.hasEmissiveStrengthMap', this.material.emissiveStrengthMap ? 1 : 0);

            // Bind textures if available
            if (this.material.albedoMap) {
                glob.ctx.activeTexture(glob.ctx.TEXTURE0);
                glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.albedoMap);
                this.shaderManager.setUniform('u_material.albedoMap', 0);
            }
            
            if (this.material.normalMap) {
                glob.ctx.activeTexture(glob.ctx.TEXTURE1);
                glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.normalMap);
                this.shaderManager.setUniform('u_material.normalMap', 1);
            }
            
            if (this.material.metallicMap) {
                glob.ctx.activeTexture(glob.ctx.TEXTURE2);
                glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.metallicMap);
                this.shaderManager.setUniform('u_material.metallicMap', 2);
            }
            
            if (this.material.roughnessMap) {
                glob.ctx.activeTexture(glob.ctx.TEXTURE3);
                glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.roughnessMap);
                this.shaderManager.setUniform('u_material.roughnessMap', 3);
            }
            
            if (this.material.aoMap) {
                glob.ctx.activeTexture(glob.ctx.TEXTURE4);
                glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.aoMap);
                this.shaderManager.setUniform('u_material.aoMap', 4);
            }
            
            if (this.material.emissiveMap) {
                glob.ctx.activeTexture(glob.ctx.TEXTURE5);
                glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.emissiveMap);
                this.shaderManager.setUniform('u_material.emissiveMap', 5);
            }
            
            if (this.material.emissiveStrengthMap) {
                glob.ctx.activeTexture(glob.ctx.TEXTURE6);
                glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, this.material.emissiveStrengthMap);
                this.shaderManager.setUniform('u_material.emissiveStrengthMap', 6);
            }
        }

        // Bind VAO
        this.vao.bind();

        // Draw
        if (this.indexBuffer) {
            // Indexed drawing
            glob.ctx.drawElements(
                this.drawMode,
                this.drawCount,
                this.drawType || glob.ctx.UNSIGNED_INT,
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

    public build() {
    }
}