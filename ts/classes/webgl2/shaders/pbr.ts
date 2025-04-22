export const vertexShader = `#version 300 es
    precision highp float;

    layout(location = 0) in vec3 position;
    layout(location = 1) in vec3 normal;
    layout(location = 2) in vec2 texCoord;
    layout(location = 3) in vec3 tangent;
    layout(location = 4) in vec3 bitangent;

    uniform mat4 modelMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;

    out vec2 vTexCoord;
    out vec3 vNormal;
    out vec3 vPosition;
    out mat3 vTBN;

    void main() {
        vTexCoord = texCoord;
        vNormal = normalMatrix * normal;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vPosition = worldPos.xyz;

        // Calculate TBN matrix for normal mapping
        vec3 T = normalize(normalMatrix * tangent);
        vec3 B = normalize(normalMatrix * bitangent);
        vec3 N = normalize(vNormal);
        vTBN = mat3(T, B, N);

        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

export const fragmentShader = `#version 300 es
    precision highp float;

    in vec2 vTexCoord;
    in vec3 vNormal;
    in vec3 vPosition;
    in mat3 vTBN;

    uniform vec3 cameraPosition;
    uniform sampler2D albedoMap;
    uniform sampler2D normalMap;
    uniform sampler2D metallicRoughnessMap;
    uniform vec3 lightPosition;
    uniform vec3 lightColor;

    out vec4 fragColor;

    const float PI = 3.14159265359;

    // PBR functions
    float DistributionGGX(vec3 N, vec3 H, float roughness) {
        float a = roughness * roughness;
        float a2 = a * a;
        float NdotH = max(dot(N, H), 0.0);
        float NdotH2 = NdotH * NdotH;

        float nom = a2;
        float denom = (NdotH2 * (a2 - 1.0) + 1.0);
        denom = PI * denom * denom;

        return nom / denom;
    }

    float GeometrySchlickGGX(float NdotV, float roughness) {
        float r = (roughness + 1.0);
        float k = (r * r) / 8.0;

        float nom = NdotV;
        float denom = NdotV * (1.0 - k) + k;

        return nom / denom;
    }

    float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
        float NdotV = max(dot(N, V), 0.0);
        float NdotL = max(dot(N, L), 0.0);
        float ggx2 = GeometrySchlickGGX(NdotV, roughness);
        float ggx1 = GeometrySchlickGGX(NdotL, roughness);

        return ggx1 * ggx2;
    }

    vec3 fresnelSchlick(float cosTheta, vec3 F0) {
        return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
    }

    void main() {
        // Sample textures
        vec4 albedo = texture(albedoMap, vTexCoord);
        vec4 metallicRoughness = texture(metallicRoughnessMap, vTexCoord);
        float metallic = metallicRoughness.b;
        float roughness = metallicRoughness.g;

        // Normal mapping
        vec3 normalMap = texture(normalMap, vTexCoord).rgb * 2.0 - 1.0;
        vec3 N = normalize(vTBN * normalMap);
        
        vec3 V = normalize(cameraPosition - vPosition);
        vec3 L = normalize(lightPosition - vPosition);
        vec3 H = normalize(V + L);

        // Calculate reflectance at normal incidence
        vec3 F0 = vec3(0.04); 
        F0 = mix(F0, albedo.rgb, metallic);

        // Cook-Torrance BRDF
        float NDF = DistributionGGX(N, H, roughness);   
        float G = GeometrySmith(N, V, L, roughness);      
        vec3 F = fresnelSchlick(max(dot(H, V), 0.0), F0);
           
        vec3 numerator = NDF * G * F; 
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.0001;
        vec3 specular = numerator / denominator;

        vec3 kS = F;
        vec3 kD = vec3(1.0) - kS;
        kD *= 1.0 - metallic;

        float NdotL = max(dot(N, L), 0.0);        

        vec3 Lo = (kD * albedo.rgb / PI + specular) * lightColor * NdotL;

        vec3 ambient = vec3(0.03) * albedo.rgb;
        vec3 color = ambient + Lo;

        // HDR tonemapping
        color = color / (color + vec3(1.0));
        // gamma correction
        color = pow(color, vec3(1.0/2.2)); 

        fragColor = vec4(color, albedo.a);
    }
`; 