#version 300 es
layout(location = 0) in vec2 a_position;
layout(location = 1) in vec2 a_texcoord;

out vec2 v_texcoord;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    // gl_PointSize = 10.0;
    // gl_Position = vec4(a_position, 1.0);
    v_texcoord = a_texcoord;
}