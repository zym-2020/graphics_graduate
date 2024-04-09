#version 300 es
precision highp float;

uniform sampler2D symbolTexture;
in vec2 v_texcoord;

out vec4 outColor;

void main() {
    outColor = texture(symbolTexture, v_texcoord);
    // outColor = vec4(1.0, 0.0, 0.0, 1.0);
}