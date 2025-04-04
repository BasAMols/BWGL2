export const pbrVertexShader = `#version 300 es
precision highp float;

// Attributes
in vec3 a_position;
in vec3 a_normal;
in vec2 a_texCoord;
in vec3 a_tangent;
in vec3 a_bitangent;
in vec3 a_color;

// Uniforms
uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;
uniform mat3 u_normalMatrix;

// Varyings (output to fragment shader)
out vec3 v_position;
out vec3 v_normal;
out vec2 v_texCoord;
out vec3 v_worldPos;
out mat3 v_tbn; // Tangent-Bitangent-Normal matrix for normal mapping
out vec3 v_color;

void main() {
    // Calculate world position
    v_worldPos = vec3(u_modelMatrix * vec4(a_position, 1.0));
    
    // Transform normals using normal matrix
    v_normal = normalize(u_normalMatrix * a_normal);
    
    // Pass texture coordinates
    v_texCoord = a_texCoord;
    
    // Pass color
    v_color = a_color;
    
    // Calculate TBN matrix for normal mapping when tangents are available
    if (length(a_tangent) > 0.0) {
        vec3 T = normalize(u_normalMatrix * a_tangent);
        vec3 B = normalize(u_normalMatrix * a_bitangent);
        vec3 N = v_normal;
        v_tbn = mat3(T, B, N);
    } else {
        // Identity TBN when no tangents provided
        v_tbn = mat3(1.0);
    }
    
    // Calculate clip-space position
    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(v_worldPos, 1.0);
}`; 