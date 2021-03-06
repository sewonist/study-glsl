const float PI = 3.1415926535;
const float flipTime  = 2.;

float circEdge  =  20.0 / iResolution.x;
vec2 tileDims = vec2(3.0,3.0); //number of rows ,columns

float random (vec2 st) { 
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

float randomRange (in vec2 seed, in float min, in float max) {
        return min + random(seed) * (max - min);
}

vec2 rotate2D(vec2 position, float theta)
{
    mat2 m = mat2( cos(theta), -sin(theta), sin(theta), cos(theta) );
    return m * position;
}

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

//returns 1 for inside circ, 0 for outside
float circle(in vec2 _st, in vec2 pos, in float _radius){
    vec2 dist = _st - pos;    
    return 1. - smoothstep(_radius-(_radius*circEdge),
                         _radius+(_radius*circEdge),
                         dot(dist,dist)*4.0);
}

vec3 gilmoreCol(float x){    
    //offset hue to put red in middle
    float hue = fract((1.0 - x) - 0.45);    
    //saturation is higher for warmer colors
    float sat = 0.3 + sin(x*PI)*0.5;    
    //brightness higher in middle
    float bri = (smoothstep(0.,0.6, x) - smoothstep(0.6,1.0,x))*.6 + 0.3;  
    return vec3(hue, sat,bri);    
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
     //0-1 on both axes
    vec2 uv = fragCoord.xy / iResolution.xy;
    
    //square aspect ratio, centered
    vec2 uvs = vec2( fragCoord.xy - 0.5*iResolution.xy ) / min(iResolution.x,iResolution.y);
    
    //switch tileDims every 2 seconds
    float rndTime = randomRange(vec2(floor(iGlobalTime/flipTime), 79834.345),2.,5.);
    //number of rows ,columns
    tileDims = vec2(floor(rndTime),floor(rndTime));
    
    //rotate
    uvs = rotate2D(uvs,cos(iGlobalTime/10.));
    
    //warp
    //uvs.x = uvs.x + sin(uvs.x*4.+iGlobalTime*6.)*0.005;
    
    //zoomer
    //uvs *= (cos(iGlobalTime/2.) *0.2 + 1.);
    
    //slide columns down separately
    //tile H coord 
    float colId = floor(uvs.x * tileDims.x);   
    //rand per column
    float rndColumn = random(vec2(colId, 687.890));
    uvs.y += iGlobalTime * (rndColumn ) /30.;
    
    //bounce
    //uvs.y += cos(iGlobalTime*PI * rndColumn)/10.;
    
    //rnd per tile   
    float rnd = random(floor(uvs.xy * tileDims) +  floor(iGlobalTime/flipTime));
    
    //mostly green w/ some reds
    vec3 tileHSV;
    if(rnd < 0.9){        
       tileHSV = gilmoreCol(rnd/2.6);       
    }else{
        tileHSV = gilmoreCol(rnd - 0.4);      
    }
             
    //get random int 0 - 3 per tile
    float tileRnd = random(floor(uvs.xy * tileDims ) * 88.89 );
    tileRnd = floor(tileRnd * 4.);
    
    //st is 0-1 coords within tile 
    vec2 st = fract(uvs * tileDims);
    
    //flip tiles
    if (tileRnd == 1.) {
        st.y = 1.0 - st.y;    
    }else if (tileRnd == 2.) {
       st.x = 1.0 - st.x;       
    } else if (tileRnd == 3.) {        
        st.x = 1.0 - st.x;    
        st.y = 1.0 - st.y;    
    }
    
    vec2 texure_uv = st;
    texure_uv.x *= 1.5 -  sin(iGlobalTime*5.) / 2.;

    float detail = texture2D(iChannel1, texure_uv).z;
    tileHSV.z *= detail;
    
    fragColor = vec4(hsv2rgb(tileHSV),1.0);
    
}
