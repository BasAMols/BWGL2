export const fragmentShaderSource = `#version 300 es
precision highp float;

// Maximum number of lights
#define MAX_LIGHTS 10

// Light types
#define LIGHT_TYPE_INACTIVE -1
#define LIGHT_TYPE_AMBIENT 0
#define LIGHT_TYPE_DIRECTIONAL 1
#define LIGHT_TYPE_POINT 2
#define LIGHT_TYPE_SPOT 3

// Input from vertex shader
in vec3 vNormal;
in vec2 vTexCoord;
in vec3 vFragPos;
in vec3 vColor;

// Light uniforms
uniform int uLightTypes[MAX_LIGHTS];
uniform vec3 uLightPositions[MAX_LIGHTS];
uniform vec3 uLightDirections[MAX_LIGHTS];
uniform vec3 uLightColors[MAX_LIGHTS];
uniform float uLightIntensities[MAX_LIGHTS];
uniform float uLightConstants[MAX_LIGHTS];
uniform float uLightLinears[MAX_LIGHTS];
uniform float uLightQuadratics[MAX_LIGHTS];
uniform float uLightCutOffs[MAX_LIGHTS];
uniform float uLightOuterCutOffs[MAX_LIGHTS];
uniform int uNumLights;

// Other uniforms
uniform vec3 uViewPos;
uniform sampler2D uTexture;
uniform bool uUseTexture;
uniform float uShininess;

// Output
out vec4 fragColor;

// Function to calculate directional light
vec3 calcDirectionalLight(int index, vec3 normal, vec3 viewDir, vec3 baseColor) {
    vec3 lightDir = normalize(-uLightDirections[index]);
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    
    vec3 ambient = uLightColors[index] * 0.1;
    vec3 diffuse = uLightColors[index] * diff;
    vec3 specular = uLightColors[index] * spec * 0.5;
    
    return (ambient + diffuse + specular) * uLightIntensities[index] * baseColor;
}

// Function to calculate point light
vec3 calcPointLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {
    vec3 lightDir = normalize(uLightPositions[index] - fragPos);
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    
    // Attenuation
    float distance = length(uLightPositions[index] - fragPos);
    float attenuation = 1.0 / (uLightConstants[index] + uLightLinears[index] * distance + uLightQuadratics[index] * distance * distance);
    
    vec3 ambient = uLightColors[index] * 0.1;
    vec3 diffuse = uLightColors[index] * diff;
    vec3 specular = uLightColors[index] * spec * 0.5;
    
    return (ambient + diffuse + specular) * attenuation * uLightIntensities[index] * baseColor;
}

// Function to calculate spot light
vec3 calcSpotLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {
    vec3 lightDir = normalize(uLightPositions[index] - fragPos);
    
    // Spot light intensity
    float theta = dot(lightDir, normalize(-uLightDirections[index]));
    float epsilon = uLightCutOffs[index] - uLightOuterCutOffs[index];
    float intensity = clamp((theta - uLightOuterCutOffs[index]) / epsilon, 0.0, 1.0);
    
    // Use point light calculation and multiply by spot intensity
    return calcPointLight(index, normal, fragPos, viewDir, baseColor) * intensity;
}

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(uViewPos - vFragPos);
    vec3 baseColor = uUseTexture ? texture(uTexture, vTexCoord).rgb : vColor;
    
    vec3 result = vec3(0.0);
    
    // Calculate contribution from each light
    for(int i = 0; i < uNumLights; i++) {
        if(i >= MAX_LIGHTS) break;
        
        // Skip inactive lights
        if(uLightTypes[i] == LIGHT_TYPE_INACTIVE) continue;
        
        if(uLightTypes[i] == LIGHT_TYPE_AMBIENT) {
            result += uLightColors[i] * uLightIntensities[i] * baseColor;
        }
        else if(uLightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {
            result += calcDirectionalLight(i, normal, viewDir, baseColor);
        }
        else if(uLightTypes[i] == LIGHT_TYPE_POINT) {
            result += calcPointLight(i, normal, vFragPos, viewDir, baseColor);
        }
        else if(uLightTypes[i] == LIGHT_TYPE_SPOT) {
            result += calcSpotLight(i, normal, vFragPos, viewDir, baseColor);
        }
    }
    
    fragColor = vec4(result, 1.0);
}`; 