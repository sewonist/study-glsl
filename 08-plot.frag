#version 150

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 spectrum;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;

in VertexData
{
    vec4 v_position;
    vec3 v_normal;
    vec2 v_texcoord;
} inData;

out vec4 fragColor;

float plot(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) - 
          smoothstep( pct, pct+0.02, st.y);
}

void main(void)
{
    vec2 uv = gl_FragCoord.xy/resolution;
    float y = uv.x;

    vec3 color = vec3(y);
    
    // Plot a line
    float pct = plot(uv,y);
    color = (1.0-pct)*color+pct*vec3(0.0,1.0,0.0);
    
    fragColor = vec4(color,1.0);

}
