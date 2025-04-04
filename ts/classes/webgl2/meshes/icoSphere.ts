import { MeshData } from './types';
import { SceneObject } from './sceneObject';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { v3 } from '../../util/math/vector3';
import { Material } from '../material';

export interface IcoSphereProps extends BaseMeshProps {
    subdivisions?: number;  // Number of times to subdivide the icosahedron (0-5 recommended)
    color?: [number, number, number];
    smoothShading?: boolean;
}

export class IcoSphere extends BaseMesh {
    private static readonly X = 0.525731112119133606;
    private static readonly Z = 0.850650808352039932;

    // Initial icosahedron vertices
    private static readonly baseVertices = [
        [-this.X, 0.0, this.Z], [this.X, 0.0, this.Z], [-this.X, 0.0, -this.Z], [this.X, 0.0, -this.Z],
        [0.0, this.Z, this.X], [0.0, this.Z, -this.X], [0.0, -this.Z, this.X], [0.0, -this.Z, -this.X],
        [this.Z, this.X, 0.0], [-this.Z, this.X, 0.0], [this.Z, -this.X, 0.0], [-this.Z, -this.X, 0.0]
    ];

    // Initial icosahedron indices
    private static readonly baseIndices = [
        1,4,0,  4,9,0,  4,5,9,  8,5,4,  1,8,4,
        1,10,8, 10,3,8, 8,3,5,  3,2,5,  3,7,2,
        3,10,7, 10,6,7, 6,11,7, 6,0,11, 6,1,0,
        10,1,6, 11,0,9, 2,11,9, 5,2,9,  11,2,7
    ];

    protected static normalize(v: number[]): number[] {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [v[0] / length, v[1] / length, v[2] / length];
    }

    private static midpoint(v1: number[], v2: number[]): number[] {
        return this.normalize([
            (v1[0] + v2[0]) / 2,
            (v1[1] + v2[1]) / 2,
            (v1[2] + v2[2]) / 2
        ]);
    }

