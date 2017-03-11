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

#define PI 3.1415926563
#define TWO_PI 6.2831823

#define DOWN_SCALE 10.0

#define MAX_INT_DIGITS 4

#define CHAR_SIZE vec2(8, 12)
#define CHAR_SPACING vec2(8, 12)

#define STRWIDTH(c) (c * CHAR_SPACING.x)
#define STRHEIGHT(c) (c * CHAR_SPACING.y)

#define NORMAL 0
#define INVERT 1
#define UNDERLINE 2

int TEXT_MODE = NORMAL;

vec4 ch_F = vec4(0x00FE66,0x62647C,0x646060,0xF00000);
vec4 ch_I = vec4(0x007830,0x303030,0x303030,0x780000);
vec4 ch_N = vec4(0x00C6C6,0xE6F6FE,0xDECEC6,0xC60000);


vec2 res = vec2(0);
vec2 print_pos = vec2(0);

//Extracts bit b from the given number.
//Shifts bits right (num / 2^bit) then ANDs the result with 1 (mod(result,2.0)).
float extract_bit(float n, float b)
{
    b = clamp(b,-1.0,24.0);
    return floor(mod(floor(n / pow(2.0,floor(b))),2.0));   
}

//Returns the pixel at uv in the given bit-packed sprite.
float sprite(vec4 spr, vec2 size, vec2 uv)
{
    uv = floor(uv);
    
    //Calculate the bit to extract (x + y * width) (flipped on x-axis)
    float bit = (size.x-uv.x-1.0) + uv.y * size.x;
    
    //Clipping bound to remove garbage outside the sprite's boundaries.
    bool bounds = all(greaterThanEqual(uv,vec2(0))) && all(lessThan(uv,size));
    
    float pixels = 0.0;
    pixels += extract_bit(spr.x, bit - 72.0);
    pixels += extract_bit(spr.y, bit - 48.0);
    pixels += extract_bit(spr.z, bit - 24.0);
    pixels += extract_bit(spr.w, bit - 00.0);
    
    return bounds ? pixels : 0.0;
}

//Prints a character and moves the print position forward by 1 character width.
float char(vec4 ch, vec2 uv)
{
    if( TEXT_MODE == INVERT )
    {
      //Inverts all of the bits in the character.
      ch = pow(2.0,24.0)-1.0-ch;
    }
    if( TEXT_MODE == UNDERLINE )
    {
      //Makes the bottom 8 bits all 1.
      //Shifts the bottom chunk right 8 bits to drop the lowest 8 bits,
      //then shifts it left 8 bits and adds 255 (binary 11111111).
      ch.w = floor(ch.w/256.0)*256.0 + 255.0;  
    }

    float px = sprite(ch, CHAR_SIZE, uv - print_pos);
    print_pos.x += CHAR_SPACING.x;
    return px;
}

float text(vec2 uv)
{
    float col = 0.0;
    
    vec2 center = res/2.0;
    
    //Greeting Text
    
    print_pos = floor(center - vec2(STRWIDTH(2.0),STRHEIGHT(1.0))/2.0);
       
    col += char(ch_F,uv);
    col += char(ch_I,uv);
    col += char(ch_N,uv);
    
    return col;
}

void fin( out vec3 fragColor, in vec2 fragCoord )
{
    res = resolution.xy / DOWN_SCALE;
    vec2 uv = fragCoord.xy / DOWN_SCALE;
    vec2 duv = floor(fragCoord.xy / DOWN_SCALE);
    
    float pixel = text(duv);
    
    //Shading stuff
    vec3 col = vec3(1);
    col *= (1.-distance(mod(uv,vec2(1.0)),vec2(0.65)))*1.2;
    col *= mix(vec3(0.0),vec3(1,1,1),pixel);

    fragColor = vec3(col);
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float blob(vec2 uv, vec2 p, float r ){
    return min(.7,((1.*r-.05*2.)/(5.*length(uv-p))*.1));
}

float ring(vec2 uv, float r, float b){
    return 1.-smoothstep(r-(r*.01),r+(r*.01),dot(uv,uv)*4.)
    -(1.-smoothstep(r-b-(r*.01),r-b+(r*.01),dot(uv,uv)*4.));
}







































vec3 sp;
float t;
void main(){
    t = time;
    sp = spectrum;
    vec2 uv = -1.+2.*v_texcoord;
    vec2 st = gl_FragCoord.xy/resolution;
    vec3 col = vec3(0.);
    
    vec2 toCenter = vec2(0.5,0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0; 
    //col = hsb2rgb(vec3((angle/TWO_PI),radius,1.0));
    
    vec2 uv2 = uv;
    float i = 1.;
    
    float c = ring(uv2, mod(time*(sin(1.))*1.5, 8.*sin(1.)), sp.y*30.);
    //col *= vec3(c);
    uv.y = abs(uv.y);
    for(i=1.;i<3.;i++){
        uv.x += sin(uv.y*13.2+time*20.3+i*8.) * sp.x * 3.5;
        float l = abs(1./uv.x + i*.3) * sp.x * .13821;
        col += vec3(l,l*sp.x*10.,l*sp.y);
    }
    
    float b = step(.9,fract(uv2.x*10.));
    //b += step(.9,fract(uv2.y*10.));
    //col.z += b*abs(sin(time));
    
    uv2.y *= .7; 
    float o = blob(uv2, vec2(0.),  1.8);
    col += vec3(o*.9);

    
    //fin(col,gl_FragCoord.xy);
    gl_FragColor = vec4(col,1.0);
}
