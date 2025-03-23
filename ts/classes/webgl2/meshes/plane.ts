import { MeshData } from '../types';
import { VertexArray, VertexBuffer, IndexBuffer } from '../buffer';
import { SceneObject, SceneObjectProps } from './sceneObject';
import { glob } from '../../../game';

export interface PlaneProps extends SceneObjectProps {
    color?: [number, number, number];
    flipNormal?: boolean;
}

export class Plane {
    private static vertices: Float32Array = new Float32Array([
        // Single face (square)
        -0.5, 0.0, -0.5,  // bottom-left
         0.5, 0.0, -0.5,  // bottom-right
         0.5, 0.0,  0.5,  // top-right
        -0.5, 0.0,  0.5   // top-left
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

    private static generateColors(color?: [number, number, number]): Float32Array {
        const defaultColor: [number, number, number] = [0.8, 0.8, 0.8]; // Default to light gray
        const useColor = color || defaultColor;
        
        // Four vertices need the same color
        return new Float32Array([
            ...useColor,
            ...useColor,
            ...useColor,
            ...useColor
        ]);
    }

    public static createMeshData(props: PlaneProps = {}): MeshData {
        return {
            vertices: this.vertices,
            indices: this.generateIndices(props.flipNormal || false),
            normals: this.generateNormals(props.flipNormal || false),
            texCoords: this.texCoords,
            colors: this.generateColors(props.color)
        };
    }

    public static create(props: PlaneProps = {}): SceneObject {
        const meshData = this.createMeshData(props);
        
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