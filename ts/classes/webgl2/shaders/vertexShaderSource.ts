export const vertexShaderSource = `#version 300 es
precision highp float;

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

void main() {
    v_fragPos = vec3(u_modelMatrix * vec4(a_position, 1.0));
    v_normal = u_normalMatrix * a_normal;
    v_texCoord = a_texCoord;
    v_color = a_color;
    
    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(v_fragPos, 1.0);
}`;
