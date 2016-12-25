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

#define PI 3.14159265359

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(void)
{
    vec2 uv = -1. + 2. * v_texcoord;
    float col = 0.;
    float speed = .25 * time;

    vec2 st = gl_FragCoord.xy/resolution.xy;
    // move space from the center to the vec2(0.0)
    st -= vec2(0.5);
    // rotate the space
    st = rotate2d( speed ) * st;
    // move it back to the original place
    st += vec2(0.5);
    vec4 img0 = texture2D(texture0, st ).rgba;

    gl_FragColor = vec4(img0);
}
