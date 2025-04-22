import { mat4 } from 'gl-matrix';
import { glob } from '../../game';

export class SceneObject {
    visible: boolean = true;
    material: any; // TODO: Define proper material type

    render(viewMatrix: mat4, projectionMatrix: mat4, lightSpaceMatrices: Float32Array, castsShadow: Float32Array) {
        if (!this.visible) return;

        // Set material properties
        if (this.material) {
            glob.shaderManager.setUniform('u_material.baseColor', this.material.baseColor);
            glob.shaderManager.setUniform('u_material.roughness', this.material.roughness);
            glob.shaderManager.setUniform('u_material.metallic', this.material.metallic);
            glob.shaderManager.setUniform('u_material.emissive', this.material.emissive);

            // Set default values if properties are undefined
            if (!this.material.baseColor) {
                glob.shaderManager.setUniform('u_material.baseColor', [1.0, 1.0, 1.0, 1.0]);
            }
            if (this.material.roughness === undefined) {
                glob.shaderManager.setUniform('u_material.roughness', 0.5);
            }
            if (this.material.metallic === undefined) {
                glob.shaderManager.setUniform('u_material.metallic', 0.1);
            }
        }
    }
} 