export const debugDepthVertexShader = `#version 300 es
precision highp float;

in vec2 a_position;
in vec2 a_texCoord;

out vec2 v_texCoord;

void main() {
    v_texCoord = a_texCoord;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const debugDepthFragmentShader = `#version 300 es
precision highp float;

uniform sampler2D u_texture;
in vec2 v_texCoord;
out vec4 fragColor;

void main() {
    float depth = texture(u_texture, v_texCoord).r;
    
    // Output raw depth values for better debugging
    // Don't apply any transformations to better see the actual values
    if (depth == 0.0) {
        // Show black for zero depth - may indicate problems
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else if (depth >= 1.0) {
        // Show white for maximum depth
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        // Apply gray scale for full depth range
        fragColor = vec4(vec3(depth), 1.0);
        
        // Add grid lines for depth value reference
        vec2 grid = fract(v_texCoord * 10.0);
        float line = 0.05;
        if (grid.x < line || grid.y < line) {
            // Add slight color to grid lines
            fragColor.rgb = mix(fragColor.rgb, vec3(0.5, 0.5, 1.0), 0.2);
        }
    }
}
`; 