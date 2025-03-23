export const vertexShaderSource = `#version 300 es

// Attributes
in vec3 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;
in vec3 aColor;

// Uniforms
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix; // Added for correct normal transformation
uniform mat4 uLightSpaceMatrix; // Added for shadow mapping

// Material uniforms
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    sampler2D diffuseMap;
};
uniform Material uMaterial;
uniform bool uUseTexture;

// Varyings (output to fragment shader)
out vec3 vNormal;
out vec2 vTexCoord;
out vec3 vFragPos;
out vec3 vColor;
out vec4 vFragPosLightSpace; // Added for shadow mapping

void main() {
    // Calculate world space position
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vFragPos = worldPos.xyz;
    
    // Transform normal to world space using normal matrix
    vNormal = normalize(uNormalMatrix * aNormal);
    
    // Pass texture coordinates and color to fragment shader
    vTexCoord = aTexCoord;
    vColor = uUseTexture ? vec3(1.0) : (aColor * uMaterial.diffuse);
    
    // Calculate position in light space for shadow mapping
    vFragPosLightSpace = uLightSpaceMatrix * worldPos;
    
    // Calculate final position
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}`;
