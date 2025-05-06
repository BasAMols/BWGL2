import * as FBXParser from 'fbx-parser';
import { MeshData } from './types';
import { Material } from '../material';
import { SceneObject } from './sceneObject';
import { BaseMesh, BaseMeshProps } from './baseMesh';
import { v3 } from '../../util/math/vector3';
import { glob } from '../../../game';
import { Util } from '../../util/utils';
import { UrlUtils } from '../../util/urlUtils';

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

// Private namespace for FBXLoader types
namespace FBXLoaderTypes {
    export interface ProcessedFBXData {
        geometries: FBXGeometryNode[];
        materials: Map<string | number, Material>;
        geometryMaterialMap: Map<string | number, Material>;
    }
}

export class FBXLoader extends BaseMesh {
    private static CHUNK_SIZE = 65536; // Maximum vertices per chunk

    private static async processFBXData(fbxData: FBXNode[]): Promise<FBXLoaderTypes.ProcessedFBXData> {
        const objectsNode = fbxData.find(node => node.name === 'Objects') as FBXObjectsNode;
        const connectionsNode = fbxData.find(node => node.name === 'Connections') as FBXConnectionNode;

        if (!objectsNode) throw new Error('No Objects node found in FBX file');
        if (!connectionsNode) throw new Error('No Connections node found in FBX file');

        // Get all geometries and materials
        const geometries = objectsNode.nodes.filter((node): node is FBXGeometryNode => node.name === 'Geometry');
        const materialNodes = objectsNode.nodes.filter((node): node is FBXMaterialNode => node.name === 'Material');

        // First, parse all materials
        const materials = new Map<string | number, Material>();
        for (const matNode of materialNodes) {
            const matId = matNode.props[0] as string | number;
            const material = await this.parseMaterial(matNode, fbxData);
            materials.set(matId, material);
        }

        // Then process all connections to create geometry->material mapping
        const geometryMaterialMap = new Map<string | number, Material>();
        
        // First, create a map of type -> [connected IDs]
        const typeConnections = new Map<number, Set<string | number>>();
        for (const conn of connectionsNode.nodes) {
            const props = (conn as FBXConnectionValueNode).props;
            const sourceId = props[0] as string | number;
            const destId = props[1] as string | number;
            const type = props[2] as number;

            if (type) {
                if (!typeConnections.has(type)) {
                    typeConnections.set(type, new Set());
                }
                typeConnections.get(type)?.add(destId);
            }
        }

        // Then find materials and geometries that share the same type
        for (const [type, connectedIds] of typeConnections) {
            // Find if this type connects to any materials
            const materialId = Array.from(connectedIds).find(id => materials.has(id));
            if (materialId) {
                const material = materials.get(materialId);
                if (material) {
                    // Find geometries connected to this same type
                    const geometryIds = Array.from(connectedIds).filter(id => 
                        geometries.some(g => g.props[0] === id)
                    );
                    
                    for (const geometryId of geometryIds) {
                        geometryMaterialMap.set(geometryId, material);
                    }
                }
            }
        }

        return {
            geometries,
            materials,
            geometryMaterialMap
        };
    }

