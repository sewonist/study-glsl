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
    float i = 1.;
    for(i=1.;i<=8.;i++){
        uv.x += sin(uv.y * 10. + i * 10. + time * 2.) * spectrum.x * 50.;
        col += abs(.1 / uv.x ) * i * spectrum.y * .3;
    }
    gl_FragColor = vec4(col, col, col, 1.0);
}
