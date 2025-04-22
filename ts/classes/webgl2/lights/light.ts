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
    SPOT = 3,
    INACTIVE = 4
}

export interface LightData {
    color: Vector3;
    intensity: number;
    enabled?: boolean;
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
    protected type: LightType;
    protected color: Vector3;
    protected intensity: number;
    protected enabled: boolean = true;

    constructor({ 
        color = v3(1, 1, 1), 
        intensity = 1.0,
        enabled = true 
    }: { 
        color?: Vector3, 
        intensity?: number,
        enabled?: boolean 
    } = {}) {
        this.color = color;
        this.intensity = intensity;
        this.enabled = enabled;
        this.type = LightType.INACTIVE;
    }

    public getIntensity(): number {
        return this.enabled ? this.intensity : 0;
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    getType(): LightType {
        return this.enabled ? this.type : LightType.INACTIVE;
    }

    getData(): LightData {
        return {
            color: this.color,
            intensity: this.getIntensity(),
            enabled: this.enabled
        };
    }

    getShadowMap(): ShadowMap | null {
        return this.enabled ? null : null;
    }
}

export class AmbientLight extends Light {
    constructor({ color = v3(1, 1, 1), intensity = 0.1 }: { color?: Vector3, intensity?: number; } = {}) {
        super({ color, intensity });
        this.type = LightType.AMBIENT;
    }
}

export class DirectionalLight extends Light {
    protected direction: Vector3;
    protected shadowMap: ShadowMap;
    protected lightProjection: Matrix4;

    constructor({
        direction = v3(0, -1, 0),
        color = v3(1, 1, 1),
        intensity = 1.0,
        enabled = true
    }: {
        direction?: Vector3;
        color?: Vector3;
        intensity?: number;
        enabled?: boolean;
    } = {}) {
        super({ color, intensity, enabled });
        this.direction = direction.normalize();
        this.type = LightType.DIRECTIONAL;
        this.shadowMap = new ShadowMap(glob.ctx, 4096); // High resolution for directional shadows

        // Create orthographic projection matrix for the light
        this.lightProjection = new Matrix4().ortho(
            -20, 20,    // left, right
            -20, 20,    // bottom, top
            0.1, 200.0  // near, far
        );
    }

    getData(): DirectionalLightData {
        return {
            ...super.getData(),
            direction: this.direction
        };
    }

    getDirection(): Vector3 {
        return this.direction;
    }

    setDirection(direction: Vector3): void {
        this.direction = direction.normalize();
    }

    getLightSpaceMatrix(): Matrix4 {
        // Calculate view matrix from light's direction
        const lightView = Matrix4.lookAt(
            this.direction.scale(-10), // Position light far enough away in opposite direction
            v3(0, 0, 0)               // Look at scene center
        );

        return this.lightProjection.multiply(lightView);
    }

    getShadowMap(): ShadowMap {
        return this.shadowMap;
    }

    public lookAt(from: Vector3, target: Vector3) {
        const direction = target.subtract(from).normalize();

        // Calculate rotation axis and angle
        const defaultDir = v3(0, -1, 0); // Light points down by default
        const rotationAxis = defaultDir.cross(direction).normalize();
        const angle = Math.acos(defaultDir.y * direction.y + defaultDir.x * direction.x + defaultDir.z * direction.z);

        this.direction = new Quaternion().setAxisAngle(rotationAxis, angle).toEuler();
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
        meshContainer,
        enabled = true
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
        enabled?: boolean;
    } = {}) {
        super({ color, intensity, enabled });
        this.position = position;
        this.constant = attenuation.constant;
        this.linear = attenuation.linear;
        this.quadratic = attenuation.quadratic;
        this.type = LightType.POINT;
        this.shadowMap = new ShadowMap(glob.ctx, 4096);

        // Create orthographic projection matrix for the light
        this.lightProjection = new Matrix4().ortho(
            -20, 20,    // left, right - doubled for wider coverage
            -20, 20,    // bottom, top - doubled for wider coverage
            0.1, 200.0  // near, far - increased far plane for deeper shadows
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

        // Get distance to determine appropriate frustum size
        const distanceToCenter = Math.sqrt(
            this.position.x * this.position.x + 
            this.position.y * this.position.y + 
            this.position.z * this.position.z
        );
        
        // Create a much larger orthographic projection to ensure it captures everything
        // Make near plane much closer and far plane much farther
        this.lightProjection = new Matrix4().ortho(
            -20, 20,     // Much wider left/right bounds
            -20, 20,     // Much wider top/bottom bounds
            0.01,        // Much closer near plane (was 0.1 or higher)
            50           // Much farther far plane 
        );

        return this.lightProjection.multiply(lightView);  // projection * view order is correct
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
            meshContainer,
            enabled = true,
            lookAt
        }: {
            position?: Vector3;
            direction?: Vector3;
            color?: Vector3;
            intensity?: number;
            cutOff?: number;
            outerCutOff?: number;
            meshContainer?: Scene;
            enabled?: boolean;
            lookAt?: Vector3;
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
            meshContainer,
            enabled
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

        if (direction && !lookAt) {
            this.lookAt(position.add(direction));
        }

        if (lookAt) {
            this.lookAt(lookAt);
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