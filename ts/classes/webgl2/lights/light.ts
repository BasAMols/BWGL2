import { glob } from '../../../game';
import { Matrix4 } from '../../util/math/matrix4';
import { Quaternion } from '../../util/math/quaternion';
import { v3, Vector3 } from '../../util/math/vector3';
import { Arrow } from '../meshes/arrow';
import { IcoSphere } from '../meshes/icoSphere';
import { SceneObject } from '../meshes/sceneObject';
import { Scene } from '../scene';
import { ShadowMap } from './shadowMap';

export enum LightType {
    AMBIENT = 0,
    DIRECTIONAL = 1,
    POINT = 2,
    SPOT = 3
}

export interface LightData {
    color: Vector3;
    intensity: number;
}

export interface DirectionalLightData extends LightData {
    direction: Vector3;
}

export interface PointLightData extends LightData {
    position: Vector3;
    constant: number;
    linear: number;
    quadratic: number;
}

export interface SpotLightData extends PointLightData {
    direction: Vector3;
    cutOff: number;
    outerCutOff: number;
}

export class Light {
    protected color: Vector3;
    protected intensity: number;
    protected type: LightType;

    constructor({ color = v3(1, 1, 1), intensity = 1.0 }: { color?: Vector3; intensity?: number; } = {}) {
        this.color = color;
        this.intensity = intensity;
    }

    getType(): LightType {
        return this.type;
    }

    getData(): LightData {
        return {
            color: this.color,
            intensity: this.intensity
        };
    }

    getShadowMap(): ShadowMap | null {
        return null;
    }
}

export class AmbientLight extends Light {
    constructor({ color = v3(1, 1, 1), intensity = 0.1 }: { color?: Vector3, intensity?: number; } = {}) {
        super({ color, intensity });
        this.type = LightType.AMBIENT;
    }
}

export class DirectionalLight extends Light {
    private direction: Vector3;

    constructor({
        direction = v3(0, -1, 0),
        color = v3(1, 1, 1),
        intensity = 1.0 }: {
            direction?: Vector3;
            color?: Vector3;
            intensity?: number;
        } = {}) {
        super({ color, intensity });
        this.direction = direction.normalize();
        this.type = LightType.DIRECTIONAL;
    }

    getData(): DirectionalLightData {
        return {
            ...super.getData(),
            direction: this.direction
        };
    }
}

export class PointLight extends Light {
    protected position: Vector3;
    protected constant: number;
    protected linear: number;
    protected quadratic: number;
    protected shadowMap: ShadowMap;
    protected lightProjection: Matrix4;
    protected mesh: SceneObject;

    constructor({
        position = v3(0, 0, 0),
        color = v3(1, 1, 1),
        intensity = 5.0, // Increased intensity for PBR
        attenuation = { constant: 1.0, linear: 0.22, quadratic: 0.20 }, // Better PBR attenuation values
        meshContainer
    }: {
        position?: Vector3;
        color?: Vector3;
        intensity?: number;
        attenuation?: {
            constant: number;
            linear: number;
            quadratic: number;
        };
        meshContainer?: Scene;
    } = {}) {
        super({ color, intensity });
        this.position = position;
        this.constant = attenuation.constant;
        this.linear = attenuation.linear;
        this.quadratic = attenuation.quadratic;
        this.type = LightType.POINT;
        this.shadowMap = new ShadowMap(glob.ctx, 4096);

        // Create orthographic projection matrix for the light
        this.lightProjection = new Matrix4().ortho(
            -10, 10,  // left, right
            -10, 10,  // bottom, top
            0.1, 100.0  // near, far
        );

        if (meshContainer) {
            // Create a small emissive sphere to represent the light
            meshContainer.add(this.mesh = IcoSphere.create({
                position: position,
                scale: v3(0.2, 0.2, 0.2),
                smoothShading: true,
                subdivisions: 0,
                ignoreLighting: false,
                pickColor: -1,
                color: [color.x, color.y, color.z]
            }));
        }
    }

    public setPosition(position: Vector3) {
        this.position = position;
        if (this.mesh) {
            this.mesh.transform.setPosition(position);
        }
    }

