export interface MeshData {
    vertices: Float32Array;
    indices?: Uint16Array;
    normals?: Float32Array;
    texCoords?: Float32Array;
    colors?: Float32Array;
    tangents?: Float32Array;
    bitangents?: Float32Array;
} 