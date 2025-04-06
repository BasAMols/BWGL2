import { Vector3, v3 } from '../util/math/vector3';

/**
 * PBR Material class using physically-based rendering properties
 */
export class Material {
    // Base color (albedo) of the material
    public baseColor: Vector3;
    
    // Controls how rough/smooth the material is (0 = smooth, 1 = rough)
    public roughness: number;
    
    // Controls how metallic the material is (0 = dielectric, 1 = metal)
    public metallic: number;
    
    // Controls ambient occlusion effect (1 = no occlusion, 0 = fully occluded)
    public ambientOcclusion: number;
    
    // Controls the emission color of the material
    public emissive: Vector3;
    
    // Texture maps
    public albedoMap?: WebGLTexture;
    public normalMap?: WebGLTexture;
    public metallicRoughnessMap?: WebGLTexture;
    public aoMap?: WebGLTexture;
    public emissiveMap?: WebGLTexture;

    constructor({
        baseColor = v3(0.8, 0.8, 0.8),
        roughness = 0.5,
        metallic = 0.0,
        ambientOcclusion = 1.0,
        emissive = v3(0.0, 0.0, 0.0),
        albedoMap,
        normalMap,
        metallicRoughnessMap,
        aoMap,
        emissiveMap
    }: {
        baseColor?: Vector3;
        roughness?: number;
        metallic?: number;
        ambientOcclusion?: number;
        emissive?: Vector3;
        albedoMap?: WebGLTexture;
        normalMap?: WebGLTexture;
        metallicRoughnessMap?: WebGLTexture;
        aoMap?: WebGLTexture;
        emissiveMap?: WebGLTexture;
    } = {}) {
        this.baseColor = baseColor;
        this.roughness = roughness;
        this.metallic = metallic;
        this.ambientOcclusion = ambientOcclusion;
        this.emissive = emissive;
        this.albedoMap = albedoMap;
        this.normalMap = normalMap;
        this.metallicRoughnessMap = metallicRoughnessMap;
        this.aoMap = aoMap;
        this.emissiveMap = emissiveMap;
    }

    private static _materials: {
        [key: string]: ConstructorParameters<typeof Material>[0]
    } = {
        'plastic': {
            baseColor: v3(0.8, 0.8, 0.8),
            roughness: 0.4,
            metallic: 0.4,
            ambientOcclusion: 1.0,
            emissive: v3(0.0, 0.0, 0.0)
        },
        'metal': {
            baseColor: v3(0.8, 0.8, 0.8),
            roughness: 0.3,
            metallic: 1.0,
            ambientOcclusion: 1.0,
            emissive: v3(0.0, 0.0, 0.0)
        },
        'rough': {
            baseColor: v3(0.8, 0.8, 0.8),
            roughness: 0.4,
            metallic: 0.5,
            ambientOcclusion: 1.0,
            emissive: v3(0.0, 0.0, 0.0)
        }
    }


    public static library(name: 'plastic' | 'metal' | 'rough', color: Vector3): Material {
        const material = new Material(this._materials[name]);
        material.baseColor = color;
        return material;
    }
} 