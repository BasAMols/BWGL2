import { Vector3, v3 } from '../util/math/vector3';

export class Material {
    public ambient: Vector3;
    public diffuse: Vector3;
    public specular: Vector3;
    public shininess: number;
    public diffuseMap?: WebGLTexture;
    public normalMap?: WebGLTexture;
    public specularMap?: WebGLTexture;

    constructor({
        ambient = v3(0.2, 0.2, 0.2),
        diffuse = v3(0.8, 0.8, 0.8),
        specular = v3(1.0, 1.0, 1.0),
        shininess = 2.0,
        diffuseMap,
        normalMap,
        specularMap
    }: {
        ambient?: Vector3;
        diffuse?: Vector3;
        specular?: Vector3;
        shininess?: number;
        diffuseMap?: WebGLTexture;
        normalMap?: WebGLTexture;
        specularMap?: WebGLTexture;
    } = {}) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.diffuseMap = diffuseMap;
        this.normalMap = normalMap;
        this.specularMap = specularMap;
    }

} 