    private static chunkMesh(vertices: number[], indices: number[], normals: number[], texCoords: number[], tangents: number[], bitangents: number[]): MeshData[] {
        const chunks: MeshData[] = [];
        const vertexCount = vertices.length / 3;
        
        // If under limit, return as single chunk
        if (vertexCount <= FBXLoader.CHUNK_SIZE) {
            return [{
                vertices: new Float32Array(vertices),
                indices: new Uint16Array(indices),
                normals: new Float32Array(normals),
                texCoords: new Float32Array(texCoords),
                tangents: new Float32Array(tangents),
                bitangents: new Float32Array(bitangents)
            }];
        }

        // Split into chunks
        let currentChunkVertices: number[] = [];
        let currentChunkIndices: number[] = [];
        let currentChunkNormals: number[] = [];
        let currentChunkTexCoords: number[] = [];
        let currentChunkTangents: number[] = [];
        let currentChunkBitangents: number[] = [];
        let vertexIndexMap = new Map<number, number>();
        let nextIndex = 0;

        for (let i = 0; i < indices.length; i += 3) {
            const faceIndices = [indices[i], indices[i + 1], indices[i + 2]];
            const faceVertCount = currentChunkVertices.length / 3;

            // If this face would exceed chunk size, start new chunk
            if (faceVertCount + 3 > FBXLoader.CHUNK_SIZE) {
                // Add current chunk to chunks array
                chunks.push({
                    vertices: new Float32Array(currentChunkVertices),
                    indices: new Uint16Array(currentChunkIndices),
                    normals: new Float32Array(currentChunkNormals),
                    texCoords: new Float32Array(currentChunkTexCoords),
                    tangents: new Float32Array(currentChunkTangents),
                    bitangents: new Float32Array(currentChunkBitangents)
                });

                // Reset for next chunk
                currentChunkVertices = [];
                currentChunkIndices = [];
                currentChunkNormals = [];
                currentChunkTexCoords = [];
                currentChunkTangents = [];
                currentChunkBitangents = [];
                vertexIndexMap.clear();
                nextIndex = 0;
            }

            // Add face to current chunk
            for (const oldIndex of faceIndices) {
                let newIndex = vertexIndexMap.get(oldIndex);
                if (newIndex === undefined) {
                    newIndex = nextIndex++;
                    vertexIndexMap.set(oldIndex, newIndex);

                    // Add vertex data
                    const vIdx = oldIndex * 3;
                    currentChunkVertices.push(vertices[vIdx], vertices[vIdx + 1], vertices[vIdx + 2]);
                    currentChunkNormals.push(normals[vIdx], normals[vIdx + 1], normals[vIdx + 2]);
                    
                    const tIdx = oldIndex * 2;
                    currentChunkTexCoords.push(texCoords[tIdx], texCoords[tIdx + 1]);
                    
                    const tanIdx = oldIndex * 3;
                    currentChunkTangents.push(tangents[tanIdx], tangents[tanIdx + 1], tangents[tanIdx + 2]);
                    currentChunkBitangents.push(bitangents[tanIdx], bitangents[tanIdx + 1], bitangents[tanIdx + 2]);
                }
                currentChunkIndices.push(newIndex);
            }
        }

        // Add final chunk if not empty
        if (currentChunkVertices.length > 0) {
            chunks.push({
                vertices: new Float32Array(currentChunkVertices),
                indices: new Uint16Array(currentChunkIndices),
                normals: new Float32Array(currentChunkNormals),
                texCoords: new Float32Array(currentChunkTexCoords),
                tangents: new Float32Array(currentChunkTangents),
                bitangents: new Float32Array(currentChunkBitangents)
            });
        }

        return chunks;
    }

