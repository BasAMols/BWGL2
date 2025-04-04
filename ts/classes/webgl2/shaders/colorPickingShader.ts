// Color picking vertex shader
export const colorPickingVertexShader = `#version 300 es
in vec3 a_position;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
}`;

// Color picking fragment shader
export const colorPickingFragmentShader = `#version 300 es
precision highp float;

uniform vec3 u_pickingColor;
out vec4 fragColor;

void main() {
    fragColor = vec4(u_pickingColor, 1.0);
}`; 