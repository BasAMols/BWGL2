import { glob } from '../../game';
import { TickerReturnData } from '../ticker';
import { Camera } from './camera';
import { SceneObject } from './meshes/sceneObject';
import { Light, AmbientLight, PointLight } from './lights/light';
import { LightManager } from './lights/lightManager';
import { v3, Vector3 } from '../util/math/vector3';
import { Vector2 } from '../util/math/vector2';
import { colorPickingVertexShader, colorPickingFragmentShader } from './shaders/colorPickingShader';
import { VertexArray } from './buffer';

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
    protected showColorPicking: boolean = true; // Debug flag to show color picking
    // Picking framebuffer setup
    private pickingFramebuffer: WebGLFramebuffer | null = null;
    private pickingTexture: WebGLTexture | null = null;
    private pickingDepthBuffer: WebGLRenderbuffer | null = null;
    protected get ambientLight(): AmbientLight {
        return this._ambientLight;
    }
    protected set ambientLight(value: AmbientLight) {
        this._ambientLight = value;
        this.lightManager.setAmbientLight(this.ambientLight);
    }
    protected showShadowMap: boolean = false;
    protected frameCount: number = 0;
    protected lastClick: Vector2;
    protected debugShadowMap: boolean = false;
    protected debugLightIndex: number = 0;
    protected fullScreenQuadVAO: VertexArray | null = null;

    public click(vector2: Vector2) {
        this.lastClick = vector2;
    }

    constructor(camera: Camera, options: SceneOptions = {}) {
        this.camera = camera;
        this.lightManager = new LightManager(glob.shaderManager);

        // Set up ambient light with default or provided values
        this.ambientLight = new AmbientLight({ color: options.ambientLightColor || v3(1, 1, 1), intensity: options.ambientLightIntensity ?? 0.1 });

        // Load color picking shader
        glob.shaderManager.loadShaderProgram('picking', colorPickingVertexShader, colorPickingFragmentShader);

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
        const gl = glob.ctx;
        const viewMatrix = this.camera.getViewMatrix();
        const projectionMatrix = this.camera.getProjectionMatrix();

        // First do color picking render pass (to offscreen buffer)
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clearColor(0, 0, 0, 1);
        
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        
        glob.shaderManager.useProgram('picking');

        for (const object of this.objects) {
            // Skip objects that should be ignored in picking pass
            if (!object.vao || object.pickColorArray === undefined) continue;
            
            glob.shaderManager.setUniform('u_pickingColor', new Float32Array(object.pickColorArray.vec));
            object.render(viewMatrix, projectionMatrix);
        }

        // Switch back to default framebuffer for normal rendering
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Second render pass: create shadow maps
        const shadowCastingLights = this.getLights().filter(light => 
            light instanceof PointLight && 
            light.isEnabled() &&
            light.getIntensity() > 0.0001 // Only cast shadows for lights that are actually contributing
        );
        const castsShadow = new Array(10).fill(false);
        const lightSpaceMatrices = new Float32Array(10 * 16); // MAX_LIGHTS * 4x4 matrix
        const hasAmbientLight = this.ambientLight !== null && this.ambientLight.isEnabled();
        const indexOffset = hasAmbientLight ? 1 : 0;

        // For each light that casts shadows
        for (let i = 0; i < shadowCastingLights.length; i++) {
            const light = shadowCastingLights[i] as PointLight;
            const lightIndex = i + indexOffset; // Adjust index for ambient light offset
            const shadowMap = light.getShadowMap();
            shadowMap.bind(glob.ctx);
            shadowMap.bindDepthTexture(glob.ctx, 0);

            // Use shadow shader program
            glob.shaderManager.useProgram('shadow');

            // Set light space matrix uniform for shadow pass
            const lightSpaceMatrix = light.getLightSpaceMatrix();
            glob.shaderManager.setUniform('u_lightSpaceMatrix', lightSpaceMatrix.mat4);

            // Set up depth state for shadow map rendering
            glob.ctx.enable(glob.ctx.DEPTH_TEST);
            glob.ctx.depthFunc(glob.ctx.LESS);
            glob.ctx.depthMask(true); // Ensure depth writing is enabled
            glob.ctx.clearDepth(1.0);
            glob.ctx.clear(glob.ctx.DEPTH_BUFFER_BIT);

            // Store light space matrix for main render pass
            lightSpaceMatrix.mat4.forEach((value, index) => {
                lightSpaceMatrices[lightIndex * 16 + index] = value;
            });
            castsShadow[lightIndex] = true; // Set to true instead of 1

            // Render scene from light's perspective - render ALL objects
            for (const object of this.objects) {
                // Skip objects without geometry
                if (!object.vao) continue;
                
                // Always render objects into shadow map, regardless of ignoreLighting flag
                glob.shaderManager.setUniform('u_modelMatrix', object.transform.getWorldMatrix().mat4);
                object.vao.bind();
                
                if (object.indexBuffer) {
                    glob.ctx.drawElements(glob.ctx.TRIANGLES, object.indexBuffer.getCount(), glob.ctx.UNSIGNED_SHORT, 0);
                } else {
                    glob.ctx.drawArrays(glob.ctx.TRIANGLES, 0, object.drawCount);
                }
            }
            
            // Important: Unbind the shadow map framebuffer and restore color mask
            shadowMap.unbind(glob.ctx);

        }



        // Third render pass: regular scene rendering with shadows
        glob.ctx.bindFramebuffer(glob.ctx.FRAMEBUFFER, null);
        glob.ctx.viewport(0, 0, glob.ctx.canvas.width, glob.ctx.canvas.height);

        glob.ctx.clearColor(...this.clearColor);
        glob.ctx.clear(glob.ctx.COLOR_BUFFER_BIT | glob.ctx.DEPTH_BUFFER_BIT);

        // Reset depth test and blend functions
        glob.ctx.enable(glob.ctx.DEPTH_TEST);
        glob.ctx.depthFunc(glob.ctx.LESS);
        glob.ctx.enable(glob.ctx.BLEND);
        glob.ctx.blendFunc(glob.ctx.SRC_ALPHA, glob.ctx.ONE_MINUS_SRC_ALPHA);

        // Switch to the PBR shader program instead of the basic one
        glob.shaderManager.useProgram('pbr');

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
                shadowMap.bindDepthTexture(glob.ctx, lightIndex + 5); // Use higher texture units to avoid conflicts
                // Only set uniform if it exists in the shader (max 4 shadow maps)
                if (lightIndex < 4) {
                    // Ensure u_shadowMap uniform is correctly set with the texture unit
                    glob.shaderManager.setUniform(`u_shadowMap${lightIndex}`, lightIndex + 5);
                    
                    // Make sure the light's world-to-light matrix is correctly set
                    const lightSpaceMatrix = light.getLightSpaceMatrix();
                    for (let j = 0; j < 16; j++) {
                        lightSpaceMatrices[lightIndex * 16 + j] = lightSpaceMatrix.mat4[j];
                    }
                    
                    // Explicitly mark this light as casting shadows
                    castsShadow[lightIndex] = true;
                }
            }
        });
        
        // Re-set critical shadow uniforms right before rendering
        glob.shaderManager.setUniform('u_lightSpaceMatrices', lightSpaceMatrices);
        glob.shaderManager.setUniform('u_castsShadow', castsShadow);

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
        
        // Resize picking buffers
        const gl = glob.ctx;
        
        // Resize texture
        gl.bindTexture(gl.TEXTURE_2D, this.pickingTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 
            gl.canvas.width, gl.canvas.height, 
            0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            
        // Resize depth buffer
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.pickingDepthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 
            gl.canvas.width, gl.canvas.height);
            
        // Reset bindings
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }

    public getActualColor(vector2: Vector2, range: 1|255 = 1): Vector3 | undefined {
        const gl = glob.ctx;
        const pixelData = new Uint8Array(4);
        
        // Bind picking framebuffer to read from it
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
        
        // Convert from screen coordinates to WebGL viewport coordinates
        const rect = (gl.canvas as HTMLCanvasElement).getBoundingClientRect();
        const x = Math.round(vector2.x - rect.left);
        const y = Math.round(gl.canvas.height - (vector2.y - rect.top)); // Flip Y coordinate
        
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);
        
        // Reset framebuffer binding
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        // Convert to 0-1 range
        let color = v3(
            pixelData[0],
            pixelData[1],
            pixelData[2]
        );
        if (range === 1){
            color = color.scale(1/255);
        }
        return color;
        
    }

    public getColor(vector2: Vector2): SceneObject | undefined {
        const color = this.getActualColor(vector2);
        
        // Check for black or white (no object)
        if (color.equals(v3(0, 0, 0)) || color.equals(v3(1, 1, 1))) return undefined;
        
        // Find matching object
        for (const object of this.objects) {
            if (object.colorMatch(color)) {
                return object;
            }
        }
        
        return undefined;
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

    // Add method to toggle color picking visualization
    public toggleColorPicking(): void {
        this.showColorPicking = !this.showColorPicking;
    }
} 