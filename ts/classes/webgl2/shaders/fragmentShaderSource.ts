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
in vec3 v_normal;
in vec2 v_texCoord;
in vec3 v_fragPos;
in vec3 v_color;
in vec4 v_fragPosLightSpace;

// Material structure
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    sampler2D diffuseMap;
};

// Light uniforms
uniform int u_lightTypes[MAX_LIGHTS];
uniform vec3 u_lightPositions[MAX_LIGHTS];
uniform vec3 u_lightDirections[MAX_LIGHTS];
uniform vec3 u_lightColors[MAX_LIGHTS];
uniform float u_lightIntensities[MAX_LIGHTS];
uniform float u_lightConstants[MAX_LIGHTS];
uniform float u_lightLinears[MAX_LIGHTS];
uniform float u_lightQuadratics[MAX_LIGHTS];
uniform float u_lightCutOffs[MAX_LIGHTS];
uniform float u_lightOuterCutOffs[MAX_LIGHTS];
uniform int u_numLights;

// Material uniforms
uniform Material u_material;
uniform bool u_useTexture;

// Shadow mapping uniforms
uniform sampler2D u_shadowMap0;
uniform sampler2D u_shadowMap1;
uniform sampler2D u_shadowMap2;
uniform sampler2D u_shadowMap3;
uniform sampler2D u_shadowMap4;
uniform sampler2D u_shadowMap5;
uniform sampler2D u_shadowMap6;
uniform sampler2D u_shadowMap7;
uniform sampler2D u_shadowMap8;
uniform sampler2D u_shadowMap9;
uniform mat4 u_lightSpaceMatrices[MAX_LIGHTS];
uniform bool u_castsShadow[MAX_LIGHTS];

// Other uniforms
uniform vec3 u_viewPos;

// Output
out vec4 fragColor;

float getShadowMap(int index, vec2 coords) {
    // We have to use a switch statement because WebGL2 requires constant array indices for samplers
    switch(index) {
        case 0: return texture(u_shadowMap0, coords).r;
        case 1: return texture(u_shadowMap1, coords).r;
        case 2: return texture(u_shadowMap2, coords).r;
        case 3: return texture(u_shadowMap3, coords).r;
        case 4: return texture(u_shadowMap4, coords).r;
        case 5: return texture(u_shadowMap5, coords).r;
        case 6: return texture(u_shadowMap6, coords).r;
        case 7: return texture(u_shadowMap7, coords).r;
        case 8: return texture(u_shadowMap8, coords).r;
        case 9: return texture(u_shadowMap9, coords).r;
        default: return 1.0; // No shadow if invalid index
    }
}

float ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir, int shadowMapIndex) {
    // Perform perspective divide
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    
    // Transform to [0,1] range
    projCoords = projCoords * 0.5 + 0.5;
    
    // Get closest depth value from light's perspective using the helper function
    float closestDepth = getShadowMap(shadowMapIndex, projCoords.xy);
    
    // Get current depth
    float currentDepth = projCoords.z;
    
    // Calculate bias based on surface angle
    float cosTheta = dot(normal, lightDir);
    float bias = 0.01; // Moderate base bias
    
    // Add angle-dependent component
    bias += 0.02 * (1.0 - max(cosTheta, 0.0));
    
    // PCF (Percentage Closer Filtering)
    float shadow = 0.0;
    vec2 texelSize = 1.0 / vec2(textureSize(u_shadowMap0, 0)); // All shadow maps are same size
    for(int x = -1; x <= 1; ++x) {
        for(int y = -1; y <= 1; ++y) {
            float pcfDepth = getShadowMap(shadowMapIndex, projCoords.xy + vec2(x, y) * texelSize);
            shadow += (currentDepth - bias) > pcfDepth ? 1.0 : 0.0;
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
    vec3 lightDir = normalize(-u_lightDirections[index]);
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
    
    vec3 ambient = u_lightColors[index] * u_material.ambient;
    vec3 diffuse = u_lightColors[index] * diff * baseColor;
    vec3 specular = u_lightColors[index] * spec * u_material.specular;
    
    return (ambient + diffuse + specular) * u_lightIntensities[index];
}

// Function to calculate point light
vec3 calcPointLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {
    vec3 lightDir = normalize(u_lightPositions[index] - fragPos);
    
    // Diffuse
    float diff = max(dot(normal, lightDir), 0.0);
    
    // Specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess);
    
    // Attenuation
    float distance = length(u_lightPositions[index] - fragPos);
    float attenuation = 1.0 / (u_lightConstants[index] + u_lightLinears[index] * distance + u_lightQuadratics[index] * distance * distance);
    
    vec3 ambient = u_lightColors[index] * u_material.ambient;
    vec3 diffuse = u_lightColors[index] * diff * baseColor * u_material.diffuse;
    vec3 specular = u_lightColors[index] * spec * u_material.specular;
    
    return (ambient + diffuse + specular) * attenuation * u_lightIntensities[index];
}

// Function to calculate spot light
vec3 calcSpotLight(int index, vec3 normal, vec3 fragPos, vec3 viewDir, vec3 baseColor) {
    vec3 lightDir = normalize(u_lightPositions[index] - fragPos);
    
    // Spot light intensity
    float theta = dot(lightDir, normalize(-u_lightDirections[index]));
    float epsilon = u_lightCutOffs[index] - u_lightOuterCutOffs[index];
    float intensity = clamp((theta - u_lightOuterCutOffs[index]) / epsilon, 0.0, 1.0);
    
    // Use point light calculation and multiply by spot intensity
    return calcPointLight(index, normal, fragPos, viewDir, baseColor) * intensity;
}

void main() {
    vec3 normal = normalize(v_normal);
    vec3 viewDir = normalize(u_viewPos - v_fragPos);
    
    // Get base color from texture or vertex color
    vec3 baseColor;
    if (u_useTexture) {
        baseColor = texture(u_material.diffuseMap, v_texCoord).rgb;
    } else {
        baseColor = v_color;
    }
    
    vec3 result = vec3(0.0);
    
    // Calculate contribution from each light
    for(int i = 0; i < u_numLights; i++) {
        if(i >= MAX_LIGHTS) break;
        
        // Skip inactive lights
        if(u_lightTypes[i] == LIGHT_TYPE_INACTIVE) continue;
        
        float shadow = 0.0;
        if(u_castsShadow[i]) {
            vec4 fragPosLightSpace = u_lightSpaceMatrices[i] * vec4(v_fragPos, 1.0);
            shadow = ShadowCalculation(fragPosLightSpace, normal, normalize(u_lightPositions[i] - v_fragPos), i);
        }
        
        if(u_lightTypes[i] == LIGHT_TYPE_AMBIENT) {
            result += u_lightColors[i] * u_lightIntensities[i] * baseColor;
        }
        else if(u_lightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {
            vec3 lighting = calcDirectionalLight(i, normal, viewDir, baseColor);
            result += lighting * (1.0 - shadow);
        }
        else if(u_lightTypes[i] == LIGHT_TYPE_POINT) {
            vec3 lighting = calcPointLight(i, normal, v_fragPos, viewDir, baseColor);
            result += lighting * (1.0 - shadow);
        }
        else if(u_lightTypes[i] == LIGHT_TYPE_SPOT) {
            vec3 lighting = calcSpotLight(i, normal, v_fragPos, viewDir, baseColor);
            result += lighting * (1.0 - shadow);
        }
    }
    
    fragColor = vec4(result, 1.0);
}`