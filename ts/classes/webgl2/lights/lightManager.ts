import { Light, LightType, DirectionalLight, PointLight, SpotLight, AmbientLight } from './light';
import { ShaderManager } from '../shaderManager';
import { v3 } from '../../util/math/vector3';

export class LightManager {
    private lights: Light[] = [];
    private shaderManager: ShaderManager;
    private ambientLight: AmbientLight | null = null;
    private readonly MAX_LIGHTS = 10;

    constructor(shaderManager: ShaderManager) {
        this.shaderManager = shaderManager;
        // Initialize with a default ambient light
        this.setAmbientLight(new AmbientLight({
            color: v3(1, 1, 1),
            intensity: 0.03 // Lower default ambient for PBR to emphasize directional lighting
        }));
    }

    /**
     * Sets the ambient light for the scene
     * For PBR, keep ambient light intensity low (0.01-0.05) to maintain physical accuracy
     */
    setAmbientLight(light: AmbientLight) {
        this.ambientLight = light;
        this.updateShaderUniforms();
    }

    /**
     * Adds a light to the scene
     * Note: For PBR, use higher intensities (5-10) for point and spot lights
     */
    addLight(light: Light) {
        if (light instanceof AmbientLight) {
            console.warn('Use setAmbientLight() to set the ambient light instead of addLight()');
            return;
        }
        if (this.lights.length >= this.MAX_LIGHTS) {
            console.warn(`Maximum number of lights (${this.MAX_LIGHTS}) reached. Light not added.`);
            return;
        }
        this.lights.push(light);
        this.updateShaderUniforms();
    }

    removeLight(light: Light) {
        if (light instanceof AmbientLight) {
            console.warn('Cannot remove ambient light. Use setAmbientLight() to modify it instead');
            return;
        }
        const index = this.lights.indexOf(light);
        if (index !== -1) {
            this.lights.splice(index, 1);
            this.updateShaderUniforms();
        }
    }

    getLights(): Light[] {
        return this.lights;
    }

    /**
     * Updates all light-related shader uniforms
     * This sets the PBR-optimized values for lights in the shader
     */
    updateShaderUniforms() {
        // Initialize arrays for each light component
        const types = new Int32Array(this.MAX_LIGHTS);
        const positions = new Float32Array(this.MAX_LIGHTS * 3);
        const directions = new Float32Array(this.MAX_LIGHTS * 3);
        const colors = new Float32Array(this.MAX_LIGHTS * 3);
        const intensities = new Float32Array(this.MAX_LIGHTS);
        const constants = new Float32Array(this.MAX_LIGHTS);
        const linears = new Float32Array(this.MAX_LIGHTS);
        const quadratics = new Float32Array(this.MAX_LIGHTS);
        const cutOffs = new Float32Array(this.MAX_LIGHTS);
        const outerCutOffs = new Float32Array(this.MAX_LIGHTS);

        // Initialize all lights as inactive
        types.fill(LightType.INACTIVE);
        // Set default attenuation values
        constants.fill(1.0);

        let currentIndex = 0;

        // Set ambient light first (if exists and enabled)
        if (this.ambientLight && this.ambientLight.isEnabled()) {
            const data = this.ambientLight.getData();
            types[currentIndex] = LightType.AMBIENT;
            
            // Set color
            colors[currentIndex * 3] = data.color.x;
            colors[currentIndex * 3 + 1] = data.color.y;
            colors[currentIndex * 3 + 2] = data.color.z;
            
            // Set intensity
            intensities[currentIndex] = data.intensity;
            currentIndex++;
        }

        // Fill in active lights
        for (const light of this.lights) {
            // Skip disabled lights
            if (!light.isEnabled()) continue;
            
            // Skip if we've reached the maximum lights
            if (currentIndex >= this.MAX_LIGHTS) {
                console.warn(`Maximum number of lights (${this.MAX_LIGHTS}) reached. Some lights will not be rendered.`);
                break;
            }
            
            const data = light.getData();

            // Set type
            types[currentIndex] = light.getType();

            // Set color and intensity (common to all lights)
            const colorOffset = currentIndex * 3;
            colors[colorOffset] = data.color.x;
            colors[colorOffset + 1] = data.color.y;
            colors[colorOffset + 2] = data.color.z;
            intensities[currentIndex] = data.intensity;

            // Type-specific properties
            switch (light.getType()) {
                case LightType.DIRECTIONAL: {
                    const dirLight = light as DirectionalLight;
                    const dirData = dirLight.getData();
                    const dirOffset = currentIndex * 3;
                    directions[dirOffset] = dirData.direction.x;
                    directions[dirOffset + 1] = dirData.direction.y;
                    directions[dirOffset + 2] = dirData.direction.z;
                    break;
                }
                case LightType.POINT: {
                    const pointLight = light as PointLight;
                    const pointData = pointLight.getData();
                    const posOffset = currentIndex * 3;
                    positions[posOffset] = pointData.position.x;
                    positions[posOffset + 1] = pointData.position.y;
                    positions[posOffset + 2] = pointData.position.z;
                    constants[currentIndex] = pointData.constant;
                    linears[currentIndex] = pointData.linear;
                    quadratics[currentIndex] = pointData.quadratic;
                    break;
                }
                case LightType.SPOT: {
                    const spotLight = light as SpotLight;
                    const spotData = spotLight.getData();
                    const posOffset = currentIndex * 3;
                    const dirOffset = currentIndex * 3;
                    positions[posOffset] = spotData.position.x;
                    positions[posOffset + 1] = spotData.position.y;
                    positions[posOffset + 2] = spotData.position.z;
                    directions[dirOffset] = spotData.direction.x;
                    directions[dirOffset + 1] = spotData.direction.y;
                    directions[dirOffset + 2] = spotData.direction.z;
                    constants[currentIndex] = spotData.constant;
                    linears[currentIndex] = spotData.linear;
                    quadratics[currentIndex] = spotData.quadratic;
                    cutOffs[currentIndex] = spotData.cutOff;
                    outerCutOffs[currentIndex] = spotData.outerCutOff;
                    break;
                }
            }
            currentIndex++;
        }

        // Update shader uniforms with the actual number of active lights
        this.shaderManager.setUniform('u_numLights', currentIndex);
        this.shaderManager.setUniform('u_lightTypes', types);
        this.shaderManager.setUniform('u_lightPositions', positions);
        this.shaderManager.setUniform('u_lightDirections', directions);
        this.shaderManager.setUniform('u_lightColors', colors);
        this.shaderManager.setUniform('u_lightIntensities', intensities);
        this.shaderManager.setUniform('u_lightConstants', constants);
        this.shaderManager.setUniform('u_lightLinears', linears);
        this.shaderManager.setUniform('u_lightQuadratics', quadratics);
        this.shaderManager.setUniform('u_lightCutOffs', cutOffs);
        this.shaderManager.setUniform('u_lightOuterCutOffs', outerCutOffs);
    }
} 