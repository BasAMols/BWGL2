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

// Varyings (output to fragment shader)
out vec3 vNormal;
out vec2 vTexCoord;
out vec3 vFragPos;
out vec3 vColor;

void main() {
    // Calculate world space position
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vFragPos = worldPos.xyz;
    
    // Transform normal to world space
    // Note: This assumes uniform scaling. For non-uniform scaling, use the normal matrix
    vNormal = mat3(uModelMatrix) * aNormal;
    
    // Pass texture coordinates and color to fragment shader
    vTexCoord = aTexCoord;
    vColor = aColor;
    
    // Calculate final position
    gl_Position = uProjectionMatrix * uViewMatrix * worldPos;
}`;
