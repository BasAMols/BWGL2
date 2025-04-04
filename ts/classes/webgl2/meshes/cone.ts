import { MeshData } from '../types';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { SceneObject } from './sceneObject';

export interface ConeProps extends BaseMeshProps {
    sides?: number;
    smoothShading?: boolean;
    // Colors for [sides, bottom]
    colors?: [number, number, number] | [[number, number, number], [number, number, number]];
}

export class Cone extends BaseMesh {
    private static generateMeshData(sides: number = 32, smoothShading: boolean = true, colors?: [number, number, number] | [[number, number, number], [number, number, number]]): MeshData {
        const vertices: number[] = [];
        const indices: number[] = [];
        const normals: number[] = [];
        const generatedColors: number[] = [];
        const texCoords: number[] = [];

        // Default colors
        const defaultColors: [[number, number, number], [number, number, number]] = [
            [0.8, 0.2, 0.2], // sides
            [0.2, 0.2, 0.8]  // bottom
        ];

        let [sideColor, bottomColor] = defaultColors;

        if (colors) {
            if (Array.isArray(colors[0])) {
                [sideColor, bottomColor] = colors as [[number, number, number], [number, number, number]];
            } else {
                sideColor = bottomColor = colors as [number, number, number];
            }
        }

        if (smoothShading) {
            // Add apex vertex at the top
            vertices.push(0, 0.5, 0);
            normals.push(0, 1, 0);
            generatedColors.push(...sideColor);
            texCoords.push(0.5, 1);

            // Generate bottom circle vertices
            for (let i = 0; i <= sides; i++) {
                const angle = (i * Math.PI * 2) / sides;
                const x = Math.cos(angle);
                const z = Math.sin(angle);

                // Bottom circle vertex
                vertices.push(x * 0.5, -0.5, z * 0.5);

                // Calculate smooth normal for the side
                // The normal should point outward from the surface
                const dx = x * 0.5;
                const dy = -0.5;
                const dz = z * 0.5;
                const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
                normals.push(dx / length, dy / length, dz / length);

                generatedColors.push(...sideColor);
                texCoords.push(i / sides, 0);
            }

            // Generate side triangles
            for (let i = 0; i < sides; i++) {
                indices.push(
                    0,              // apex
                    i + 2,          // next base vertex
                    i + 1           // current base vertex
                );
            }
        } else {
            // Flat shading - each triangle has its own vertices
            for (let i = 0; i < sides; i++) {
                const angle1 = (i * Math.PI * 2) / sides;
                const angle2 = ((i + 1) * Math.PI * 2) / sides;
                
                const x1 = Math.cos(angle1) * 0.5;
                const z1 = Math.sin(angle1) * 0.5;
                const x2 = Math.cos(angle2) * 0.5;
                const z2 = Math.sin(angle2) * 0.5;

                // Add vertices for one side triangle
                vertices.push(
                    0, 0.5, 0,        // apex
                    x1, -0.5, z1,     // base point 1
                    x2, -0.5, z2      // base point 2
                );

                // Calculate flat normal for this face using cross product
                // Vector from apex to base point 1
                const v1x = x1;
                const v1y = -1;
                const v1z = z1;

                // Vector from apex to base point 2
                const v2x = x2;
                const v2y = -1;
                const v2z = z2;

                // Cross product (v2 × v1 for outward normal)
                const nx = v2y * v1z - v2z * v1y;
                const ny = v2z * v1x - v2x * v1z;
                const nz = v2x * v1y - v2y * v1x;

                // Normalize
                const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
                const normalX = nx / length;
                const normalY = ny / length;
                const normalZ = nz / length;

                // Apply the same normal to all vertices of this face
                for (let j = 0; j < 3; j++) {
                    normals.push(normalX, normalY, normalZ);
                    generatedColors.push(...sideColor);
                }

                // Texture coordinates
                texCoords.push(
                    0.5, 1,
                    i / sides, 0,
                    (i + 1) / sides, 0
                );

                // Add indices
                const baseIndex = i * 3;
                indices.push(baseIndex, baseIndex + 2, baseIndex + 1);
            }
        }

        // Generate bottom cap
        const baseVertexCount = vertices.length / 3;
        vertices.push(0, -0.5, 0); // Center of bottom
        normals.push(0, -1, 0);
        generatedColors.push(...bottomColor);
        texCoords.push(0.5, 0.5);

        // Generate bottom cap triangles
        for (let i = 0; i < sides; i++) {
            const angle1 = (i * Math.PI * 2) / sides;
            const angle2 = ((i + 1) * Math.PI * 2) / sides;
            
            const x1 = Math.cos(angle1) * 0.5;
            const z1 = Math.sin(angle1) * 0.5;
            const x2 = Math.cos(angle2) * 0.5;
            const z2 = Math.sin(angle2) * 0.5;

            // Add vertices for bottom cap triangle
            vertices.push(
                x1, -0.5, z1,
                x2, -0.5, z2
            );

            // Bottom cap normals
            normals.push(0, -1, 0, 0, -1, 0);
            generatedColors.push(...bottomColor, ...bottomColor);
            texCoords.push(
                x1 + 0.5, z1 + 0.5,
                x2 + 0.5, z2 + 0.5
            );

            // Add indices for bottom cap
            const offset = baseVertexCount + 1 + i * 2;
            indices.push(
                baseVertexCount,    // center
                offset,             // current point
                offset + 1          // next point
            );
        }

        return {
            vertices: new Float32Array(vertices),
            indices: new Uint16Array(indices),
            normals: new Float32Array(normals),
            colors: new Float32Array(generatedColors),
            texCoords: new Float32Array(texCoords)
        };
    }

    public static create(props: ConeProps = {}): SceneObject {
        const meshData = this.generateMeshData(
            props.sides || 32,
            props.smoothShading ?? true,
            props.colors
        );
        return this.createSceneObject(meshData, props);
    }
} 