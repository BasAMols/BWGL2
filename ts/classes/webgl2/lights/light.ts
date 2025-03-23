import { glob } from '../../../game';
import { Matrix4 } from '../../util/math/matrix4';
import { v3, Vector3 } from '../../util/math/vector3';
import { IcoSphere } from '../meshes/icoSphere';
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

    constructor(color: Vector3 = v3(1, 1, 1), intensity: number = 1.0) {
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
    constructor(color: Vector3 = v3(1, 1, 1), intensity: number = 0.1) {
        super(color, intensity);
        this.type = LightType.AMBIENT;
    }
}

export class DirectionalLight extends Light {
    private direction: Vector3;

    constructor(direction: Vector3 = v3(0, -1, 0), color: Vector3 = v3(1, 1, 1), intensity: number = 1.0) {
        super(color, intensity);
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
    private position: Vector3;
    private constant: number;
    private linear: number;
    private quadratic: number;
    private shadowMap: ShadowMap;
    private lightProjection: Matrix4;

    constructor(
        position: Vector3 = v3(0, 0, 0),
        color: Vector3 = v3(1, 1, 1),
        intensity: number = 1.0,
        constant: number = 1.0,
        linear: number = 0.09,
        quadratic: number = 0.032,
        scene: Scene
    ) {
        super(color, intensity);
        this.position = position;
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
        this.type = LightType.POINT;
        this.shadowMap = new ShadowMap(glob.ctx);
        
        // Create perspective projection matrix for the light
        this.lightProjection = new Matrix4().perspective(
            Math.PI / 2, // 90 degree FOV
            0.1,         // near plane
            100.0        // far plane
        );

        if (scene) {
            scene.add(IcoSphere.create({
                position: position,
                scale: v3(0.1, 0.1, 0.1),
                color: color.array,
            }));
        }
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
        const lightView = Matrix4.lookAt(
            this.position,
            v3(0, 0, 0), // looking at origin
        );
        return lightView.multiply(this.lightProjection);
    }

    getShadowMap(): ShadowMap {
        return this.shadowMap;
    }
}

export class SpotLight extends PointLight {
    private direction: Vector3;
    private cutOff: number;
    private outerCutOff: number;

    constructor(
        position: Vector3 = v3(0, 0, 0),
        direction: Vector3 = v3(0, -1, 0),
        color: Vector3 = v3(1, 1, 1),
        intensity: number = 1.0,
        cutOff: number = Math.cos(Math.PI / 6), // 30 degrees
        outerCutOff: number = Math.cos(Math.PI / 4), // 45 degrees
        meshContainer?: Scene
    ) {
        super(position, color, intensity, 1.0, 0.09, 0.032, meshContainer!);
        this.direction = direction.normalize();
        this.cutOff = cutOff;
        this.outerCutOff = outerCutOff;
        this.type = LightType.SPOT;

        if (meshContainer) {
            meshContainer.add(IcoSphere.create({
                position: position,
                scale: v3(0.1, 0.1, 0.1),
                color: color.array,
            }));
        }
    }

    getData(): SpotLightData {
        return {
            ...super.getData(),
            direction: this.direction,
            cutOff: this.cutOff,
            outerCutOff: this.outerCutOff
        };
    }
} 