import { MeshData } from '../types';
import { VertexArray, VertexBuffer, IndexBuffer } from '../buffer';
import { SceneObject, SceneObjectProps } from './sceneObject';
import { glob } from '../../../game';

export interface WedgeProps extends SceneObjectProps {
    // Colors for [front, back, bottom, hypotenuse]
    colors?: [number, number, number] | Array<[number, number, number]>;
}

export class Wedge {
    private static generateMeshData(colors?: [number, number, number] | Array<[number, number, number]>): MeshData {
        const vertices: number[] = [
            // Front triangle
            -0.5, -0.5,  0.5,  // 0
             0.5, -0.5,  0.5,  // 1
            -0.5,  0.5,  0.5,  // 2
            // Back triangle
            -0.5, -0.5, -0.5,  // 3
             0.5, -0.5, -0.5,  // 4
            -0.5,  0.5, -0.5,  // 5
            // Additional vertices for sides
             0.5, -0.5,  0.5,  // 6 (1)
             0.5, -0.5, -0.5,  // 7 (4)
            -0.5,  0.5,  0.5,  // 8 (2)
            -0.5,  0.5, -0.5,  // 9 (5)
            -0.5, -0.5,  0.5,  // 10 (0)
            -0.5, -0.5, -0.5   // 11 (3)
        ];

        const indices: number[] = [
            // Front triangle
            0, 1, 2,
            // Back triangle
            3, 5, 4,
            // Bottom rectangle
            10, 6, 11,
            11, 6, 7,
            // Hypotenuse rectangle
            8, 9, 6,
            6, 9, 7
        ];

        const normals: number[] = [
            // Front triangle
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            // Back triangle
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            // Additional vertices for sides
            0.7071, 0.7071, 0,  // Hypotenuse normal
            0.7071, 0.7071, 0,
            0.7071, 0.7071, 0,
            0.7071, 0.7071, 0,
            0, -1, 0,           // Bottom normal
            0, -1, 0
        ];

        // Default colors
        const defaultColors: Array<[number, number, number]> = [
            [0.8, 0.2, 0.2], // Front
            [1.0, 1.0, 0.0], // Back
            [0.2, 0.8, 0.2], // Bottom
            [0.8, 0.2, 0.8]  // Hypotenuse
        ];

        let faceColors = defaultColors;
        if (colors) {
            if (Array.isArray(colors[0])) {
                faceColors = colors as Array<[number, number, number]>;
                if (faceColors.length !== 4) {
                    throw new Error('Must provide exactly 4 colors for faces or a single color');
                }
            } else {
                const singleColor = colors as [number, number, number];
                faceColors = Array(4).fill(singleColor);
            }
        }

        const generatedColors: number[] = [
            ...faceColors[0], ...faceColors[0], ...faceColors[0],  // Front
            ...faceColors[1], ...faceColors[1], ...faceColors[1],  // Back
            ...faceColors[2], ...faceColors[2], ...faceColors[2], ...faceColors[2],  // Bottom
            ...faceColors[3], ...faceColors[3], ...faceColors[3], ...faceColors[3]   // Hypotenuse
        ];

        const texCoords: number[] = [
            // Front triangle
            0, 0,
            1, 0,
            0, 1,
            // Back triangle
            1, 0,
            0, 0,
            0, 1,
            // Additional vertices
            1, 0,
            1, 1,
            0, 0,
            0, 1,
            0, 0,
            1, 0
        ];

        return {
            vertices: new Float32Array(vertices),
            indices: new Uint16Array(indices),
            normals: new Float32Array(normals),
            colors: new Float32Array(generatedColors),
            texCoords: new Float32Array(texCoords)
        };
    }

    public static create(props: WedgeProps = {}): SceneObject {
        const meshData = this.generateMeshData(props.colors);
        
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