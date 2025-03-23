import { Light, LightType, DirectionalLight, PointLight, SpotLight, AmbientLight } from './light';
import { ShaderManager } from '../shaderManager';

export class LightManager {
    private lights: Light[] = [];
    private shaderManager: ShaderManager;
    private ambientLight: AmbientLight | null = null;

    constructor(shaderManager: ShaderManager) {
        this.shaderManager = shaderManager;
    }

    setAmbientLight(light: AmbientLight) {
        this.ambientLight = light;
        this.updateShaderUniforms();
    }

    addLight(light: Light) {
        if (light instanceof AmbientLight) {
            console.warn('Use setAmbientLight() to set the ambient light instead of addLight()');
            return;
        }
        if (this.lights.length >= 10) {
            console.warn('Maximum number of lights (10) reached. Light not added.');
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

    updateShaderUniforms() {
        // Initialize arrays for each light component
        const types = new Int32Array(10);
        const positions = new Float32Array(30); // 10 lights * 3 components
        const directions = new Float32Array(30);
        const colors = new Float32Array(30);
        const intensities = new Float32Array(10);
        const constants = new Float32Array(10);
        const linears = new Float32Array(10);
        const quadratics = new Float32Array(10);
        const cutOffs = new Float32Array(10);
        const outerCutOffs = new Float32Array(10);

        // Initialize all lights as inactive
        types.fill(-1);

        // Set ambient light first (if exists)
        if (this.ambientLight) {
            const data = this.ambientLight.getData();
            types[0] = LightType.AMBIENT;
            
            // Set color
            colors[0] = data.color.x;
            colors[1] = data.color.y;
            colors[2] = data.color.z;
            
            // Set intensity
            intensities[0] = data.intensity;
        }

        // Fill in active lights (starting from index 1 if we have ambient light)
        const startIndex = this.ambientLight ? 1 : 0;
        for (let i = 0; i < this.lights.length; i++) {
            const light = this.lights[i];
            const index = i + startIndex;
            const data = light.getData();

            // Set type
            types[index] = light.getType();

            // Set color and intensity (common to all lights)
            const colorOffset = index * 3;
            colors[colorOffset] = data.color.x;
            colors[colorOffset + 1] = data.color.y;
            colors[colorOffset + 2] = data.color.z;
            intensities[index] = data.intensity;

            // Type-specific properties
            switch (light.getType()) {
                case LightType.DIRECTIONAL: {
                    const dirLight = light as DirectionalLight;
                    const dirData = dirLight.getData();
                    const dirOffset = index * 3;
                    directions[dirOffset] = dirData.direction.x;
                    directions[dirOffset + 1] = dirData.direction.y;
                    directions[dirOffset + 2] = dirData.direction.z;
                    break;
                }
                case LightType.POINT: {
                    const pointLight = light as PointLight;
                    const pointData = pointLight.getData();
                    const posOffset = index * 3;
                    positions[posOffset] = pointData.position.x;
                    positions[posOffset + 1] = pointData.position.y;
                    positions[posOffset + 2] = pointData.position.z;
                    constants[index] = pointData.constant;
                    linears[index] = pointData.linear;
                    quadratics[index] = pointData.quadratic;
                    break;
                }
                case LightType.SPOT: {
                    const spotLight = light as SpotLight;
                    const spotData = spotLight.getData();
                    const posOffset = index * 3;
                    const dirOffset = index * 3;
                    positions[posOffset] = spotData.position.x;
                    positions[posOffset + 1] = spotData.position.y;
                    positions[posOffset + 2] = spotData.position.z;
                    directions[dirOffset] = spotData.direction.x;
                    directions[dirOffset + 1] = spotData.direction.y;
                    directions[dirOffset + 2] = spotData.direction.z;
                    constants[index] = spotData.constant;
                    linears[index] = spotData.linear;
                    quadratics[index] = spotData.quadratic;
                    cutOffs[index] = spotData.cutOff;
                    outerCutOffs[index] = spotData.outerCutOff;
                    break;
                }
            }
        }

        // Update shader uniforms
        const numLights = this.lights.length + (this.ambientLight ? 1 : 0);
        this.shaderManager.setUniform('uNumLights', numLights);
        this.shaderManager.setUniform('uLightTypes', types);
        this.shaderManager.setUniform('uLightPositions', positions);
        this.shaderManager.setUniform('uLightDirections', directions);
        this.shaderManager.setUniform('uLightColors', colors);
        this.shaderManager.setUniform('uLightIntensities', intensities);
        this.shaderManager.setUniform('uLightConstants', constants);
        this.shaderManager.setUniform('uLightLinears', linears);
        this.shaderManager.setUniform('uLightQuadratics', quadratics);
        this.shaderManager.setUniform('uLightCutOffs', cutOffs);
        this.shaderManager.setUniform('uLightOuterCutOffs', outerCutOffs);
    }

    private getLightTypeValue(type: LightType): number {
        switch (type) {
            case LightType.AMBIENT: return 0;
            case LightType.DIRECTIONAL: return 1;
            case LightType.POINT: return 2;
            case LightType.SPOT: return 3;
            default: return 0;
        }
    }
} 