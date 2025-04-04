import { MeshData } from './types';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { SceneObject } from './sceneObject';
import { Material } from '../material';
import { v3 } from '../../util/math/vector3';

export interface SphereProps extends BaseMeshProps {
    segments?: number;    // horizontal segments (like cylinder sides)
    rings?: number;       // vertical segments
    smoothShading?: boolean;
    color?: [number, number, number];
}

export class Sphere extends BaseMesh {
    private static generateMeshData(
        segments: number = 32, 
        rings: number = 16, 
        smoothShading: boolean = true,
        color: [number, number, number] = [0.8, 0.2, 0.2]
    ): MeshData {
        const vertices: number[] = [];
        const indices: number[] = [];
        const normals: number[] = [];
        const generatedColors: number[] = [];
        const texCoords: number[] = [];

        if (smoothShading) {
            // Generate vertices with shared normals
            for (let ring = 0; ring <= rings; ring++) {
                const phi = (ring * Math.PI) / rings;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                for (let segment = 0; segment <= segments; segment++) {
                    const theta = (segment * 2 * Math.PI) / segments;
                    const sinTheta = Math.sin(theta);
                    const cosTheta = Math.cos(theta);

                    const x = cosTheta * sinPhi;
                    const y = cosPhi;
                    const z = sinTheta * sinPhi;

                    // Position
                    vertices.push(x * 0.5, y * 0.5, z * 0.5);

                    // Normal (same as position for a sphere, just normalized)
                    normals.push(x, y, z);

                    // Color
                    generatedColors.push(...color);

                    // Texture coordinates
                    texCoords.push(segment / segments, ring / rings);
                }
            }

            // Generate indices
            for (let ring = 0; ring < rings; ring++) {
                for (let segment = 0; segment < segments; segment++) {
                    const first = (ring * (segments + 1)) + segment;
                    const second = first + segments + 1;

                    indices.push(first, second, first + 1);
                    indices.push(second, second + 1, first + 1);
                }
            }
        } else {
            // Flat shading - each triangle has its own vertices
            for (let ring = 0; ring < rings; ring++) {
                const phi1 = (ring * Math.PI) / rings;
                const phi2 = ((ring + 1) * Math.PI) / rings;

                for (let segment = 0; segment < segments; segment++) {
                    const theta1 = (segment * 2 * Math.PI) / segments;
                    const theta2 = ((segment + 1) * 2 * Math.PI) / segments;

                    // Calculate vertices for two triangles
                    const vertices1 = [
                        // First triangle
                        [
                            Math.cos(theta1) * Math.sin(phi1) * 0.5,
                            Math.cos(phi1) * 0.5,
                            Math.sin(theta1) * Math.sin(phi1) * 0.5
                        ],
                        [
                            Math.cos(theta1) * Math.sin(phi2) * 0.5,
                            Math.cos(phi2) * 0.5,
                            Math.sin(theta1) * Math.sin(phi2) * 0.5
                        ],
                        [
                            Math.cos(theta2) * Math.sin(phi1) * 0.5,
                            Math.cos(phi1) * 0.5,
                            Math.sin(theta2) * Math.sin(phi1) * 0.5
                        ]
                    ];

                    const vertices2 = [
                        // Second triangle
                        [
                            Math.cos(theta2) * Math.sin(phi1) * 0.5,
                            Math.cos(phi1) * 0.5,
                            Math.sin(theta2) * Math.sin(phi1) * 0.5
                        ],
                        [
                            Math.cos(theta1) * Math.sin(phi2) * 0.5,
                            Math.cos(phi2) * 0.5,
                            Math.sin(theta1) * Math.sin(phi2) * 0.5
                        ],
                        [
                            Math.cos(theta2) * Math.sin(phi2) * 0.5,
                            Math.cos(phi2) * 0.5,
                            Math.sin(theta2) * Math.sin(phi2) * 0.5
                        ]
                    ];

                    // Add vertices and calculate flat normal for first triangle
                    const v1 = vertices1[0];
                    const v2 = vertices1[1];
                    const v3 = vertices1[2];

                    // Calculate normal using cross product
                    const ax = v2[0] - v1[0];
                    const ay = v2[1] - v1[1];
                    const az = v2[2] - v1[2];
                    const bx = v3[0] - v1[0];
                    const by = v3[1] - v1[1];
                    const bz = v3[2] - v1[2];

                    let nx = ay * bz - az * by;
                    let ny = az * bx - ax * bz;
                    let nz = ax * by - ay * bx;

                    // Normalize
                    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
                    nx /= length;
                    ny /= length;
                    nz /= length;

                    // Add first triangle
                    for (const vertex of vertices1) {
                        vertices.push(...vertex);
                        normals.push(nx, ny, nz);
                        generatedColors.push(...color);
                        // Approximate texture coordinates
                        const u = 0.5 + Math.atan2(vertex[2], vertex[0]) / (2 * Math.PI);
                        const vCoord = 0.5 - Math.asin(vertex[1]) / Math.PI;
                        texCoords.push(u, vCoord);
                    }

                    // Add second triangle
                    for (const vertex of vertices2) {
                        vertices.push(...vertex);
                        normals.push(nx, ny, nz);
                        generatedColors.push(...color);
                        // Approximate texture coordinates
                        const u = 0.5 + Math.atan2(vertex[2], vertex[0]) / (2 * Math.PI);
                        const vCoord = 0.5 - Math.asin(vertex[1]) / Math.PI;
                        texCoords.push(u, vCoord);
                    }

                    // Add indices
                    const baseIndex = (ring * segments + segment) * 6;
                    indices.push(
                        baseIndex, baseIndex + 1, baseIndex + 2,
                        baseIndex + 3, baseIndex + 4, baseIndex + 5
                    );
                }
            }
        }

        return {
            vertices: new Float32Array(vertices),
            indices: new Uint16Array(indices),
            normals: new Float32Array(normals),
            colors: new Float32Array(generatedColors),
            texCoords: new Float32Array(texCoords)
        };
    }

    public static create(props: SphereProps = {}): SceneObject {
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
            props.segments || 32,
            props.rings || 16,
            props.smoothShading ?? true,
            meshColor
        );
        return this.createSceneObject(meshData, props);
    }
}
