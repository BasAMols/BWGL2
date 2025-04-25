import { MeshData } from './types';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { SceneObject } from './sceneObject';
import { Material } from '../material';
import { vec3 } from 'gl-matrix';
import { Vector2 } from '../../util/math/vector2';
import { v3 } from '../../util/math/vector3';

export interface PlaneProps extends BaseMeshProps {
    material?: Material;
    texture?: string;
    flipNormal?: boolean;
}

export class PlaneMesh extends BaseMesh {
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

    // Generate tangents for normal mapping
    private static generateTangents(): Float32Array {
        // For a plane, tangents are aligned with x-axis 
        return new Float32Array([
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        ]);
    }

    // Generate bitangents for normal mapping
    private static generateBitangents(flipNormal: boolean): Float32Array {
        // For a plane, bitangents should be aligned with z-axis
        const bitangentZ = flipNormal ? -1.0 : 1.0;
        return new Float32Array([
            0.0, 0.0, bitangentZ,
            0.0, 0.0, bitangentZ,
            0.0, 0.0, bitangentZ,
            0.0, 0.0, bitangentZ
        ]);
    }

    private static generateColors(material?: Material): Float32Array {
        const defaultColor = vec3.fromValues(0.8, 0.8, 0.8); // Default to light gray
        const color = material ? material.baseColor.vec : defaultColor;

        // Four vertices need the same color
        return new Float32Array([
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2],
            color[0], color[1], color[2]
        ]);
    }

    private static createMeshData(props: Omit<PlaneProps, 'scale'> = {}): MeshData {
        const flipNormal = props.flipNormal || false;
        return {
            vertices: this.vertices,
            indices: this.generateIndices(flipNormal),
            normals: this.generateNormals(flipNormal),
            texCoords: this.texCoords,
            colors: this.generateColors(props.material),
            tangents: this.generateTangents(),
            bitangents: this.generateBitangents(flipNormal)
        };
    }

    public static create(props: Omit<PlaneProps, 'scale'> & { scale?: Vector2 } = {}): SceneObject {
        // Create default material if none provided
        if (!props.material && !props.texture) {
            props.material = new Material();
        }

        const meshData = this.createMeshData(props);
        const sceneObject = this.createSceneObject(meshData, {...props, scale: v3(props.scale?.x ?? 1, 1, props.scale?.y ?? 1)});

        // The material is now set in the SceneObject constructor
        // and applied during each render call
        
        return sceneObject;
    }
} 