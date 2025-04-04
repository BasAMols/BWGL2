import { glob } from '../../game';
import { TickerReturnData } from '../ticker';
import { Camera } from './camera';
import { SceneObject } from './meshes/sceneObject';
import { Light, AmbientLight, PointLight } from './lights/light';
import { LightManager } from './lights/lightManager';
import { v3, Vector3 } from '../util/math/vector3';
import { DebugQuad } from './debug/debugQuad';

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
    protected debugQuad: DebugQuad | null = null;
    protected showShadowMap: boolean = false;
    protected frameCount: number = 0;

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

    public getLights(): Light[] {
        return this.lightManager.getLights();
    }

    public toggleShadowMapDebug(show: boolean): void {
        this.showShadowMap = show;
        if (show && !this.debugQuad) {
            this.debugQuad = new DebugQuad(glob.ctx, glob.shaderManager);
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
                    glob.shaderManager.setUniform('u_modelMatrix', object.transform.getWorldMatrix().mat4);
                    
                    // Bind VAO and draw
                    object.vao.bind();
                    if (object.indexBuffer) {
                        glob.ctx.drawElements(glob.ctx.TRIANGLES, object.indexBuffer.getCount(), glob.ctx.UNSIGNED_SHORT, 0);
                    } else {
                        glob.ctx.drawArrays(glob.ctx.TRIANGLES, 0, object.drawCount);
                    }
                }

                // Debug: Log shadow map values every 60 frames
                if (this.frameCount % 60 === 0) {
                    const size = shadowMap.getSize();
                    
                    // Create a temporary texture for reading
                    const tempTexture = glob.ctx.createTexture();
                    glob.ctx.bindTexture(glob.ctx.TEXTURE_2D, tempTexture);
                    glob.ctx.texImage2D(
                        glob.ctx.TEXTURE_2D,
                        0,
                        glob.ctx.RGBA8,
                        1, 1, // Just need one pixel
                        0,
                        glob.ctx.RGBA,
                        glob.ctx.UNSIGNED_BYTE,
                        null
                    );
                    glob.ctx.texParameteri(glob.ctx.TEXTURE_2D, glob.ctx.TEXTURE_MIN_FILTER, glob.ctx.NEAREST);
                    glob.ctx.texParameteri(glob.ctx.TEXTURE_2D, glob.ctx.TEXTURE_MAG_FILTER, glob.ctx.NEAREST);
                    
                    // Create and set up temporary framebuffer
                    const tempFb = glob.ctx.createFramebuffer();
                    glob.ctx.bindFramebuffer(glob.ctx.FRAMEBUFFER, tempFb);
                    glob.ctx.framebufferTexture2D(
                        glob.ctx.FRAMEBUFFER,
                        glob.ctx.COLOR_ATTACHMENT0,
                        glob.ctx.TEXTURE_2D,
                        tempTexture,
                        0
                    );

                    // Check framebuffer status
                    const status = glob.ctx.checkFramebufferStatus(glob.ctx.FRAMEBUFFER);
                    if (status !== glob.ctx.FRAMEBUFFER_COMPLETE) {
                        console.error('Framebuffer is incomplete:', status);
                    } else {
                        // Clear the temporary framebuffer
                        glob.ctx.clearColor(0, 0, 0, 1);
                        glob.ctx.clear(glob.ctx.COLOR_BUFFER_BIT);

                        // Render depth texture to the temporary framebuffer
                        if (this.debugQuad) {
                            this.debugQuad.render(shadowMap.getDepthTexture(), true);
                        }

                        // Read the rendered value
                        const pixels = new Uint8Array(4);
                        glob.ctx.readPixels(0, 0, 1, 1, glob.ctx.RGBA, glob.ctx.UNSIGNED_BYTE, pixels);
                        
                        // Convert 8-bit value back to float (0-255 -> 0-1)
                        const depth = pixels[0] / 255;
                        console.log('Shadow map center depth:', depth, 'Shadow map size:', size);
                    }

                    // Clean up
                    glob.ctx.deleteFramebuffer(tempFb);
                    glob.ctx.deleteTexture(tempTexture);
                    
                    // Rebind the shadow map framebuffer
                    shadowMap.bind(glob.ctx);
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
                glob.shaderManager.setUniform('u_lightSpaceMatrix', light.getLightSpaceMatrix().mat4);
                glob.shaderManager.setUniform('u_shadowMap', 1); // Use texture unit 1 for shadow map
                shadowMap.bindDepthTexture(glob.ctx, 1);
            }

            object.render(viewMatrix, projectionMatrix);
        }

        // Render debug quad if enabled
        if (this.showShadowMap && this.debugQuad) {
            const light = this.getLights()[0];
            if (light instanceof PointLight) {
                const shadowMap = light.getShadowMap();
                this.debugQuad.render(shadowMap.getDepthTexture(), true);
            }
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