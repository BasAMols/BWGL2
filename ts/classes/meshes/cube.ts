import { vec3, mat4 } from 'gl-matrix';
import { MeshData } from '../webgl2/types';
import { VertexArray, VertexBuffer, IndexBuffer } from '../webgl2/buffer';
import { ShaderManager } from '../webgl2/shaderManager';
import { SceneObject } from '../webgl2/scene';

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

    public static createSceneObject(
        gl: WebGL2RenderingContext,
        shaderManager: ShaderManager,
        position: vec3 = vec3.fromValues(0, 0, 0),
        scale: vec3 = vec3.fromValues(1, 1, 1),
        rotation: vec3 = vec3.fromValues(0, 0, 0)
    ): SceneObject {
        const meshData = this.createMeshData();
        
        // Create and setup VAO
        const vao = new VertexArray(gl);
        vao.bind();

        // Create and setup vertex buffer
        const vertexBuffer = new VertexBuffer(gl);
        vertexBuffer.setData(meshData.vertices);
        vao.setAttributePointer(
            shaderManager.getAttributeLocation('aPosition'),
            3,
            gl.FLOAT,
            false,
            0,
            0
        );

        // Create and setup color buffer
        const colorBuffer = new VertexBuffer(gl);
        colorBuffer.setData(meshData.colors!);
        vao.setAttributePointer(
            shaderManager.getAttributeLocation('aColor'),
            3,
            gl.FLOAT,
            false,
            0,
            0
        );

        // Create and setup normal buffer
        const normalBuffer = new VertexBuffer(gl);
        normalBuffer.setData(meshData.normals!);
        vao.setAttributePointer(
            shaderManager.getAttributeLocation('aNormal'),
            3,
            gl.FLOAT,
            false,
            0,
            0
        );

        // Create and setup texture coordinate buffer
        const texCoordBuffer = new VertexBuffer(gl);
        texCoordBuffer.setData(meshData.texCoords!);
        vao.setAttributePointer(
            shaderManager.getAttributeLocation('aTexCoord'),
            2,
            gl.FLOAT,
            false,
            0,
            0
        );

        // Create and setup index buffer
        const indexBuffer = new IndexBuffer(gl);
        indexBuffer.setData(meshData.indices!);

        // Create model matrix
        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, position);
        mat4.rotateX(modelMatrix, modelMatrix, rotation[0]);
        mat4.rotateY(modelMatrix, modelMatrix, rotation[1]);
        mat4.rotateZ(modelMatrix, modelMatrix, rotation[2]);
        mat4.scale(modelMatrix, modelMatrix, scale);

        return {
            vao,
            indexBuffer,
            shaderManager,
            modelMatrix,
            drawMode: gl.TRIANGLES,
            drawCount: meshData.indices!.length,
            drawType: gl.UNSIGNED_SHORT
        };
    }
}
