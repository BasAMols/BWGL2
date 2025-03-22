export const fragmentShaderSource = `#version 300 es
precision highp float;

// Input from vertex shader
in vec3 vNormal;
in vec2 vTexCoord;
in vec3 vFragPos;
in vec3 vColor;

// Uniforms
uniform vec3 uLightPos;
uniform vec3 uViewPos;
uniform vec3 uLightColor;
uniform sampler2D uTexture;
uniform bool uUseTexture;

// Output
out vec4 fragColor;

void main() {
    // Normalize the normal vector
    vec3 normal = normalize(vNormal);
    
    // Light properties
    vec3 lightColor = uLightColor;
    float ambientStrength = 0.1;
    float specularStrength = 0.5;
    float shininess = 32.0;

    // Ambient
    vec3 ambient = ambientStrength * lightColor;

    // Diffuse
    vec3 lightDir = normalize(uLightPos - vFragPos);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    // Specular
    vec3 viewDir = normalize(uViewPos - vFragPos);
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
    vec3 specular = specularStrength * spec * lightColor;

    // Combine results
    vec3 baseColor = uUseTexture ? texture(uTexture, vTexCoord).rgb : vColor;
    vec3 result = (ambient + diffuse + specular) * baseColor;

    // Output final color
    fragColor = vec4(result, 1.0);
}`; 