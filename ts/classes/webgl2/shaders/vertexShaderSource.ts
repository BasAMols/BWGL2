export const vertexShaderSource = `#version 300 es

// Attributes
in vec3 a_position;
in vec3 a_normal;
in vec2 a_texCoord;
in vec3 a_color;

// Uniforms
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat3 u_normalMatrix; // Added for correct normal transformation
uniform mat4 u_lightSpaceMatrix; // Added for shadow mapping

// Material uniforms
struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
    sampler2D diffuseMap;
};
uniform Material u_material;
uniform bool u_useTexture;

// Varyings (output to fragment shader)
out vec3 v_normal;
out vec2 v_texCoord;
out vec3 v_fragPos;
out vec3 v_color;
out vec4 v_fragPosLightSpace; // Added for shadow mapping

void main() {
    // Calculate world space position
    vec4 worldPos = u_modelMatrix * vec4(a_position, 1.0);
    v_fragPos = worldPos.xyz;
    
    // Transform normal to world space using normal matrix
    v_normal = normalize(u_normalMatrix * a_normal);
    
    // Pass texture coordinates and color to fragment shader
    v_texCoord = a_texCoord;
    v_color = u_useTexture ? vec3(1.0) : (a_color * u_material.diffuse);
    
    // Calculate position in light space for shadow mapping
    v_fragPosLightSpace = u_lightSpaceMatrix * worldPos;
    
    // Calculate final position
    gl_Position = u_projectionMatrix * u_viewMatrix * worldPos;
}`;
