import { MeshData } from '../types';
import { VertexArray, VertexBuffer, IndexBuffer } from '../buffer';
import { SceneObject } from './sceneObject';
import { m4 } from '../../util/math/matrix4';
import { Vector3 } from '../../util/math/vector3';
import { v3 } from '../../util/math/vector3';
import { glob } from '../../../game';

export class Cube {
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

    private static colors: Float32Array = new Float32Array([
        // Front face (red)
        0.8, 0.2, 0.2,
        0.8, 0.2, 0.2,
        0.8, 0.2, 0.2,
        0.8, 0.2, 0.2,
        // Back face (yellow)
        1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        // Right face (green)
        0.2, 0.8, 0.2,
        0.2, 0.8, 0.2,
        0.2, 0.8, 0.2,
        0.2, 0.8, 0.2,
        // Left face (purple)
        0.8, 0.2, 0.8,
        0.8, 0.2, 0.8,
        0.8, 0.2, 0.8,
        0.8, 0.2, 0.8,
        // Top face (blue)
        0.2, 0.2, 0.8,
        0.2, 0.2, 0.8,
        0.2, 0.2, 0.8,
        0.2, 0.2, 0.8,
        // Bottom face (orange)
        1.0, 0.5, 0.0,
        1.0, 0.5, 0.0,
        1.0, 0.5, 0.0,
        1.0, 0.5, 0.0
    ]);

    private static indices: Uint16Array = new Uint16Array([
        // Front
        0, 1, 2,    2, 3, 0,
        // Back
        4, 5, 6,    6, 7, 4,
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
    ]);

    public static createMeshData(): MeshData {
        return {
            vertices: this.vertices,
            indices: this.indices,
            normals: this.normals,
            texCoords: this.texCoords,
            colors: this.colors
        };
    }

    public static create(
        position: Vector3 = v3(0, 0, 0),
        scale: Vector3 = v3(1, 1, 1),
        rotation: Vector3 = v3(0, 0, 0)
    ): SceneObject {
        const meshData = this.createMeshData();
        
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

        // Create model matrix
        const modelMatrix = m4();
        modelMatrix.translate(position);
        modelMatrix.rotate(rotation);
        modelMatrix.scale(scale);

        return new SceneObject({
            vao,
            indexBuffer,
            shaderManager: glob.shaderManager,
            modelMatrix,
            drawMode: glob.ctx.TRIANGLES,
            drawCount: meshData.indices!.length,
            drawType: glob.ctx.UNSIGNED_SHORT
        });
    }
}
