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

const float PI = 3.1415926535897932384626433832795;
#define TWO_PI 6.28318530718

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}

void flower(in vec2 coord, out vec4 color){
float del_theta = 2.;
float amplitude = 30.;
float k = 8.;
float theta = clamp(del_theta, 0., 2.*PI);
float x = amplitude*cos(k*theta)*cos(theta);
float y = amplitude*cos(k*theta)*sin(theta);
//x = plot(coord, x);

color.x = y;
color.y = y;
color.z = y;
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float blob(vec2 uv, vec2 p){
    return min(.7,((1.-.05*2.)/(3.*length(uv-p))*.1));
}

float ring(vec2 uv, float r, float b){
    return 1.-smoothstep(r-(r*.01),r+(r*.01),dot(uv,uv)*4.)
    -(1.-smoothstep(r-b-(r*.01),r-b+(r*.01),dot(uv,uv)*4.));
}

void main(){
    vec2 uv = -1.+2.*v_texcoord;
    vec2 st = gl_FragCoord.xy/resolution;
    vec3 color = vec3(0.);
    
    vec2 toCenter = vec2(0.5,0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0; 
    //color = hsb2rgb(vec3((angle/TWO_PI),radius,1.0));
    
    vec2 uv2 = uv;
    float i = 1.;
    //uv.x += sin(time*2.+uv.y*8.)*spectrum.x*100.;
    for(i=1.;i<2.;i++){
        float c = ring(uv, mod(time*(sin(i))*1.5, 8.*sin(i)), .1*spectrum.y*100.);
        color += vec3(c);

        float l = abs(1./uv.x) * spectrum.x * 10.;
        //color += vec3(l);
    }
    
    float b = step(.9,fract(uv2.x*10.));
    b += step(.9,fract(uv2.y*10.));
//color.z += b*abs(sin(time));

    gl_FragColor = vec4(color,1.0);
}


