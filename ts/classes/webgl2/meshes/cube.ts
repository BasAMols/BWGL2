import { MeshData } from './types';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { SceneObject } from './sceneObject';
import { Material } from '../material';
import { v3 } from '../../util/math/vector3';

export interface CubeProps extends BaseMeshProps {
    // Allow either a single color for all faces or an array of 6 colors for each face
    colors?: [number, number, number] | Array<[number, number, number]>;
}

export class Cube extends BaseMesh {
    private static vertices: Float32Array = new Float32Array([
        // Front face
        -0.5, -0.5,  0.5,  // 0
         0.5, -0.5,  0.5,  // 1
         0.5,  0.5,  0.5,  // 2
        -0.5,  0.5,  0.5,  // 3
        // Back face
        -0.5, -0.5, -0.5,  // 4
         0.5, -0.5, -0.5,  // 5
         0.5,  0.5, -0.5,  // 6
        -0.5,  0.5, -0.5,  // 7
        // Right face
         0.5, -0.5,  0.5,  // 8 (1)
         0.5, -0.5, -0.5,  // 9 (5)
         0.5,  0.5, -0.5,  // 10 (6)
         0.5,  0.5,  0.5,  // 11 (2)
        // Left face
        -0.5, -0.5, -0.5,  // 12 (4)
        -0.5, -0.5,  0.5,  // 13 (0)
        -0.5,  0.5,  0.5,  // 14 (3)
        -0.5,  0.5, -0.5,  // 15 (7)
        // Top face
        -0.5,  0.5,  0.5,  // 16 (3)
         0.5,  0.5,  0.5,  // 17 (2)
         0.5,  0.5, -0.5,  // 18 (6)
        -0.5,  0.5, -0.5,  // 19 (7)
        // Bottom face
        -0.5, -0.5, -0.5,  // 20 (4)
         0.5, -0.5, -0.5,  // 21 (5)
         0.5, -0.5,  0.5,  // 22 (1)
        -0.5, -0.5,  0.5   // 23 (0)
    ]);

    private static generateColors(colors?: [number, number, number] | Array<[number, number, number]>): Float32Array {
        const defaultColors: Array<[number, number, number]> = [
            [0.8, 0.2, 0.2], // Front face (red)
            [1.0, 1.0, 0.0], // Back face (yellow)
            [0.2, 0.8, 0.2], // Right face (green)
            [0.8, 0.2, 0.8], // Left face (purple)
            [0.2, 0.2, 0.8], // Top face (blue)
            [1.0, 0.5, 0.0]  // Bottom face (orange)
        ];

        let faceColors: Array<[number, number, number]>;
        
        if (!colors) {
            faceColors = defaultColors;
        } else if (Array.isArray(colors[0])) {
            // Multiple colors provided
            faceColors = colors as Array<[number, number, number]>;
            if (faceColors.length !== 6) {
                throw new Error('Must provide exactly 6 colors for faces or a single color');
            }
        } else {
            // Single color - cast to the correct type
            const singleColor = colors as [number, number, number];
            faceColors = Array(6).fill(singleColor);
        }

        // Convert to flat array for all vertices
        const colorArray: number[] = [];
        faceColors.forEach(color => {
            // Each face has 4 vertices that need the same color
            for (let i = 0; i < 4; i++) {
                colorArray.push(...color);
            }
        });

        return new Float32Array(colorArray);
    }

    private static indices: Uint16Array = new Uint16Array([
        // Front
        0, 1, 2,    2, 3, 0,
        // Back (reversed order)
        4, 6, 5,    6, 4, 7,
        // Right
        8, 9, 10,   10, 11, 8,
        // Left
        12, 13, 14, 14, 15, 12,
        // Top
        16, 17, 18, 18, 19, 16,
        // Bottom
        20, 21, 22, 22, 23, 20
    ]);

    private static normals: Float32Array = new Float32Array([
        // Front face
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        0.0,  0.0,  1.0,
        // Back face
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        0.0,  0.0, -1.0,
        // Right face
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        1.0,  0.0,  0.0,
        // Left face
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        // Top face
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        0.0,  1.0,  0.0,
        // Bottom face
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0,
        0.0, -1.0,  0.0
    ]);

    private static texCoords: Float32Array = new Float32Array([
        // Front
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Back
        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
        // Right
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Left
        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0,
        // Top
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // Bottom
        1.0, 0.0,
        0.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ]);

    private static generateTangents(): Float32Array {
        // Tangents for each face
        const tangents = [
            // Front face: tangent along x-axis
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            
            // Back face: tangent along negative x-axis
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            -1.0, 0.0, 0.0,
            
            // Right face: tangent along negative z-axis
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            
            // Left face: tangent along z-axis
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            
            // Top face: tangent along x-axis
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            
            // Bottom face: tangent along x-axis
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0,
            1.0, 0.0, 0.0
        ];
        
        return new Float32Array(tangents);
    }

    private static generateBitangents(): Float32Array {
        // Bitangents for each face (cross product of normal and tangent)
        const bitangents = [
            // Front face: bitangent along y-axis
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            
            // Back face: bitangent along y-axis
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            
            // Right face: bitangent along y-axis
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            
            // Left face: bitangent along y-axis
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            
            // Top face: bitangent along z-axis (negative)
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            
            // Bottom face: bitangent along z-axis
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ];
        
        return new Float32Array(bitangents);
    }

    private static createMeshData(props: CubeProps = {}): MeshData {
        // Determine which color to use for mesh generation
        let meshColors: [number, number, number] | Array<[number, number, number]> = props.colors;
        
        // If material exists but no colors provided, create colors from material
        if (props.material && !meshColors) {
            const { baseColor } = props.material;
            meshColors = [baseColor.x, baseColor.y, baseColor.z];
        }
        
        return {
            vertices: this.vertices,
            indices: this.indices,
            normals: this.normals,
            texCoords: this.texCoords,
            colors: this.generateColors(meshColors),
            tangents: this.generateTangents(),
            bitangents: this.generateBitangents()
        };
    }

    public static create(props: CubeProps = {}): SceneObject {
        // Create default material based on colors if no material provided
        if (!props.material && props.colors) {
            let baseColor;
            if (Array.isArray(props.colors[0])) {
                // If multiple colors, use the first one
                const firstColor = (props.colors as Array<[number, number, number]>)[0];
                baseColor = v3(firstColor[0], firstColor[1], firstColor[2]);
            } else {
                // Single color - cast to the correct type
                const singleColor = props.colors as [number, number, number];
                baseColor = v3(singleColor[0], singleColor[1], singleColor[2]);
            }
            
            props = {
                ...props,
                material: new Material({
                    baseColor,
                    roughness: 0.5,
                    metallic: 0.0,
                    ambientOcclusion: 1.0,
                    emissive: v3(0, 0, 0)
                })
            };
        }
        
        const meshData = this.createMeshData(props);
        const sceneObject = this.createSceneObject(meshData, props);
        
        // The material is now set in the SceneObject constructor
        // and applied during each render call
        
        return sceneObject;
    }
}
