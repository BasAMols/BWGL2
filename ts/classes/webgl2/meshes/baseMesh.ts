import { MeshData } from './types';
import { VertexArray, VertexBuffer, IndexBuffer } from '../buffer';
import { SceneObject, SceneObjectProps } from './sceneObject';
import { glob } from '../../../game';
import { Material } from '../material';

export interface BaseMeshProps extends SceneObjectProps {
    colors?: [number, number, number] | Array<[number, number, number]>;
    ignoreLighting?: boolean;
    material?: Material;
}

export abstract class BaseMesh extends SceneObject {
    protected static setupBuffers(meshData: MeshData, props: BaseMeshProps): {
        vao: VertexArray;
        indexBuffer: IndexBuffer;
        drawCount: number;
        ignoreLighting: boolean;
    } {
        // Create and setup VAO
        const vao = new VertexArray(glob.ctx);
        vao.bind();

        // Create and setup vertex buffer
        const vertexBuffer = new VertexBuffer(glob.ctx);
        vertexBuffer.setData(meshData.vertices);
        vao.setAttributePointer(
            SceneObject.getAttributeLocation('position'),
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
            SceneObject.getAttributeLocation('color'),
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
            SceneObject.getAttributeLocation('normal'),
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
            SceneObject.getAttributeLocation('texCoord'),
            2,
            glob.ctx.FLOAT,
            false,
            0,
            0
        );

        // Create and setup tangent buffer if available
        if (meshData.tangents) {
            const tangentBuffer = new VertexBuffer(glob.ctx);
            tangentBuffer.setData(meshData.tangents);
            vao.setAttributePointer(
                SceneObject.getAttributeLocation('tangent'),
                3,
                glob.ctx.FLOAT,
                false,
                0,
                0
            );
        }

        // Create and setup bitangent buffer if available
        if (meshData.bitangents) {
            const bitangentBuffer = new VertexBuffer(glob.ctx);
            bitangentBuffer.setData(meshData.bitangents);
            vao.setAttributePointer(
                SceneObject.getAttributeLocation('bitangent'),
                3,
                glob.ctx.FLOAT,
                false,
                0,
                0
            );
        }

        // Create and setup index buffer
        const indexBuffer = new IndexBuffer(glob.ctx);
        indexBuffer.setData(meshData.indices!);

        return {
            vao,
            indexBuffer,
            drawCount: meshData.indices!.length,
            ignoreLighting: props.ignoreLighting ?? false
        };
    }

    protected static createSceneObject(meshData: MeshData, props: BaseMeshProps): SceneObject {
        const bufferData = this.setupBuffers(meshData, props);
        return new SceneObject(bufferData, props);
    }

    public constructor(meshData: MeshData, props: BaseMeshProps = {}) {
        super(BaseMesh.setupBuffers(meshData, props), props);
    }
} 