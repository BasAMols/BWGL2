export const skyboxFragmentShader = `#version 300 es
precision highp float;

// Input from vertex shader
in vec3 v_texCoord;

// Environment map
uniform samplerCube u_environmentMap;

// Output
out vec4 fragColor;

void main() {
    // Sample environment map (skybox) using direction vector
    vec3 color = texture(u_environmentMap, v_texCoord).rgb;
    
    // Apply tone mapping
    // color = color / (color + vec3(1.0)); // Reinhard tone mapping

    // Gamma correction
    color = pow(color, vec3(1.0/2.2));
    
    fragColor = vec4(color, 1.0);
}`; 