    public getPosition(): Vector3 {
        return this.position;
    }

    getData(): PointLightData {
        return {
            ...super.getData(),
            position: this.position,
            constant: this.constant,
            linear: this.linear,
            quadratic: this.quadratic
        };
    }

    getLightSpaceMatrix(): Matrix4 {
        // Calculate view matrix from light position to scene center
        const lightView = Matrix4.lookAt(
            this.position,      // Light position
            v3(0, 0, 0)        // Looking at scene center
        );

        // Create orthographic projection that encompasses the scene
        this.lightProjection = new Matrix4().ortho(
            -10, 10,    // left, right
            -10, 10,    // bottom, top
            1, 20       // near, far (adjusted to better match scene depth)
        );

        return this.lightProjection.multiply(lightView);  // Note: projection * view order
    }

    getShadowMap(): ShadowMap {
        return this.shadowMap;
    }
}

export class SpotLight extends PointLight {
    private rotation: Quaternion;
    private cutOff: number;
    private outerCutOff: number;
    arrow: Arrow;

    constructor(
        { position = v3(0, 0, 0),
            direction = v3(0, -1, 0),
            color = v3(1, 1, 1),
            intensity = 8.0, // Increased intensity for PBR
            cutOff = Math.cos(Math.PI / 6), // 30 degrees
            outerCutOff = Math.cos(Math.PI / 4), // 45 degrees
            meshContainer
        }: {
            position?: Vector3;
            direction?: Vector3;
            color?: Vector3;
            intensity?: number;
            cutOff?: number;
            outerCutOff?: number;
            meshContainer?: Scene;
        } = {}) {

        // Update attenuation for better PBR values
        super({ 
            position, 
            color, 
            intensity, 
            attenuation: { 
                constant: 1.0, 
                linear: 0.22, 
                quadratic: 0.20 
            }, 
            meshContainer 
        });
        
        this.rotation = new Quaternion();
        this.cutOff = cutOff;
        this.outerCutOff = outerCutOff;
        this.type = LightType.SPOT;

        if (this.mesh) {
            // Create a visual indicator for the spotlight direction
            this.arrow = new Arrow(meshContainer, {
                shaftColor: [color.x * 0.8, color.y * 0.8, color.z * 0.8],
                headColor: [color.x, color.y, color.z],
                length: 0.5,
                shaftRadius: 0.05,
                headLength: 0.15,
                headRadius: 0.12,
                sides: 8,
                position: this.position,
                rotation: this.rotation,
                lookAt: v3(0, 0, 0),
                ignoreLighting: true,
                pickColor: -1,
            });
        }

        if (direction) {
            this.lookAt(position.add(direction));
        }
    }

    getData(): SpotLightData {
        // Convert rotation to direction vector
        const defaultDir = v3(0, -1, 0);
        const direction = defaultDir.applyQuaternion(this.rotation);

        return {
            ...super.getData(),
            direction: direction,
            cutOff: this.cutOff,
            outerCutOff: this.outerCutOff
        };
    }

    public lookAt(target: Vector3) {
        const direction = target.subtract(this.position).normalize();

        // Calculate rotation axis and angle
        const defaultDir = v3(0, -1, 0); // Light points down by default
        const rotationAxis = defaultDir.cross(direction).normalize();
        const angle = Math.acos(defaultDir.y * direction.y + defaultDir.x * direction.x + defaultDir.z * direction.z);

        this.rotation = new Quaternion().setAxisAngle(rotationAxis, angle);

        if (this.arrow) {
            this.arrow.lookAt(target);
        }
    }

    public setPosition(x: number, y: number, z: number): void;
    public setPosition(position: Vector3): void;
    public setPosition(x: number | Vector3, y?: number, z?: number): void {
        if (typeof x === 'number') {
            super.setPosition(v3(x, y, z));
        } else {
            super.setPosition(x);
        }
        if (this.arrow) {
            this.arrow.transform.setPosition(super.getPosition());
        }
    }

    public getPosition(): Vector3 {
        return this.position;
    }

    public getRotation(): Quaternion {
        return this.rotation.clone();
    }

    public setRotation(rotation: Quaternion) {
        this.rotation = rotation;
    }
} 