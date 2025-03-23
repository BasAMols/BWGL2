export const shadowVertexShaderSource = `#version 300 es
precision highp float;

in vec3 aPosition;
uniform mat4 u_lightSpaceMatrix;
uniform mat4 u_model;

void main() {
    gl_Position = u_lightSpaceMatrix * u_model * vec4(aPosition, 1.0);
}
`; 