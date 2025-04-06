export const pbrFragmentShader = `#version 300 es
precision highp float;

// Constants
#define PI 3.14159265359
#define MAX_LIGHTS 10

// Light types
#define LIGHT_TYPE_INACTIVE -1
#define LIGHT_TYPE_AMBIENT 0
#define LIGHT_TYPE_DIRECTIONAL 1
#define LIGHT_TYPE_POINT 2
#define LIGHT_TYPE_SPOT 3

// PBR Material uniforms
struct PBRMaterial {
    vec3 baseColor;
    float roughness;
    float metallic;
    float ambientOcclusion;
    vec3 emissive;
    
    sampler2D albedoMap;
    sampler2D normalMap;
    sampler2D metallicRoughnessMap;
    sampler2D aoMap;
    sampler2D emissiveMap;
    
    bool hasAlbedoMap;
    bool hasNormalMap;
    bool hasMetallicRoughnessMap;
    bool hasAoMap;
    bool hasEmissiveMap;
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

// Shadow mapping uniforms
uniform sampler2D u_shadowMap0;
uniform sampler2D u_shadowMap1;
uniform sampler2D u_shadowMap2;
uniform sampler2D u_shadowMap3;
uniform mat4 u_lightSpaceMatrices[MAX_LIGHTS];
uniform bool u_castsShadow[MAX_LIGHTS];

// Material uniforms
uniform PBRMaterial u_material;
uniform vec3 u_viewPos;

// Varyings from vertex shader
in vec3 v_normal;
in vec2 v_texCoord;
in vec3 v_worldPos;
in mat3 v_tbn;
in vec3 v_color;

// Output
out vec4 fragColor;

// Utility function to get shadowmap value
float getShadowMap(int index, vec2 coords) {
    // We have to use a switch statement because WebGL2 requires constant array indices for samplers
    // Note: Explicitly using .r component as we're using DEPTH_COMPONENT textures
    switch(index) {
        case 0: return texture(u_shadowMap0, coords).r;
        case 1: return texture(u_shadowMap1, coords).r;
        case 2: return texture(u_shadowMap2, coords).r;
        case 3: return texture(u_shadowMap3, coords).r;
        default: return 1.0; // No shadow if invalid index
    }
}

// Shadow calculation function
float ShadowCalculation(vec4 fragPosLightSpace, vec3 normal, vec3 lightDir, int shadowMapIndex) {
    // Ensure we only process shadow maps that exist in the shader
    if (shadowMapIndex > 3) {
        return 0.0; // Return no shadow if the index is beyond the available shadow maps
    }
    
    // Perform perspective divide
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    
    // Transform to [0,1] range
    projCoords = projCoords * 0.5 + 0.5;
    
    // Check if fragment is in light's view frustum
    if (projCoords.x < 0.0 || projCoords.x > 1.0 || 
        projCoords.y < 0.0 || projCoords.y > 1.0 || 
        projCoords.z < 0.0 || projCoords.z > 1.0) {
        return 0.0; // Not in shadow if outside frustum
    }
    
    // Calculate bias based on surface angle to reduce shadow acne
    // Use a smaller bias since we've improved shadow map precision
    float bias = max(0.001 * (1.0 - dot(normal, lightDir)), 0.0005);
    
    // Get depth from shadow map
    float closestDepth = getShadowMap(shadowMapIndex, projCoords.xy);
    float currentDepth = projCoords.z;
    
    // Debug - uncomment to log values
    // if (gl_FragCoord.x < 1.0 && gl_FragCoord.y < 1.0) {
    //     float diff = currentDepth - closestDepth;
    //     if (abs(diff) < 0.1) {
    //         // Add code to print values if needed
    //     }
    // }
    
    // Simple shadow check with bias
    // return (currentDepth - bias) > closestDepth ? 1.0 : 0.0;
    
    // PCF (Percentage Closer Filtering) with larger kernel for softer shadows
    float shadow = 0.0;
    vec2 texelSize = 1.0 / vec2(textureSize(u_shadowMap0, 0));
    
    for(int x = -2; x <= 2; ++x) {
        for(int y = -2; y <= 2; ++y) {
            float pcfDepth = getShadowMap(shadowMapIndex, projCoords.xy + vec2(x, y) * texelSize);
            shadow += (currentDepth - bias) > pcfDepth ? 1.0 : 0.0;
        }
    }
    
    shadow /= 25.0; // 5x5 kernel
    
    // Fade out shadows at the edge of the light's frustum for smoother transitions
    float fadeStart = 0.9;
    float distanceFromCenter = length(vec2(0.5, 0.5) - projCoords.xy) * 2.0;
    if (distanceFromCenter > fadeStart) {
        float fadeRatio = (distanceFromCenter - fadeStart) / (1.0 - fadeStart);
        shadow = mix(shadow, 0.0, fadeRatio);
    }
    
    return shadow;
}

// PBR functions

// Normal Distribution Function (GGX/Trowbridge-Reitz)
float DistributionGGX(vec3 N, vec3 H, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH * NdotH;
    
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;
    
    return a2 / max(denom, 0.0000001);
}

// Geometry function (Smith model)
float GeometrySchlickGGX(float NdotV, float roughness) {
    float r = (roughness + 1.0);
    float k = (r * r) / 8.0;
    
    float denom = NdotV * (1.0 - k) + k;
    return NdotV / max(denom, 0.0000001);
}

// Combined Geometry function
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);
    
    return ggx1 * ggx2;
}

// Fresnel function (Schlick's approximation)
vec3 FresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}

// Calculates radiance for a light source
vec3 calculateRadiance(vec3 N, vec3 V, vec3 L, vec3 H, vec3 F0, 
                       vec3 albedo, float metallic, float roughness,
                       vec3 lightColor, float lightIntensity,
                       float attenuation) {
    // Calculate light attenuation
    float attenuatedIntensity = lightIntensity * attenuation;
    
    // Ensure roughness is never zero (to prevent divide-by-zero in GGX)
    roughness = max(roughness, 0.01);
    
    // Cook-Torrance BRDF calculation
    float NDF = DistributionGGX(N, H, roughness);
    float G = GeometrySmith(N, V, L, roughness);
    vec3 F = FresnelSchlick(max(dot(H, V), 0.0), F0);
    
    // Calculate specular component
    vec3 numerator = NDF * G * F;
    float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
    vec3 specular = numerator / max(denominator, 0.0000001);
    
    // Prevent uncontrolled specular highlights by clamping
    specular = min(specular, vec3(10.0));
    
    // For energy conservation
    vec3 kS = F;
    vec3 kD = vec3(1.0) - kS;
    kD *= 1.0 - metallic; // Metallic materials don't have diffuse
    
    // Combine diffuse and specular terms
    float NdotL = max(dot(N, L), 0.0);
    return (kD * albedo / PI + specular) * lightColor * attenuatedIntensity * NdotL;
}

void main() {
    // Get material properties, using textures if available
    
    // Base color (albedo)
    vec3 albedo = u_material.baseColor;
    if (u_material.hasAlbedoMap) {
        albedo = texture(u_material.albedoMap, v_texCoord).rgb;
    } else {
        // Use vertex color if no albedo map is provided
        albedo = v_color;
    }
    
    // Metallic and roughness
    float metallic = u_material.metallic;
    float roughness = u_material.roughness;
    if (u_material.hasMetallicRoughnessMap) {
        // Standard PBR convention: G channel = roughness, B channel = metallic
        vec3 metallicRoughness = texture(u_material.metallicRoughnessMap, v_texCoord).rgb;
        roughness = metallicRoughness.g;
        metallic = metallicRoughness.b;
    }
    
    // Ambient occlusion
    float ao = u_material.ambientOcclusion;
    if (u_material.hasAoMap) {
        ao = texture(u_material.aoMap, v_texCoord).r;
    }
    
    // Normals (with normal mapping if available)
    vec3 N = normalize(v_normal);
    if (u_material.hasNormalMap) {
        vec3 normalMapValue = texture(u_material.normalMap, v_texCoord).rgb * 2.0 - 1.0;
        N = normalize(v_tbn * normalMapValue);
    }
    
    // Emissive
    vec3 emissive = u_material.emissive;
    if (u_material.hasEmissiveMap) {
        emissive = texture(u_material.emissiveMap, v_texCoord).rgb;
    }
    
    // Calculate view direction
    vec3 V = normalize(u_viewPos - v_worldPos);
    
    // Calculate fresnel reflection at normal incidence (F0)
    // For most materials, F0 is monochromatic (0.04)
    // For metals, we use the albedo color 
    vec3 F0 = vec3(0.04);
    F0 = mix(F0, albedo, metallic);
    
    // Initialize result
    vec3 Lo = vec3(0.0);
    
    // Calculate lighting contribution from each light
    for(int i = 0; i < u_numLights; i++) {
        if(i >= MAX_LIGHTS || u_lightTypes[i] == LIGHT_TYPE_INACTIVE) 
            continue;
        
        // Calculate light direction and intensity
        vec3 L;
        float attenuation = 1.0;
        
        if (u_lightTypes[i] == LIGHT_TYPE_DIRECTIONAL) {
            // Directional light
            L = normalize(-u_lightDirections[i]);
        } 
        else if (u_lightTypes[i] == LIGHT_TYPE_POINT || u_lightTypes[i] == LIGHT_TYPE_SPOT) {
            // Point or spot light
            L = normalize(u_lightPositions[i] - v_worldPos);
            
            // Calculate attenuation
            float distance = length(u_lightPositions[i] - v_worldPos);
            attenuation = 1.0 / (u_lightConstants[i] + 
                                 u_lightLinears[i] * distance + 
                                 u_lightQuadratics[i] * distance * distance);
            
            // For spot lights, calculate spotlight intensity
            if (u_lightTypes[i] == LIGHT_TYPE_SPOT) {
                float theta = dot(L, normalize(-u_lightDirections[i]));
                float epsilon = u_lightCutOffs[i] - u_lightOuterCutOffs[i];
                float intensity = clamp((theta - u_lightOuterCutOffs[i]) / epsilon, 0.0, 1.0);
                attenuation *= intensity;
            }
        }
        else if (u_lightTypes[i] == LIGHT_TYPE_AMBIENT) {
            // Ambient light (applied separately)
            continue;
        }
        
        // Calculate half vector
        vec3 H = normalize(V + L);
        
        // Calculate shadow
        float shadow = 0.0;
        if(u_castsShadow[i]) {
            vec4 fragPosLightSpace = u_lightSpaceMatrices[i] * vec4(v_worldPos, 1.0);
            shadow = ShadowCalculation(fragPosLightSpace, N, L, i);
        }
        
        // Add light contribution
        vec3 radiance = calculateRadiance(N, V, L, H, F0, albedo, metallic, roughness,
                                         u_lightColors[i], u_lightIntensities[i],
                                         attenuation);
        
        Lo += radiance * (1.0 - shadow);
    }
    
    // Add ambient light contribution (factoring in ambient occlusion)
    vec3 ambient = vec3(0.1) * albedo * ao; // Increased base ambient level

    // Add ambient from any ambient light sources
    for(int i = 0; i < u_numLights; i++) {
        if(i < MAX_LIGHTS && u_lightTypes[i] == LIGHT_TYPE_AMBIENT) {
            ambient += u_lightColors[i] * u_lightIntensities[i] * albedo * ao;
        }
    }

    // Add emissive contribution
    vec3 color = ambient + Lo + emissive;

    // Apply some rim lighting to highlight edges even in shadow
    float rim = 1.0 - max(dot(N, V), 0.0);
    rim = pow(rim, 3.0) * 0.2;
    color += rim * albedo * 0.3;

    // Enhance colored light visibility
    color = mix(color, color * 1.2, metallic);

    // Prevent oversaturation by clamping extremely bright values
    float maxLuminance = max(max(color.r, color.g), color.b);
    if (maxLuminance > 10.0) {
        color *= 10.0 / maxLuminance;
    }

    // Apply ACES filmic tone mapping for better dynamic range
    // Source: https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/
    vec3 mapped = (color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14);
    mapped = clamp(mapped, 0.0, 1.0);

    // Gamma correction
    color = pow(mapped, vec3(1.0/2.2));

    fragColor = vec4(color, 1.0);
}`; 