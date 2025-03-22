import { vec2, vec3, vec4, mat4 } from 'gl-matrix';

export interface Vertex {
    position: vec3;
    normal?: vec3;
    texCoord?: vec2;
    color?: vec4;
    tangent?: vec3;
    bitangent?: vec3;
}

export interface Material {
    ambient?: vec3;
    diffuse?: vec3;
    specular?: vec3;
    shininess?: number;
    diffuseMap?: WebGLTexture;
    normalMap?: WebGLTexture;
    specularMap?: WebGLTexture;
}

export interface Light {
    position: vec3;
    color: vec3;
    intensity: number;
    type: 'point' | 'directional' | 'spot';
    direction?: vec3;  // For directional and spot lights
    cutOff?: number;   // For spot lights
    outerCutOff?: number;  // For spot lights
    attenuation?: {
        constant: number;
        linear: number;
        quadratic: number;
    };
}

export interface ShaderSource {
    vertex: string;
    fragment: string;
}

export interface UniformBuffer {
    buffer: WebGLBuffer;
    layout: {
        [key: string]: {
            offset: number;
            type: string;
        };
    };
    size: number;
}

export interface RenderTarget {
    framebuffer: WebGLFramebuffer;
    colorTextures: WebGLTexture[];
    depthTexture?: WebGLTexture;
    width: number;
    height: number;
}

export type AttributeType = 
    | number
    | vec2
    | vec3
    | vec4
    | mat4;

export type UniformType = 
    | number
    | vec2
    | vec3
    | vec4
    | mat4
    | WebGLTexture;

export interface ShaderAttribute {
    location: number;
    size: number;
    type: number;
    normalized: boolean;
    stride: number;
    offset: number;
}

export interface MeshData {
    vertices: Float32Array;
    indices?: Uint16Array;
    normals?: Float32Array;
    texCoords?: Float32Array;
    colors?: Float32Array;
    tangents?: Float32Array;
    bitangents?: Float32Array;
} 