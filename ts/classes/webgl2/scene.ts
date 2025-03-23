import { glob } from '../../game';
import { TickerReturnData } from '../ticker';
import { Camera } from './camera';
import { SceneObject } from './meshes/sceneObject';
import { Light, AmbientLight } from './lights/light';
import { LightManager } from './lights/lightManager';
import { v3, Vector3 } from '../util/math/vector3';

export interface SceneOptions {
    ambientLightColor?: Vector3;
    ambientLightIntensity?: number;
}

export class Scene {
    protected objects: SceneObject[] = [];
    protected camera: Camera;
    protected clearColor: [number, number, number, number] = [0, 0, 0, 1];
    protected lightManager: LightManager;
    protected ambientLight: AmbientLight;

    constructor(camera: Camera, options: SceneOptions = {}) {
        this.camera = camera;
        this.lightManager = new LightManager(glob.shaderManager);
        
        // Set up ambient light with default or provided values
        const ambientColor = options.ambientLightColor || v3(1, 1, 1);
        const ambientIntensity = options.ambientLightIntensity ?? 0.1;
        this.ambientLight = new AmbientLight(ambientColor, ambientIntensity);
        this.lightManager.setAmbientLight(this.ambientLight);
    }

    public setAmbientLight(color: Vector3, intensity: number): void {
        this.ambientLight = new AmbientLight(color, intensity);
        this.lightManager.setAmbientLight(this.ambientLight);
    }

    public add(object: SceneObject): void {
        this.objects.push(object);
    }

    public remove(object: SceneObject): void {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }

    public render(): void {
        glob.ctx.clear(glob.ctx.COLOR_BUFFER_BIT | glob.ctx.DEPTH_BUFFER_BIT);
        glob.ctx.clearColor(...this.clearColor);

        const viewMatrix = this.camera.getViewMatrix();
        const projectionMatrix = this.camera.getProjectionMatrix();

        // Update light uniforms
        this.lightManager.updateShaderUniforms();

        for (const object of this.objects) {
            object.render(viewMatrix, projectionMatrix);
        }
    }

    public dispose(): void {
        for (const object of this.objects) {
            object.vao.dispose();
            object.indexBuffer?.dispose();
        }
        this.objects = [];
    }

    public tick(obj: TickerReturnData) {
    }
    public afterTick(obj: TickerReturnData) {
        this.render();
    }
    public resize() {
        this.camera.updateProjectionMatrix();
    }

    addLight(light: Light): void {
        if (light instanceof AmbientLight) {
            console.warn('Use setAmbientLight() to set the ambient light instead of addLight()');
            return;
        }
        this.lightManager.addLight(light);
    }

    removeLight(light: Light): void {
        if (light instanceof AmbientLight) {
            console.warn('Cannot remove ambient light. Use setAmbientLight() to modify it instead');
            return;
        }
        this.lightManager.removeLight(light);
    }

    getLights(): Light[] {
        return this.lightManager.getLights();
    }
} 