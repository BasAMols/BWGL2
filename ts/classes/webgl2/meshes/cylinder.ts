import { MeshData } from '../types';
import { VertexArray, VertexBuffer, IndexBuffer } from '../buffer';
import { SceneObject, SceneObjectProps } from './sceneObject';
import { glob } from '../../../game';

export interface CylinderProps extends SceneObjectProps {
    sides?: number;
    smoothShading?: boolean;
    colors?: [number, number, number] | [[number, number, number], [number, number, number], [number, number, number]];
}

export class Cylinder {
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

            // Generate top cap
            for (let i = 0; i < sides; i++) {
                const angle1 = (i * Math.PI * 2) / sides;
                const angle2 = ((i + 1) * Math.PI * 2) / sides;
                
                const x1 = Math.cos(angle1) * 0.5;
                const z1 = Math.sin(angle1) * 0.5;
                const x2 = Math.cos(angle2) * 0.5;
                const z2 = Math.sin(angle2) * 0.5;

                // Add vertices for one triangle of the top cap
                vertices.push(
                    0, 0.5, 0,      // center
                    x2, 0.5, z2,    // point2 (reversed order)
                    x1, 0.5, z1     // point1
                );

                // Add normals (pointing up)
                for (let j = 0; j < 3; j++) {
                    normals.push(0, 1, 0);
                    generatedColors.push(...topColor);
                }

                // Add texture coordinates
                texCoords.push(
                    0.5, 0.5,
                    x2 + 0.5, z2 + 0.5,
                    x1 + 0.5, z1 + 0.5
                );

                // Add indices
                const topOffset = sideVertexCount + i * 3;
                indices.push(
                    topOffset,      // center
                    topOffset + 1,  // point2
                    topOffset + 2   // point1
                );
            }

            // Generate bottom cap
            const topCapVertexCount = vertices.length / 3;
            for (let i = 0; i < sides; i++) {
                const angle1 = (i * Math.PI * 2) / sides;
                const angle2 = ((i + 1) * Math.PI * 2) / sides;
                
                const x1 = Math.cos(angle1) * 0.5;
                const z1 = Math.sin(angle1) * 0.5;
                const x2 = Math.cos(angle2) * 0.5;
                const z2 = Math.sin(angle2) * 0.5;

                // Add vertices for one triangle of the bottom cap
                vertices.push(
                    0, -0.5, 0,     // center
                    x1, -0.5, z1,   // point1
                    x2, -0.5, z2    // point2
                );

                // Add normals (pointing down)
                for (let j = 0; j < 3; j++) {
                    normals.push(0, -1, 0);
                    generatedColors.push(...bottomColor);
                }

                // Add texture coordinates
                texCoords.push(
                    0.5, 0.5,
                    x1 + 0.5, z1 + 0.5,
                    x2 + 0.5, z2 + 0.5
                );

                // Add indices
                const bottomOffset = topCapVertexCount + i * 3;
                indices.push(
                    bottomOffset,      // center
                    bottomOffset + 1,  // point1
                    bottomOffset + 2   // point2
                );
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

    public static create(props: CylinderProps = {}): SceneObject {
        const meshData = this.generateMeshData(props.sides || 32, props.smoothShading ?? true, props.colors);
        
        // Create and setup VAO
        const vao = new VertexArray(glob.ctx);
        vao.bind();

        // Create and setup vertex buffer
        const vertexBuffer = new VertexBuffer(glob.ctx);
        vertexBuffer.setData(meshData.vertices);
        vao.setAttributePointer(
            glob.shaderManager.getAttributeLocation('aPosition'),
            3,
            glob.ctx.FLOAT,
            false,
            0,
            0
        );

        // Create and setup color buffer
        const colorBuffer = new VertexBuffer(glob.ctx);
        colorBuffer.setData(meshData.colors!);
        vao.setAttributePointer(
            glob.shaderManager.getAttributeLocation('aColor'),
            3,
            glob.ctx.FLOAT,
            false,
            0,
            0
        );

        // Create and setup normal buffer
        const normalBuffer = new VertexBuffer(glob.ctx);
        normalBuffer.setData(meshData.normals!);
        vao.setAttributePointer(
            glob.shaderManager.getAttributeLocation('aNormal'),
            3,
            glob.ctx.FLOAT,
            false,
            0,
            0
        );

        // Create and setup texture coordinate buffer
        const texCoordBuffer = new VertexBuffer(glob.ctx);
        texCoordBuffer.setData(meshData.texCoords!);
        vao.setAttributePointer(
            glob.shaderManager.getAttributeLocation('aTexCoord'),
            2,
            glob.ctx.FLOAT,
            false,
            0,
            0
        );

        // Create and setup index buffer
        const indexBuffer = new IndexBuffer(glob.ctx);
        indexBuffer.setData(meshData.indices!);

        return new SceneObject({
            vao,
            indexBuffer,
            drawCount: meshData.indices!.length,
        }, props);
    }
}
