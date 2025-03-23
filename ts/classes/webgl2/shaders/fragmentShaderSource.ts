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
in vec4 vFragPosLightSpace;

// Material structure
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    sampler2D diffuseMap;
};

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

// Material uniforms
uniform Material uMaterial;
uniform bool uUseTexture;

// Shadow mapping uniforms
uniform sampler2D uShadowMap;
uniform mat4 uLightSpaceMatrix;

// Other uniforms
uniform vec3 uViewPos;

// Output
out vec4 fragColor;

float ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir) {
    // Perform perspective divide
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    
    // Transform to [0,1] range
    projCoords = projCoords * 0.5 + 0.5;
    
    // Get closest depth value from light's perspective
    float closestDepth = texture(uShadowMap, projCoords.xy).r;
    
    // Get current depth
    float currentDepth = projCoords.z;
    
    // Calculate bias based on surface angle
    float bias = max(0.05 * (1.0 - dot(normal, lightDir)), 0.005);
    
    // PCF (Percentage Closer Filtering)
    float shadow = 0.0;
    vec2 texelSize = 1.0 / vec2(textureSize(uShadowMap, 0));
    for(int x = -1; x <= 1; ++x) {
        for(int y = -1; y <= 1; ++y) {
            float pcfDepth = texture(uShadowMap, projCoords.xy + vec2(x, y) * texelSize).r;
            shadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0;
        }
    }
    shadow /= 9.0;
    
    // Keep shadow at 0.0 when outside the far plane region of the light's frustum
    if(projCoords.z > 1.0)
        shadow = 0.0;
        
    return shadow;
}

// Function to calculate directional light
vec3 calcDirectionalLight(int index, vec3 normal, vec3 viewDir, vec3 baseColor) {
    vec3 lightDir = normalize(-uLightDirections[index]);
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
    
    vec3 ambient = uLightColors[index] * uMaterial.ambient;
    vec3 diffuse = uLightColors[index] * diff * baseColor;
    vec3 specular = uLightColors[index] * spec * uMaterial.specular;
    
    return (ambient + diffuse + specular) * uLightIntensities[index];
}

// Function to calculate point light
vec3 calcPointLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {
    vec3 lightDir = normalize(uLightPositions[index] - fragPos);
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uMaterial.shininess);
    
    // Attenuation
    float distance = length(uLightPositions[index] - fragPos);
    float attenuation = 1.0 / (uLightConstants[index] + uLightLinears[index] * distance + uLightQuadratics[index] * distance * distance);
    
    vec3 ambient = uLightColors[index] * uMaterial.ambient;
    vec3 diffuse = uLightColors[index] * diff * baseColor;
    vec3 specular = uLightColors[index] * spec * uMaterial.specular;
    
    return (ambient + diffuse + specular) * attenuation * uLightIntensities[index];
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
    
    // Get base color from texture or vertex color
    vec3 baseColor;
    if (uUseTexture) {
        baseColor = texture(uMaterial.diffuseMap, vTexCoord).rgb;
    } else {
        baseColor = vColor;
    }
    
    vec3 result = vec3(0.0);
    float shadow = ShadowCalculation(vFragPosLightSpace, normal, normalize(uLightPositions[0] - vFragPos));
    
    // Calculate contribution from each light
    for(int i = 0; i < uNumLights; i++) {
        if(i >= MAX_LIGHTS) break;
        
        // Skip inactive lights
        if(uLightTypes[i] == LIGHT_TYPE_INACTIVE) continue;
        
        if(uLightTypes[i] == LIGHT_TYPE_AMBIENT) {
            result += uLightColors[i] * uLightIntensities[i] * baseColor;
        }
        else if(uLightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {
            vec3 lighting = calcDirectionalLight(i, normal, viewDir, baseColor);
            result += lighting * (1.0 - shadow);
        }
        else if(uLightTypes[i] == LIGHT_TYPE_POINT) {
            vec3 lighting = calcPointLight(i, normal, vFragPos, viewDir, baseColor);
            result += lighting * (1.0 - shadow);
        }
        else if(uLightTypes[i] == LIGHT_TYPE_SPOT) {
            vec3 lighting = calcSpotLight(i, normal, vFragPos, viewDir, baseColor);
            result += lighting * (1.0 - shadow);
        }
    }
    
    fragColor = vec4(result, 1.0);
}`; 