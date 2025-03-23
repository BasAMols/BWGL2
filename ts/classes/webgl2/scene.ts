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
    protected ambientLight: AmbientLight;

    constructor(camera: Camera, options: SceneOptions = {}) {
        this.camera = camera;
        this.lightManager = new LightManager(glob.shaderManager);
        
        // Set up ambient light with default or provided values
        const ambientColor = options.ambientLightColor || v3(1, 1, 1);
        const ambientIntensity = options.ambientLightIntensity ?? 0.1;
        this.ambientLight = new AmbientLight(ambientColor, ambientIntensity);
        this.lightManager.setAmbientLight(this.ambientLight);

        glob.events.resize.subscribe('level', this.resize.bind(this));
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
        // First render pass: create shadow maps
        for (const light of this.getLights()) {
            if (light instanceof PointLight) {
                const shadowMap = light.getShadowMap();
                shadowMap.bind(glob.ctx);
                
                // Clear depth buffer
                glob.ctx.clear(glob.ctx.DEPTH_BUFFER_BIT);
                
                // Use shadow shader program
                glob.shaderManager.useProgram('shadow');
                
                // Set light space matrix uniform
                const lightSpaceMatrix = light.getLightSpaceMatrix();
                glob.shaderManager.setUniform('u_lightSpaceMatrix', lightSpaceMatrix.mat4);
                
                // Render scene from light's perspective
                for (const object of this.objects) {
                    // Set model matrix uniform
                    glob.shaderManager.setUniform('u_model', object.transform.getWorldMatrix().mat4);
                    
                    // Bind VAO and draw
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

        // For each object in the scene
        for (const object of this.objects) {
            // Set shadow mapping uniforms
            const light = this.getLights()[0]; // For now, just use the first light's shadow map
            if (light instanceof PointLight) {
                const shadowMap = light.getShadowMap();
                glob.shaderManager.setUniform('uLightSpaceMatrix', light.getLightSpaceMatrix().mat4);
                glob.shaderManager.setUniform('uShadowMap', 1); // Use texture unit 1 for shadow map
                shadowMap.bindDepthTexture(glob.ctx, 1);
            }

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