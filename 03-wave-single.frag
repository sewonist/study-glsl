#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 spectrum;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;

varying vec3 v_normal;
varying vec2 v_texcoord;

void main(void)
{
    vec2 uv = -1. + 2. * v_texcoord;
    float col = 0.;
    uv.x += sin(uv.y * 10.) * spectrum.x * 80.;
    col += abs(.1 / uv.x ) * spectrum.y * 12.;
    gl_FragColor = vec4(col, col, col, 1.0);
}