    private static generateMeshData(
        subdivisions: number = 0,
        smoothShading: boolean = true,
        color: [number, number, number] = [0.8, 0.2, 0.2]
    ): MeshData {
        let vertices: number[][] = [...this.baseVertices];
        let indices: number[] = [...this.baseIndices];
        const vertexMap = new Map<string, number>();

        // Helper to get or create midpoint vertex
        const getMiddlePoint = (v1Index: number, v2Index: number): number => {
            const key = `${Math.min(v1Index, v2Index)}_${Math.max(v1Index, v2Index)}`;
            if (vertexMap.has(key)) {
                return vertexMap.get(key)!;
            }

            const p1 = vertices[v1Index];
            const p2 = vertices[v2Index];
            const middle = this.midpoint(p1, p2);
            
            const i = vertices.length;
            vertices.push(middle);
            vertexMap.set(key, i);
            return i;
        };

        // Subdivide
        for (let i = 0; i < subdivisions; i++) {
            const newIndices: number[] = [];
            
            for (let j = 0; j < indices.length; j += 3) {
                const a = indices[j];
                const b = indices[j + 1];
                const c = indices[j + 2];

                const ab = getMiddlePoint(a, b);
                const bc = getMiddlePoint(b, c);
                const ca = getMiddlePoint(c, a);

                newIndices.push(
                    a, ab, ca,
                    b, bc, ab,
                    c, ca, bc,
                    ab, bc, ca
                );
            }
            
            indices = newIndices;
        }

        // Scale vertices to radius 0.5
        vertices = vertices.map(v => [v[0] * 0.5, v[1] * 0.5, v[2] * 0.5]);

        // Generate flat arrays and normals
        const flatVertices: number[] = [];
        const normals: number[] = [];
        const generatedColors: number[] = [];
        const texCoords: number[] = [];
        const tangents: number[] = [];
        const bitangents: number[] = [];

        if (smoothShading) {
            // For smooth shading, use vertices directly as normals
            vertices.forEach(v => {
                flatVertices.push(...v);
                const normal = this.normalize(v);
                normals.push(...normal);
                generatedColors.push(...color);
                
                // Generate basic texture coordinates based on spherical projection
                const u = 0.5 + Math.atan2(v[2], v[0]) / (2 * Math.PI);
                const vCoord = 0.5 - Math.asin(v[1]) / Math.PI;
                texCoords.push(u, vCoord);
                
                // Calculate tangent and bitangent for normal mapping
                // Tangent is perpendicular to normal and points around the sphere horizontally
                const tangent = [-v[2], 0, v[0]];
                const tangentLength = Math.sqrt(tangent[0] * tangent[0] + tangent[2] * tangent[2]);
                if (tangentLength > 0.01) {
                    tangent[0] /= tangentLength;
                    tangent[2] /= tangentLength;
                } else {
                    // For poles, use a fixed tangent
                    tangent[0] = 1;
                    tangent[1] = 0;
                    tangent[2] = 0;
                }
                tangents.push(...tangent);
                
                // Bitangent is cross product of normal and tangent
                const bitangent = [
                    normal[1] * tangent[2] - normal[2] * tangent[1],
                    normal[2] * tangent[0] - normal[0] * tangent[2],
                    normal[0] * tangent[1] - normal[1] * tangent[0]
                ];
                bitangents.push(...bitangent);
            });
        } else {
            // For flat shading, create separate vertices for each face
            const newIndices: number[] = [];
            for (let i = 0; i < indices.length; i += 3) {
                const v1 = vertices[indices[i]];
                const v2 = vertices[indices[i + 1]];
                const v3 = vertices[indices[i + 2]];

                // Calculate face normal
                const dx1 = v2[0] - v1[0], dy1 = v2[1] - v1[1], dz1 = v2[2] - v1[2];
                const dx2 = v3[0] - v1[0], dy2 = v3[1] - v1[1], dz2 = v3[2] - v1[2];
                const normal = this.normalize([
                    dy1 * dz2 - dz1 * dy2,
                    dz1 * dx2 - dx1 * dz2,
                    dx1 * dy2 - dy1 * dx2
                ]);

                // Each vertex needs to be duplicated for flat shading
                const baseIndex = flatVertices.length / 3;
                
                // Calculate tangent based on texture coordinates
                const tangent = [1, 0, 0]; // Default tangent along x-axis for flat shading
                const bitangent = [0, 1, 0]; // Default bitangent along y-axis
                
                // Add vertices in correct winding order
                [v1, v2, v3].forEach(vertex => {
                    flatVertices.push(...vertex);
                    normals.push(...normal);
                    generatedColors.push(...color);
                    
                    const u = 0.5 + Math.atan2(vertex[2], vertex[0]) / (2 * Math.PI);
                    const vCoord = 0.5 - Math.asin(vertex[1]) / Math.PI;
                    texCoords.push(u, vCoord);
                    
                    tangents.push(...tangent);
                    bitangents.push(...bitangent);
                });

                // Add indices for this face
                newIndices.push(baseIndex, baseIndex + 1, baseIndex + 2);
            }
            indices = newIndices;
        }

        return {
            vertices: new Float32Array(flatVertices),
            indices: new Uint16Array(indices),
            normals: new Float32Array(normals),
            colors: new Float32Array(generatedColors),
            texCoords: new Float32Array(texCoords),
            tangents: new Float32Array(tangents),
            bitangents: new Float32Array(bitangents)
        };
    }

    public static create(props: Omit<IcoSphereProps, 'colors'> = {}): SceneObject {
        // Create default material based on color if no material provided
        if (!props.material && props.color) {
            const baseColor = v3(props.color[0], props.color[1], props.color[2]);
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
        
        // Determine which color to use for the mesh generation
        let meshColor: [number, number, number];
        if (props.material) {
            // Use material's baseColor for mesh generation
            const { baseColor } = props.material;
            meshColor = [baseColor.x, baseColor.y, baseColor.z];
        } else if (props.color) {
            // Use provided color
            meshColor = props.color;
        } else {
            // Default color
            meshColor = [0.8, 0.2, 0.2];
        }
        
        const meshData = this.generateMeshData(
            props.subdivisions ?? 0,
            props.smoothShading ?? true,
            meshColor
        );
        
        const sceneObject = this.createSceneObject(meshData, props);
        
        // The material is now set in the SceneObject constructor
        // and applied during each render call
        
        return sceneObject;
    }
} 