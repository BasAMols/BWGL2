import * as FBXParser from 'fbx-parser';
import { MeshData } from './types';
import { Material } from '../material';
import { SceneObject } from './sceneObject';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { v3 } from '../../util/math/vector3';
import { ContainerObject } from './containerObject';
import { glob } from '../../../game';
import { Util } from '../../util/utils';

// Base FBX node types
interface FBXNodeBase {
    name: string;
    props: unknown[];
    nodes?: FBXNodeBase[];
}

interface FBXValueNode extends FBXNodeBase {
    value: number | string | number[];
}

// Geometry-specific types
interface FBXGeometryValueNode extends FBXNodeBase {
    value: number[] | string | number;
}

interface FBXGeometryPropertyNode extends FBXNodeBase {
    nodes: FBXGeometryValueNode[];
}

interface FBXGeometryNode extends FBXNodeBase {
    name: 'Geometry';
    nodes: FBXGeometryPropertyNode[];
}

// Material-specific types
interface FBXMaterialValueNode extends FBXNodeBase {
    value: number | string;
}

interface FBXMaterialPropertyNode extends FBXNodeBase {
    nodes: FBXMaterialValueNode[];
}

interface FBXMaterialNode extends FBXNodeBase {
    name: 'Material';
    nodes: FBXMaterialPropertyNode[];
}

// Connection-specific types
interface FBXConnectionValueNode extends FBXNodeBase {
    value: number | string;
}

interface FBXConnectionNode extends FBXNodeBase {
    name: 'Connections';
    nodes: FBXConnectionValueNode[];
}

// Add texture-specific types
interface FBXTextureValueNode extends FBXNodeBase {
    value: string;
}

interface FBXTexturePropertyNode extends FBXNodeBase {
    nodes: FBXTextureValueNode[];
}

interface FBXTextureNode extends FBXNodeBase {
    name: 'Texture';
    nodes: FBXTexturePropertyNode[];
}

interface FBXVideoNode extends FBXNodeBase {
    name: 'Video';
    nodes: FBXTexturePropertyNode[];
}

// Objects node type
interface FBXObjectsNode extends FBXNodeBase {
    name: 'Objects';
    nodes: Array<FBXGeometryNode | FBXMaterialNode | FBXTextureNode | FBXVideoNode | FBXNodeBase>;
}

// Root node type
type FBXNode = FBXGeometryNode | FBXMaterialNode | FBXConnectionNode | FBXObjectsNode | FBXNodeBase;

// Add smoothShading to props interface
export interface FBXLoaderProps extends BaseMeshProps {
    gl?: WebGL2RenderingContext;
}

