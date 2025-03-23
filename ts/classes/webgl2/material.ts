import { vec3 } from 'gl-matrix';
import { Material as IMaterial } from './types';

export class Material implements IMaterial {
    public ambient: vec3;
    public diffuse: vec3;
    public specular: vec3;
    public shininess: number;
    public diffuseMap?: WebGLTexture;
    public normalMap?: WebGLTexture;
    public specularMap?: WebGLTexture;

    constructor({
        ambient = vec3.fromValues(0.2, 0.2, 0.2),
        diffuse = vec3.fromValues(0.8, 0.8, 0.8),
        specular = vec3.fromValues(1.0, 1.0, 1.0),
        shininess = 2.0,
        diffuseMap,
        normalMap,
        specularMap
    }: Partial<IMaterial> = {}) {
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.diffuseMap = diffuseMap;
        this.normalMap = normalMap;
        this.specularMap = specularMap;
    }

} 