import { glob } from '../../game';
import { TickerReturnData } from '../ticker';
import { Camera } from './camera';
import { SceneObject } from './meshes/sceneObject';
import { Light, AmbientLight, PointLight } from './lights/light';
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
    private _ambientLight: AmbientLight;
    protected get ambientLight(): AmbientLight {
        return this._ambientLight;
    }
    protected set ambientLight(value: AmbientLight) {
        this._ambientLight = value;
        this.lightManager.setAmbientLight(this.ambientLight);
    }
    protected showShadowMap: boolean = false;
    protected frameCount: number = 0;

    constructor(camera: Camera, options: SceneOptions = {}) {
        this.camera = camera;
        this.lightManager = new LightManager(glob.shaderManager);

        // Set up ambient light with default or provided values
        const ambientColor = options.ambientLightColor || v3(1, 1, 1);
        const ambientIntensity = options.ambientLightIntensity ?? 0.1;
        this.ambientLight = new AmbientLight({ color: ambientColor, intensity: ambientIntensity });

        glob.events.resize.subscribe('level', this.resize.bind(this));
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

    public getLights(): Light[] {
        return this.lightManager.getLights();
    }

    public render(): void {
        // First render pass: create shadow maps
        const shadowCastingLights = this.getLights().filter(light => light instanceof PointLight);
        const castsShadow = new Int32Array(10); // MAX_LIGHTS
        const lightSpaceMatrices = new Float32Array(10 * 16); // MAX_LIGHTS * 4x4 matrix
        const hasAmbientLight = this.ambientLight !== null;
        const indexOffset = hasAmbientLight ? 1 : 0; // Account for ambient light being at index 0

        // For each light that casts shadows
        for (let i = 0; i < shadowCastingLights.length; i++) {
            const light = shadowCastingLights[i] as PointLight;
            const lightIndex = i + indexOffset; // Adjust index for ambient light offset
            const shadowMap = light.getShadowMap();
            shadowMap.bind(glob.ctx);

            // Use shadow shader program
            glob.shaderManager.useProgram('shadow');

            // Set light space matrix uniform for shadow pass
            const lightSpaceMatrix = light.getLightSpaceMatrix();
            glob.shaderManager.setUniform('u_lightSpaceMatrix', lightSpaceMatrix.mat4);

            // Set up depth state
            glob.ctx.enable(glob.ctx.DEPTH_TEST);
            glob.ctx.depthFunc(glob.ctx.LESS);
            glob.ctx.clearDepth(1.0);
            glob.ctx.clear(glob.ctx.DEPTH_BUFFER_BIT);

            // Store light space matrix for main render pass
            lightSpaceMatrix.mat4.forEach((value, index) => {
                lightSpaceMatrices[lightIndex * 16 + index] = value;
            });
            castsShadow[lightIndex] = 1;

            // Render scene from light's perspective
            for (const object of this.objects) {
                if (object.vao && !object.ignoreLighting) {
                    glob.shaderManager.setUniform('u_modelMatrix', object.transform.getWorldMatrix().mat4);
                    object.vao.bind();
                    if (object.indexBuffer) {
                        glob.ctx.drawElements(glob.ctx.TRIANGLES, object.indexBuffer.getCount(), glob.ctx.UNSIGNED_SHORT, 0);
                    } else {
                        glob.ctx.drawArrays(glob.ctx.TRIANGLES, 0, object.drawCount);
                    }
                }
            }
        }

        // Second render pass: regular scene rendering with shadows
        glob.ctx.bindFramebuffer(glob.ctx.FRAMEBUFFER, null);
        glob.ctx.viewport(0, 0, glob.ctx.canvas.width, glob.ctx.canvas.height);

        glob.ctx.clear(glob.ctx.COLOR_BUFFER_BIT | glob.ctx.DEPTH_BUFFER_BIT);
        glob.ctx.clearColor(...this.clearColor);

        // Switch back to the main shader program
        glob.shaderManager.useProgram('basic');

        const viewMatrix = this.camera.getViewMatrix();
        const projectionMatrix = this.camera.getProjectionMatrix();

        // Update light uniforms including shadow maps
        this.lightManager.updateShaderUniforms();

        // Set shadow mapping uniforms
        glob.shaderManager.setUniform('u_lightSpaceMatrices', lightSpaceMatrices);
        glob.shaderManager.setUniform('u_castsShadow', castsShadow);

        // Bind all shadow maps to different texture units
        shadowCastingLights.forEach((light, i) => {
            if (light instanceof PointLight) {
                const lightIndex = i + indexOffset;
                const shadowMap = light.getShadowMap();
                shadowMap.bindDepthTexture(glob.ctx, lightIndex + 1); // Start from texture unit 1
                glob.shaderManager.setUniform(`u_shadowMap${lightIndex}`, lightIndex + 1);
            }
        });

        // For each object in the scene
        for (const object of this.objects) {
            object.render(viewMatrix, projectionMatrix);
        }

        this.frameCount++;
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
    public resize(): void {
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

    public update(data: TickerReturnData): void {
        // Update scene objects if needed
    }
} 