export class FBXLoader extends BaseMesh {
    private static parseMesh(fbxMesh: FBXGeometryNode, smoothShading: boolean = true): MeshData {
        // Get vertices and indices
        const verticesNode = fbxMesh.nodes.find(n => n.name === 'Vertices');
        const vertices = verticesNode?.props[0] as number[] || [];
        const indicesNode = fbxMesh.nodes.find(n => n.name === 'PolygonVertexIndex');
        const indices = (indicesNode?.props[0] as number[] || []).map(index =>
            index < 0 ? (-index - 1) : index
        );

        // Get UV coordinates (for texture mapping)
        const layerElementUV = fbxMesh.nodes.find(n => n.name === 'LayerElementUV');
        const uvsNode = layerElementUV?.nodes.find(n => n.name === 'UV');
        const uvIndexNode = layerElementUV?.nodes.find(n => n.name === 'UVIndex');

        const uvs = uvsNode?.props[0] as number[] || [];
        const uvIndices = uvIndexNode?.props[0] as number[] || indices;
        const uvPairs = Util.duplicate(
            Util.chunk(uvs, 2).map(([u, v]: [number, number]) => [u, 1.0 - v]) as [number, number][],
            1
        ) as [number, number][];


        // Helper function to normalize a vector
        const normalizeVector = (x: number, y: number, z: number) => {
            const length = Math.sqrt(x * x + y * y + z * z);
            if (length === 0) return [0, 1, 0]; // Default up vector if invalid
            return [x / length, y / length, z / length];
        };

        // Helper function to transform vertices from FBX coordinate system
        const transformVertex = (x: number, y: number, z: number) => {
            // Transform based on FBX normal data:
            // Original [0,1,0] should be top (red)
            // Original [0,-1,0] should be bottom (green)
            // Original [0,0,-1] should be back (yellow)
            return [x, z, -y];
        };

        // For flat shading, we need to duplicate vertices for each face
        const flatVertices: number[] = [];
        const flatNormals: number[] = [];
        const flatIndices: number[] = [];
        const flatTexCoords: number[] = [];
        const flatTangents: number[] = [];
        const flatBitangents: number[] = [];

        // Process all triangles in the mesh
        for (let i = 0; i < indices.length; i += 3) {
            // Get vertex indices for this triangle
            const v1Index = indices[i] * 3;
            const v2Index = indices[i + 1] * 3;
            const v3Index = indices[i + 2] * 3;

            // Get vertices and transform them
            const v1 = transformVertex(
                vertices[v1Index],
                vertices[v1Index + 1],
                vertices[v1Index + 2]
            );
            const v2 = transformVertex(
                vertices[v2Index],
                vertices[v2Index + 1],
                vertices[v2Index + 2]
            );
            const v3 = transformVertex(
                vertices[v3Index],
                vertices[v3Index + 1],
                vertices[v3Index + 2]
            );

            // Get texture coordinates
            const uv1 = uvPairs[uvIndices[i]];
            const uv2 = uvPairs[uvIndices[i + 1]];
            const uv3 = uvPairs[uvIndices[i + 2]];

            // Calculate face normal
            const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
            const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
            const normal = normalizeVector(
                edge1[1] * edge2[2] - edge1[2] * edge2[1],
                edge1[2] * edge2[0] - edge1[0] * edge2[2],
                edge1[0] * edge2[1] - edge1[1] * edge2[0]
            );

            // Calculate tangent and bitangent
            const deltaUV1 = [uv2[0] - uv1[0], uv2[1] - uv1[1]];
            const deltaUV2 = [uv3[0] - uv1[0], uv3[1] - uv1[1]];

            const f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]);

