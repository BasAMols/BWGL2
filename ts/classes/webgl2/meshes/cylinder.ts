import { MeshData } from './types';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { SceneObject } from './sceneObject';
import { Material } from '../material';
import { v3 } from '../../util/math/vector3';

export interface CylinderProps extends BaseMeshProps {
    sides?: number;
    smoothShading?: boolean;
    colors?: [number, number, number] | [[number, number, number], [number, number, number], [number, number, number]];
}

export class Cylinder extends BaseMesh {
    private static generateMeshData(sides: number = 32, smoothShading: boolean = true, colors?: [number, number, number] | [[number, number, number], [number, number, number], [number, number, number]]): MeshData {
        // Arrays to store the generated data
        const vertices: number[] = [];
        const indices: number[] = [];
        const normals: number[] = [];
        const generatedColors: number[] = [];
        const texCoords: number[] = [];
        const tangents: number[] = [];
        const bitangents: number[] = [];

        // Default colors
        const defaultColors: [[number, number, number], [number, number, number], [number, number, number]] = [
            [0.8, 0.2, 0.2], // sides
            [0.2, 0.2, 0.8], // top
            [0.8, 0.8, 0.2]  // bottom
        ];

        let [sideColor, topColor, bottomColor] = defaultColors;

        if (colors) {
            if (Array.isArray(colors[0])) {
                // Multiple colors provided
                [sideColor, topColor, bottomColor] = colors as [[number, number, number], [number, number, number], [number, number, number]];
            } else {
                // Single color provided
                sideColor = topColor = bottomColor = colors as [number, number, number];
            }
        }

        // STEP 1: Generate sides with smooth or flat shading as specified
        if (smoothShading) {
            // Smooth shading for sides - vertices share normals
            for (let i = 0; i <= sides; i++) {
                const angle = (i * Math.PI * 2) / sides;
                const x = Math.cos(angle);
                const z = Math.sin(angle);

                // Top circle vertex
                vertices.push(x * 0.5, 0.5, z * 0.5);
                // Bottom circle vertex
                vertices.push(x * 0.5, -0.5, z * 0.5);

                // Normals for the side - pointing outward
                normals.push(x, 0, z);
                normals.push(x, 0, z);

                // Colors for side vertices
                generatedColors.push(...sideColor);
                generatedColors.push(...sideColor);

                // Texture coordinates
                texCoords.push(i / sides, 1);
                texCoords.push(i / sides, 0);

                // Tangent vectors for normal mapping - tangent to the cylinder surface
                // For a cylinder, tangent is perpendicular to normal in horizontal plane
                const tx = -z;
                const tz = x;
                tangents.push(tx, 0, tz);
                tangents.push(tx, 0, tz);

                // Bitangent is cross product of normal and tangent (up/down direction)
                bitangents.push(0, 1, 0);
                bitangents.push(0, 1, 0);
            }

            // Generate indices for the side triangles
            for (let i = 0; i < sides; i++) {
                const topFirst = i * 2;
                const bottomFirst = topFirst + 1;
                const topSecond = (i + 1) * 2;
                const bottomSecond = topSecond + 1;

                indices.push(topFirst, topSecond, bottomFirst);
                indices.push(bottomFirst, topSecond, bottomSecond);
            }
        } else {
            // Flat shading for sides - each face has its own vertices with unique normals
            for (let i = 0; i < sides; i++) {
                const angle1 = (i * Math.PI * 2) / sides;
                const angle2 = ((i + 1) * Math.PI * 2) / sides;
                
                const x1 = Math.cos(angle1);
                const z1 = Math.sin(angle1);
                const x2 = Math.cos(angle2);
                const z2 = Math.sin(angle2);

                // Each face gets its own vertices
                const baseIndex = vertices.length / 3;
                vertices.push(
                    x1 * 0.5, 0.5, z1 * 0.5,    // top-left
                    x2 * 0.5, 0.5, z2 * 0.5,    // top-right
                    x1 * 0.5, -0.5, z1 * 0.5,   // bottom-left
                    x1 * 0.5, -0.5, z1 * 0.5,   // bottom-left
                    x2 * 0.5, 0.5, z2 * 0.5,    // top-right
                    x2 * 0.5, -0.5, z2 * 0.5    // bottom-right
                );

                // Calculate face normal
                const nx = (x1 + x2) / 2;
                const nz = (z1 + z2) / 2;
                const length = Math.sqrt(nx * nx + nz * nz);
                const normalX = nx / length;
                const normalZ = nz / length;

                // Each vertex in the face gets the same normal
                for (let j = 0; j < 6; j++) {
                    normals.push(normalX, 0, normalZ);
                    generatedColors.push(...sideColor);
                }

                // Texture coordinates
                texCoords.push(
                    i / sides, 1,
                    (i + 1) / sides, 1,
                    i / sides, 0,
                    i / sides, 0,
                    (i + 1) / sides, 1,
                    (i + 1) / sides, 0
                );

                // Tangent and bitangent for flat shading
                const tangentX = -normalZ;
                const tangentZ = normalX;
                for (let j = 0; j < 6; j++) {
                    tangents.push(tangentX, 0, tangentZ);
                    bitangents.push(0, 1, 0);
                }

                // Indices for flat shading are just sequential
                indices.push(
                    baseIndex, baseIndex + 1, baseIndex + 2,
                    baseIndex + 3, baseIndex + 4, baseIndex + 5
                );
            }
        }

        // STEP 2: Generate caps directly using triangle fans with explicit vertices
        // Store current vertex count before adding caps
        const sideVertexCount = vertices.length / 3;
        
        // Generate top cap (counter-clockwise triangles when viewed from above)
        const topCenterIndex = vertices.length / 3;
        vertices.push(0, 0.5, 0);  // Center point of top cap
        normals.push(0, 1, 0);     // Normal pointing up
        generatedColors.push(...topColor);
        texCoords.push(0.5, 0.5);  // Center of texture
        tangents.push(1, 0, 0);    // Consistent tangent for the cap
        bitangents.push(0, 0, -1); // Bitangent perpendicular to normal and tangent
        
        // Create the top cap vertices in counter-clockwise order
        for (let i = 0; i <= sides; i++) {
            const angle = (i * Math.PI * 2) / sides;
            // For counter-clockwise, go around in reverse
            const x = Math.cos(-angle) * 0.5;
            const z = Math.sin(-angle) * 0.5;
            
            vertices.push(x, 0.5, z);
            normals.push(0, 1, 0);
            generatedColors.push(...topColor);
            texCoords.push(x + 0.5, z + 0.5);
            tangents.push(1, 0, 0);
            bitangents.push(0, 0, -1);
            
            // Add a triangle connecting the center to each adjacent pair of points
            if (i > 0) {
                indices.push(
                    topCenterIndex,                // Center
                    topCenterIndex + i,            // Current point
                    topCenterIndex + i + 1         // Next point
                );
            }
        }
        
        // Generate bottom cap (counter-clockwise triangles when viewed from below)
        const bottomCenterIndex = vertices.length / 3;
        vertices.push(0, -0.5, 0);  // Center point of bottom cap
        normals.push(0, -1, 0);     // Normal pointing down
        generatedColors.push(...bottomColor);
        texCoords.push(0.5, 0.5);   // Center of texture
        tangents.push(1, 0, 0);     // Consistent tangent for the cap
        bitangents.push(0, 0, 1);   // Bitangent perpendicular to normal and tangent
        
        // Create the bottom cap vertices - also in counter-clockwise when viewed from below
        // From the bottom, counter-clockwise means going in the same direction as the top
        for (let i = 0; i <= sides; i++) {
            const angle = (i * Math.PI * 2) / sides;
            // For bottom cap, counter-clockwise when looking from bottom means regular
            // direction as top cap, but the winding order needs to be flipped
            const x = Math.cos(angle) * 0.5;
            const z = Math.sin(angle) * 0.5;
            
            vertices.push(x, -0.5, z);
            normals.push(0, -1, 0);
            generatedColors.push(...bottomColor);
            texCoords.push(x + 0.5, z + 0.5);
            tangents.push(1, 0, 0);
            bitangents.push(0, 0, 1);
            
            // Add a triangle connecting the center to each adjacent pair of points
            // Note the flipped winding order compared to the top cap
            if (i > 0) {
                indices.push(
                    bottomCenterIndex,             // Center
                    bottomCenterIndex + i + 1,     // Next point
                    bottomCenterIndex + i          // Current point
                );
            }
        }

        return {
            vertices: new Float32Array(vertices),
            indices: new Uint16Array(indices),
            normals: new Float32Array(normals),
            colors: new Float32Array(generatedColors),
            texCoords: new Float32Array(texCoords),
            tangents: new Float32Array(tangents),
            bitangents: new Float32Array(bitangents)
        };
    }

    public static create(props: CylinderProps = {}): SceneObject {
        // Create default material based on colors if no material provided
        if (!props.material && props.colors) {
            let baseColor;
            if (Array.isArray(props.colors) && Array.isArray(props.colors[0])) {
                // If array of arrays (multiple colors), use the first one
                const firstColor = (props.colors as Array<[number, number, number]>)[0];
                baseColor = v3(firstColor[0], firstColor[1], firstColor[2]);
            } else {
                // Single color
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
        
        const meshData = this.generateMeshData(props.sides || 32, props.smoothShading ?? true, props.colors);
        return this.createSceneObject(meshData, props);
    }
}
