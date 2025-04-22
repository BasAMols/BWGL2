export const skyboxVertexShader = `#version 300 es
precision highp float;

// Attributes
in vec3 a_position;

// Uniforms
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

// Output to fragment shader
out vec3 v_texCoord;

void main() {
    // Use position as texture coordinate for cubemap sampling
    v_texCoord = a_position;
    
    // Remove translation from view matrix to keep skybox centered on camera
    mat4 viewMatrixNoTranslation = mat4(
        vec4(u_viewMatrix[0].xyz, 0.0),
        vec4(u_viewMatrix[1].xyz, 0.0),
        vec4(u_viewMatrix[2].xyz, 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
    
    // Position vertices at the far plane
    vec4 pos = u_projectionMatrix * viewMatrixNoTranslation * vec4(a_position, 1.0);
    
    // Set z equal to w to ensure skybox is always at the far plane
    gl_Position = pos.xyww;
}`; 