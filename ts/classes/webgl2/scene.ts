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
import { EnvironmentMap, EnvironmentMapLoader } from './environmentMap';
import { Skybox } from './skybox';
import { ContainerObject } from './meshes/containerObject';
import { InputMap } from '../input/input';
import { UI } from '../elements/UI';

export interface SceneOptions {
    ambientLightColor?: Vector3;
    ambientLightIntensity?: number;
    environmentMap?: EnvironmentMap;
    inputMap?: InputMap;
}

export class Scene extends ContainerObject {
    public camera: Camera;
    protected clearColor: [number, number, number, number] = [0, 0, 0, 1];
    protected lightManager: LightManager;
    private _ambientLight: AmbientLight;
    protected showColorPicking: boolean = true;
    private pickingFramebuffer: WebGLFramebuffer | null = null;
    private pickingTexture: WebGLTexture | null = null;
    private pickingDepthBuffer: WebGLRenderbuffer | null = null;
    public inputMap: InputMap;
    public ui: UI;
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
    protected environmentMap?: EnvironmentMap;
    protected skybox: Skybox;

    protected passes: {
        shadow: boolean;
        picking: boolean;
        render: boolean;
    } = {
            shadow: false,
            picking: false,
            render: true,
        };


    public click(vector2: Vector2) {
        this.lastClick = vector2;
    }

    constructor(camera: Camera, options: SceneOptions = {}) {
        super();
        this.camera = camera;
        this.scene = this;
        this.lightManager = new LightManager(glob.shaderManager);
        this.inputMap = options.inputMap ?? new InputMap();

        this.ambientLight = new AmbientLight({ color: options.ambientLightColor || v3(1, 1, 1), intensity: options.ambientLightIntensity ?? 0.1 });
        this.environmentMap = options.environmentMap;

        // Initialize skybox
        this.skybox = new Skybox();
        if (this.environmentMap) {
            this.skybox.setEnvironmentMap(this.environmentMap);
        }

        // Load color picking shader
        glob.shaderManager.loadShaderProgram('picking', colorPickingVertexShader, colorPickingFragmentShader);

        glob.events.resize.subscribe('level', this.resize.bind(this));
    }


    public getLights(): Light[] {
        return this.lightManager.getLights();
    }

    public render(obj: TickerReturnData): void {
        const gl = glob.ctx;
        this.camera.tick(obj);
        const viewMatrix = this.camera.getViewMatrix();
        const projectionMatrix = this.camera.getProjectionMatrix();

        if (this.passes.picking) {
            // First do color picking render pass (to offscreen buffer)
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.pickingFramebuffer);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.clearColor(0, 0, 0, 1);

            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);

            glob.shaderManager.useProgram('picking');

            for (const object of this.children) {
                if (!object.vao || object.pickColorArray === undefined) continue;

                glob.shaderManager.setUniform('u_pickingColor', new Float32Array(object.pickColorArray.vec));
                object.render(obj, viewMatrix, projectionMatrix);
            }
        }

        // Switch back to default framebuffer for normal rendering
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Second render pass: create shadow maps
        const shadowCastingLights = this.passes.shadow ? this.getLights().filter(light =>
            light instanceof PointLight &&
            light.isEnabled() &&
            light.getIntensity() > 0.0001 // Only cast shadows for lights that are actually contributing
        ) : [];
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
            for (const object of this.children) {
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

        if (this.passes.render) {
            // Third render pass: regular scene rendering with shadows
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.clearColor(...this.clearColor);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Reset depth test and blend functions
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LESS);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // Render skybox first (before regular objects but after clearing the screen)
            if (this.environmentMap) {
                this.skybox.render(viewMatrix.mat4 as Float32Array, projectionMatrix.mat4 as Float32Array);
            }

            // Use PBR shader program for rendering
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

            // Bind environment map if available
            if (this.environmentMap) {
                this.environmentMap.bind(11); // Use texture units 11-14 for environment mapping
                glob.shaderManager.setUniform('u_environmentMap', 11);
                glob.shaderManager.setUniform('u_irradianceMap', 12);
                glob.shaderManager.setUniform('u_prefilterMap', 13);
                glob.shaderManager.setUniform('u_brdfLUT', 14);
                glob.shaderManager.setUniform('u_useEnvironmentMap', 1);
            } else {
                glob.shaderManager.setUniform('u_useEnvironmentMap', 0);
            }


            // Update the camera position for reflections and lighting calculations
            const cameraPosition = this.camera.getPosition();
            glob.shaderManager.setUniform('u_viewPos', new Float32Array([cameraPosition.x, cameraPosition.y, cameraPosition.z]));

            // For each object in the scene
            for (const object of this.children) {
                object.render(obj, viewMatrix, projectionMatrix);
            }
        }

        this.frameCount++;
    }

    public dispose(): void {
        for (const object of this.children) {
            object.vao.dispose();
            object.indexBuffer?.dispose();
        }
        // Dispose skybox resources
        this.skybox.dispose();
        this.children = [];
    }

    public tick(obj: TickerReturnData) {
    }
    public afterTick(obj: TickerReturnData) {
        this.render(obj);
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

    public getActualColor(vector2: Vector2, range: 1 | 255 = 1): Vector3 | undefined {
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
        if (range === 1) {
            color = color.scale(1 / 255);
        }
        return color;

    }

    public getColor(vector2: Vector2): SceneObject | undefined {
        const color = this.getActualColor(vector2);

        // Check for black or white (no object)
        if (color.equals(v3(0, 0, 0)) || color.equals(v3(1, 1, 1))) return undefined;

        // Find matching object
        for (const object of this.children) {
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

    public async setEnvironmentMap(envMapUrl: string) {
        const envMap = await EnvironmentMapLoader.loadFromDirectory(envMapUrl);
        this.environmentMap = envMap;
        this.skybox.setEnvironmentMap(envMap);
    }
} 