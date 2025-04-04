import { MeshData } from '../types';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { SceneObject } from './sceneObject';
import { Material } from '../material';
import { vec3 } from 'gl-matrix';
import { glob } from '../../../game';
import { Vector2 } from '../../util/math/vector2';
import { v3 } from '../../util/math/vector3';

export interface PlaneProps extends BaseMeshProps {
    material?: Material;
    texture?: string;
    flipNormal?: boolean;
}

export class Plane extends BaseMesh {
    private static vertices: Float32Array = new Float32Array([
        // Single face (square)
        -0.5, 0.0, -0.5,  // bottom-left
        0.5, 0.0, -0.5,  // bottom-right
        0.5, 0.0, 0.5,  // top-right
        -0.5, 0.0, 0.5   // top-left
    ]);

    private static generateIndices(flipNormal: boolean): Uint16Array {
        return new Uint16Array(
            flipNormal
                ? [0, 1, 2, 2, 3, 0]     // clockwise winding for bottom visibility
                : [0, 2, 1, 0, 3, 2]      // counter-clockwise winding for top visibility
        );
    }

    private static generateNormals(flipNormal: boolean): Float32Array {
        const normalY = flipNormal ? -1.0 : 1.0;
        return new Float32Array([
            0.0, normalY, 0.0,
            0.0, normalY, 0.0,
            0.0, normalY, 0.0,
            0.0, normalY, 0.0
        ]);
    }

    private static texCoords: Float32Array = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ]);

    private static generateColors(material?: Material): Float32Array {
        const defaultColor = vec3.fromValues(0.8, 0.8, 0.8); // Default to light gray
        const color = material ? material.diffuse.vec : defaultColor;

        // Four vertices need the same color
        return new Float32Array([
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2]
        ]);
    }

    private static createMeshData(props: Omit<PlaneProps, 'scale'> = {}): MeshData {
        return {
            vertices: this.vertices,
            indices: this.generateIndices(props.flipNormal || false),
            normals: this.generateNormals(props.flipNormal || false),
            texCoords: this.texCoords,
            colors: this.generateColors(props.material)
        };
    }

    public static create(props: Omit<PlaneProps, 'scale'> & { scale?: Vector2 } = {}): SceneObject {
        // Create default material if none provided
        if (!props.material && !props.texture) {
            props.material = new Material();
        }

        const meshData = this.createMeshData(props);
        const sceneObject = this.createSceneObject(meshData, {...props, scale: v3(props.scale?.x ?? 1, 1, props.scale?.y ?? 1)});

        // Set material uniforms
        if (props.material) {
            // Set material properties
            glob.shaderManager.setUniform('u_material.ambient', new Float32Array(props.material.ambient.vec));
            glob.shaderManager.setUniform('u_material.diffuse', new Float32Array(props.material.diffuse.vec));
            glob.shaderManager.setUniform('u_material.specular', new Float32Array(props.material.specular.vec));
            glob.shaderManager.setUniform('u_material.shininess', props.material.shininess);

            if (props.material.diffuseMap) {
                glob.shaderManager.setUniform('u_useTexture', 1);
                // Bind texture to texture unit 0
                glob.ctx.activeTexture(glob.ctx.TEXTURE0);
                glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, props.material.diffuseMap);
                glob.shaderManager.setUniform('u_material.diffuseMap', 0); // Use texture unit 0
            } else {
                glob.shaderManager.setUniform('u_useTexture', 0);
            }
        }

        return sceneObject;
    }
} 