    private static parseMesh(fbxMesh: FBXGeometryNode, smoothShading: boolean = true): MeshData[] {
        // Get vertices and indices
        const verticesNode = fbxMesh.nodes.find(n => n.name === 'Vertices');
        const vertices = verticesNode?.props[0] as number[] || [];
        const indicesNode = fbxMesh.nodes.find(n => n.name === 'PolygonVertexIndex');
        const rawIndices = indicesNode?.props[0] as number[] || [];
        
        // Convert polygon indices to triangle indices
        const indices: number[] = [];
        let currentPolygon: number[] = [];
        
        // Process each index
        rawIndices.forEach((index) => {
            // If negative, it's the last vertex of the polygon
            const actualIndex = index < 0 ? (-index - 1) : index;
            currentPolygon.push(actualIndex);
            
            if (index < 0) {
                // End of polygon - triangulate
                for (let i = 1; i < currentPolygon.length - 1; i++) {
                    indices.push(
                        currentPolygon[0],
                        currentPolygon[i],
                        currentPolygon[i + 1]
                    );
                }
                currentPolygon = [];
            }
        });

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
            const v1Index = indices[i] * 3;
            const v2Index = indices[i + 1] * 3;
            const v3Index = indices[i + 2] * 3;

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

            const uv1 = uvPairs[uvIndices[i]] || [0, 0];
            const uv2 = uvPairs[uvIndices[i + 1]] || [0, 0];
            const uv3 = uvPairs[uvIndices[i + 2]] || [0, 0];

            const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
            const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
            const normal = normalizeVector(
                edge1[1] * edge2[2] - edge1[2] * edge2[1],
                edge1[2] * edge2[0] - edge1[0] * edge2[2],
                edge1[0] * edge2[1] - edge1[1] * edge2[0]
            );

            const deltaUV1 = [uv2[0] - uv1[0], uv2[1] - uv1[1]];
            const deltaUV2 = [uv3[0] - uv1[0], uv3[1] - uv1[1]];

            const f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1] || 1.0);

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

            flatVertices.push(...v1, ...v2, ...v3);
            flatTexCoords.push(...uv1, ...uv2, ...uv3);
            flatNormals.push(...normal, ...normal, ...normal);
            flatTangents.push(...tangent, ...tangent, ...tangent);
            flatBitangents.push(...bitangent, ...bitangent, ...bitangent);
            flatIndices.push(vertexCount, vertexCount + 1, vertexCount + 2);
        }

        // Instead of returning a single MeshData, we return chunks
        return FBXLoader.chunkMesh(
            flatVertices,
            flatIndices,
            flatNormals,
            flatTexCoords,
            flatTangents,
            flatBitangents
        );
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

            image.onerror = (err) => {
                console.error(`Failed to load texture: ${filename}`, err);
                reject(new Error(`Failed to load texture: ${filename}`));
            };
        });
        
        // Make the path relative to the current app, not root-relative
        const texturePath = `fbx/${filename}`.replace(/^\//, '');
        
        // Construct the full URL using UrlUtils
        image.src = UrlUtils.resolveUrl(texturePath);
        

        return texturePromise;
    }

    public static async loadFromBuffer(buffer: ArrayBuffer, props: FBXLoaderProps = {}): Promise<SceneObject[]> {
        try {
            const fbxData = FBXParser.parseBinary(new Uint8Array(buffer)) as FBXNode[];
            const processedData = await this.processFBXData(fbxData);
            const objects: SceneObject[] = [];

            // Now we can simply create chunks with the pre-processed data
            for (const geometry of processedData.geometries) {
                const geometryId = geometry.props[0] as string | number;
                const material = processedData.geometryMaterialMap.get(geometryId);
                const meshDataChunks = this.parseMesh(geometry);
                for (const meshData of meshDataChunks) {
                    const sceneObject = this.createSceneObject(meshData, {
                        ...props,
                        material
                    });
                    objects.push(sceneObject);
                }
            }

            return objects;
        } catch (error) {
            console.error('Error loading FBX:', error);
            throw error;
        }
    }

    public static async loadFromUrl(url: string, props: FBXLoaderProps = {}): Promise<SceneObject[]> {
        try {
            // Resolve the URL using UrlUtils
            const fullUrl = UrlUtils.resolveUrl(url);
            
            const response = await fetch(fullUrl);
            if (!response.ok) {
                console.error(`Failed to fetch FBX file: ${response.statusText} (${response.status}) from ${fullUrl}`);
                throw new Error(`Failed to fetch FBX file: ${response.statusText} (${response.status})`);
            }
            const buffer = await response.arrayBuffer();
            const data = await this.loadFromBuffer(buffer, props);
            return data;
        } catch (error) {
            console.error(`Error loading FBX from URL: ${url}`, error);
            throw error;
        }
    }
} 