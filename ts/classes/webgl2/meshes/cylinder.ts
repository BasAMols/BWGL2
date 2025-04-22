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

        if (smoothShading) {
            // Smooth shading - vertices share normals
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

            // Generate caps for smooth shading
            const sideVertexCount = vertices.length / 3;
            
            // Add centers for both caps
            vertices.push(0, 0.5, 0);  // Top center
            vertices.push(0, -0.5, 0); // Bottom center
            normals.push(0, 1, 0);     // Top normal
            normals.push(0, -1, 0);    // Bottom normal
            generatedColors.push(...topColor, ...bottomColor);
            texCoords.push(0.5, 0.5, 0.5, 0.5);

            const topCenterIndex = sideVertexCount;
            const bottomCenterIndex = sideVertexCount + 1;

            // Generate cap vertices
            for (let i = 0; i < sides; i++) {
                const angle1 = (i * Math.PI * 2) / sides;
                const angle2 = ((i + 1) * Math.PI * 2) / sides;
                
                const x1 = Math.cos(angle1) * 0.5;
                const z1 = Math.sin(angle1) * 0.5;
                const x2 = Math.cos(angle2) * 0.5;
                const z2 = Math.sin(angle2) * 0.5;

                // Add vertices for caps
                vertices.push(
                    x1, 0.5, z1,    // Top cap point 1
                    x2, 0.5, z2,    // Top cap point 2
                    x1, -0.5, z1,   // Bottom cap point 1
                    x2, -0.5, z2    // Bottom cap point 2
                );

                // Add normals
                normals.push(
                    0, 1, 0,    // Top cap normal
                    0, 1, 0,    // Top cap normal
                    0, -1, 0,   // Bottom cap normal
                    0, -1, 0    // Bottom cap normal
                );

                // Add colors
                generatedColors.push(
                    ...topColor, ...topColor,       // Top cap colors
                    ...bottomColor, ...bottomColor  // Bottom cap colors
                );

                // Add texture coordinates for both caps
                texCoords.push(
                    x1 + 0.5, z1 + 0.5,    // Top cap first point
                    x2 + 0.5, z2 + 0.5,    // Top cap second point
                    x1 + 0.5, z1 + 0.5,    // Bottom cap first point
                    x2 + 0.5, z2 + 0.5     // Bottom cap second point
                );

                // Calculate vertex indices for this segment
                const topSegmentStart = sideVertexCount + 2 + (i * 4);
                const bottomSegmentStart = topSegmentStart + 2;

                // Add indices for caps
                indices.push(
                    topCenterIndex,        // Top center
                    topSegmentStart,       // Top current point
                    topSegmentStart + 1,   // Top next point
                    bottomCenterIndex,     // Bottom center
                    bottomSegmentStart,    // Bottom current point
                    bottomSegmentStart + 1 // Bottom next point
                );
            }
        } else {
            // Flat shading - each face has its own vertices with unique normals
            for (let i = 0; i < sides; i++) {
                const angle1 = (i * Math.PI * 2) / sides;
                const angle2 = ((i + 1) * Math.PI * 2) / sides;
                
                const x1 = Math.cos(angle1);
                const z1 = Math.sin(angle1);
                const x2 = Math.cos(angle2);
                const z2 = Math.sin(angle2);

                // Each face gets its own vertices
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

                // Indices for flat shading are just sequential
                const baseIndex = i * 6;
                indices.push(
                    baseIndex, baseIndex + 1, baseIndex + 2,
                    baseIndex + 3, baseIndex + 4, baseIndex + 5
                );
            }

            // Generate caps for flat shading
            const sideVertexCount = vertices.length / 3;

            // Add centers for both caps
            vertices.push(0, 0.5, 0);  // Top center
            vertices.push(0, -0.5, 0); // Bottom center
            normals.push(0, 1, 0);     // Top normal
            normals.push(0, -1, 0);    // Bottom normal
            generatedColors.push(...topColor, ...bottomColor);
            texCoords.push(0.5, 0.5, 0.5, 0.5);

            const topCenterIndex = sideVertexCount;
            const bottomCenterIndex = sideVertexCount + 1;

            // Generate vertices for both caps
            for (let i = 0; i < sides; i++) {
                const angle1 = (i * Math.PI * 2) / sides;
                const angle2 = ((i + 1) * Math.PI * 2) / sides;
                
                const x1 = Math.cos(angle1) * 0.5;
                const z1 = Math.sin(angle1) * 0.5;
                const x2 = Math.cos(angle2) * 0.5;
                const z2 = Math.sin(angle2) * 0.5;

                // Add vertices for top cap
                vertices.push(
                    x1, 0.5, z1,
                    x2, 0.5, z2
                );

                // Add normals for top cap
                normals.push(0, 1, 0, 0, 1, 0);
                generatedColors.push(...topColor, ...topColor);
                texCoords.push(
                    x1 + 0.5, z1 + 0.5,
                    x2 + 0.5, z2 + 0.5
                );

                // Add indices for top cap (reverse order from bottom to flip normal)
                const topOffset = sideVertexCount + 2 + i * 4;
                indices.push(
                    topCenterIndex,    // center
                    topOffset + 1,     // next point
                    topOffset          // current point
                );

                // Add vertices for bottom cap
                vertices.push(
                    x1, -0.5, z1,
                    x2, -0.5, z2
                );

                // Add normals for bottom cap
                normals.push(0, -1, 0, 0, -1, 0);
                generatedColors.push(...bottomColor, ...bottomColor);
                texCoords.push(
                    x1 + 0.5, z1 + 0.5,
                    x2 + 0.5, z2 + 0.5
                );

                // Add indices for bottom cap
                const bottomOffset = topOffset + 2;
                indices.push(
                    bottomCenterIndex,    // center
                    bottomOffset,         // current point
                    bottomOffset + 1      // next point
                );
            }
        }

        return {
            vertices: new Float32Array(vertices),
            normals: new Float32Array(normals),
            colors: new Float32Array(generatedColors),
            texCoords: new Float32Array(texCoords)
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