            const tangent = normalizeVector(
                f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
                f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
                f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])
            );

            const bitangent = normalizeVector(
                f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]),
                f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]),
                f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2])
            );

            const vertexCount = Math.floor(flatVertices.length / 3);

            // Add triangle vertices
            flatVertices.push(...v1, ...v2, ...v3);
            flatTexCoords.push(...uv1, ...uv2, ...uv3);
            flatNormals.push(...normal, ...normal, ...normal);
            flatTangents.push(...tangent, ...tangent, ...tangent);
            flatBitangents.push(...bitangent, ...bitangent, ...bitangent);
            flatIndices.push(vertexCount, vertexCount + 1, vertexCount + 2);
        }

        return {
            vertices: new Float32Array(flatVertices),
            indices: new Uint16Array(flatIndices),
            normals: new Float32Array(flatNormals),
            texCoords: new Float32Array(flatTexCoords),
            tangents: new Float32Array(flatTangents),
            bitangents: new Float32Array(flatBitangents)
        };
    }

    private static async parseMaterial(fbxMaterial: FBXMaterialNode, fbxData: FBXNode[]): Promise<Material> {
        // Extract material properties from FBX
        const properties = fbxMaterial.nodes.find(n => n.name === 'Properties70')?.nodes || [];

        // Default material properties
        let baseColor = v3(0.8, 0.2, 0.2);  // Default to red
        let roughness = 1;
        let metallic = 0.0;
        let ambientOcclusion = 1.0;
        let emissive = v3(0, 0, 0);
        let albedoMap: WebGLTexture | undefined;
        let metallicMap: WebGLTexture | undefined;
        let roughnessMap: WebGLTexture | undefined;
        let normalMap: WebGLTexture | undefined;
        let emissiveMap: WebGLTexture | undefined;
        let emissiveStrengthMap: WebGLTexture | undefined;

        // Find textures connected to this material
        const objectsNode = fbxData.find(node => node.name === 'Objects') as FBXObjectsNode;
        const connectionsNode = fbxData.find(node => node.name === 'Connections') as FBXConnectionNode;

        // Find texture nodes
        const textures = objectsNode.nodes.filter(n => n.name === 'Texture') as FBXTextureNode[];

        // Get material ID from the material's properties
        const materialId = fbxMaterial.props[0];
        // Find texture connections (look for both directions)
        const textureConnections = connectionsNode.nodes.filter(c => {
            const conn = c as FBXConnectionValueNode;
            const isConnectedToMaterial = conn.props[0] === materialId || conn.props[1] === materialId;
            const isConnectedToTexture = textures.some(t => {
                const textureId = t.props[0];
                return conn.props[0] === textureId || conn.props[1] === textureId;
            });
            return isConnectedToMaterial || isConnectedToTexture;
        });

        // Process each texture connection
        for (const connection of textureConnections) {
            const textureNode = textures.find(t => {
                const textureId = t.props[0];
                return textureId === (connection as FBXConnectionValueNode).props[0] ||
                    textureId === (connection as FBXConnectionValueNode).props[1];
            });

            if (textureNode) {
                const textureName = textureNode.nodes.find(n => n.name === 'TextureName')?.props[0] as string;
                const relativeFilename = textureNode.nodes.find(n => n.name === 'RelativeFilename')?.props[0] as string;

                if (relativeFilename) {
                    try {
                        const texture = await this.createTextureFromFile(relativeFilename);

                        // Determine texture type from the connection or name
                        if (textureName?.toLowerCase().includes('diffuse') ||
                            textureName?.toLowerCase().includes('base_color')) {
                            albedoMap = texture;
                            baseColor = v3(1, 1, 1); // Set base color to white to let texture color show through
                        } else if (textureName?.toLowerCase().includes('metallic') ||
                                 textureName?.toLowerCase().includes('metalness')) {
                            metallicMap = texture;
                            metallic = 1.0; // Set metallic to 1.0 to let texture control it
                        } else if (textureName?.toLowerCase().includes('roughness')) {
                            roughnessMap = texture;
                            roughness = 1.0; // Set roughness to 1.0 to let texture control it
                        } else if (textureName?.toLowerCase().includes('normal') ||
                                 textureName?.toLowerCase().includes('bump')) {
                            normalMap = texture;
                        } else if (textureName?.toLowerCase().includes('emission') ||
                                 textureName?.toLowerCase().includes('emissive')) {
                            if (textureName?.toLowerCase().includes('strength')) {
                                emissiveStrengthMap = texture;
                            } else {
                                emissiveMap = texture;
                                emissive = v3(1, 1, 1); // Set emissive to white to let texture control it
                            }
                        }
                    } catch (error) {
                        console.error('Failed to load texture:', error);
                    }
                }
            }
        }

        // Parse material properties
        for (const prop of properties) {
            if (!Array.isArray(prop.props)) continue;

            const propName = prop.props[0] as string;
            const propType = prop.props[1] as string;

            const isColorProp = propType === 'Color' || propType === 'ColorRGB';
            const colorValues = isColorProp ? [
                prop.props[4] as number,
                prop.props[5] as number,
                prop.props[6] as number
            ] : null;

            switch (propName) {
                case 'DiffuseColor':
                case 'Diffuse':
                    if (colorValues && !albedoMap) {
                        baseColor = v3(colorValues[0], colorValues[1], colorValues[2]);
                    }
                    break;
                case 'Roughness':
                case 'Roughness Factor':
                    roughness = Number(prop.props[4]) || 0.5;
                    break;
                case 'ShininessExponent':
                    const shininess = Number(prop.props[4]) || 50;
                    roughness = 1.0 - Math.min(shininess / 100.0, 1.0);
                    break;
                case 'Metallic':
                case 'MetallicFactor':
                    metallic = Number(prop.props[4]) || 0.0;
                    break;
                case 'SpecularFactor':
                    metallic = Math.min(Number(prop.props[4]) || 0.0, 1.0);
                    break;
                case 'AmbientColor':
                case 'Ambient':
                    if (colorValues) {
                        ambientOcclusion = (colorValues[0] + colorValues[1] + colorValues[2]) / 3;
                    }
                    break;
                case 'EmissiveColor':
                case 'Emissive':
                    if (colorValues) {
                        const emissiveFactor = properties.find(p =>
                            p.props[0] === 'EmissiveFactor'
                        )?.props[4] as number || 1.0;

                        emissive = v3(
                            colorValues[0] * emissiveFactor,
                            colorValues[1] * emissiveFactor,
                            colorValues[2] * emissiveFactor
                        );
                    }
                    break;
            }
        }

        // Return the material with all maps
        return new Material({
            baseColor,
            roughness,
            metallic,
            ambientOcclusion,
            emissive,
            albedoMap,
            metallicMap,
            roughnessMap,
            normalMap,
            emissiveMap,
            emissiveStrengthMap
        });
    }

    // Helper function to create a texture from a file
    private static async createTextureFromFile(filename: string): Promise<WebGLTexture> {
        // Create a new image element
        const image = new Image();

        // Set up a promise to handle the image loading
        const texturePromise = new Promise<WebGLTexture>((resolve, reject) => {
            image.onload = () => {
                try {
                    // Get WebGL context from global
                    const gl = glob.ctx;
                    if (!gl) {
                        throw new Error('WebGL context not available');
                    }

                    // Create and bind texture
                    const texture = gl.createTexture();
                    if (!texture) {
                        throw new Error('Failed to create texture');
                    }

                    gl.bindTexture(gl.TEXTURE_2D, texture);

                    // Set texture parameters
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    // Upload the image into the texture
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

                    // Generate mipmaps
                    gl.generateMipmap(gl.TEXTURE_2D);

                    resolve(texture);
                } catch (error) {
                    reject(error);
                }
            };

            image.onerror = () => reject(new Error(`Failed to load texture: ${filename}`));
        });
        // Set the image source to start loading - use the same directory as the FBX
        image.src = `/fbx/${filename}`;

        return texturePromise;
    }

    public static async loadFromBuffer(buffer: ArrayBuffer, props: FBXLoaderProps = {}): Promise<SceneObject> {
        try {
            const fbxData = FBXParser.parseBinary(new Uint8Array(buffer)) as FBXNode[];
            const container = new ContainerObject();
            const objectsNode = fbxData.find(node => node.name === 'Objects') as FBXObjectsNode;

            if (!objectsNode) {
                throw new Error('No Objects node found in FBX file');
            }

            // Type guard functions
            const isGeometryNode = (node: FBXNode): node is FBXGeometryNode =>
                node.name === 'Geometry';
            const isMaterialNode = (node: FBXNode): node is FBXMaterialNode =>
                node.name === 'Material';

            const geometries = objectsNode.nodes.filter(isGeometryNode);
            const materials = objectsNode.nodes.filter(isMaterialNode);

            for (const geometry of geometries) {
                const meshData = this.parseMesh(geometry);

                // Find associated material if any
                const connectionsNode = fbxData.find(node => node.name === 'Connections') as FBXConnectionNode | undefined;
                const connections = connectionsNode?.nodes || [];

                const materialConnection = connections
                    .find(c => {
                        const geomValue = (geometry.nodes[0]?.nodes[0] as FBXGeometryValueNode)?.value;
                        const matValue = materials.some((m: FBXMaterialNode) =>
                            (m.nodes[0]?.nodes[0] as FBXMaterialValueNode)?.value === (c as FBXConnectionValueNode).value
                        );
                        return (c as FBXConnectionValueNode).value === geomValue && matValue;
                    });

                let material: Material | undefined;
                if (materialConnection) {
                    const materialNode = materials.find((m: FBXMaterialNode) =>
                        (m.nodes[0]?.nodes[0] as FBXMaterialValueNode)?.value === (materialConnection as FBXConnectionValueNode).value
                    );
                    if (materialNode) {
                        material = await this.parseMaterial(materialNode, fbxData);
                    }
                }

                // If no material found in FBX, use default gray
                if (!material) {
                    material = new Material({
                        baseColor: v3(0.8, 0.8, 0.8),
                        roughness: 0.5,
                        metallic: 0.0,
                        ambientOcclusion: 1.0,
                        emissive: v3(0, 0, 0)
                    });
                }

                const sceneObject = this.createSceneObject(meshData, { ...props, material });
                container.addChild(sceneObject);
            }

            return container;
        } catch (error) {
            console.error('Error loading FBX:', error);
            throw error;
        }
    }

    public static async loadFromUrl(url: string, props: FBXLoaderProps = {}): Promise<SceneObject> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch FBX file: ${response.statusText}`);
            }
            const buffer = await response.arrayBuffer();
            return this.loadFromBuffer(buffer, props);
        } catch (error) {
            console.error('Error loading FBX from URL:', error);
            throw error;
        }
    }
} 