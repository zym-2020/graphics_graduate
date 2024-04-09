layout(location = 1) in vec4 sampleInfo;
layout(location = 2) in vec3 geoPosition_height;
layout(location = 3) in vec3 geoPosition_low;
layout(location = 4) in float rotation;

uniform sampler2D symbolTexture;
uniform sampler2D paletteTexture;

uniform mat4 u_symbolMatrix;
uniform vec2 u_bufferSize;

uniform vec3 u_cartesianCenterHigh;
uniform vec3 u_cartesianCenterLow;

out vec4 v_color;

vec3 translateRelativeToEye(vec3 high, vec3 low)
{
    vec3 highDiff = high - u_cartesianCenterHigh;
    vec3 lowDiff = low - u_cartesianCenterLow;

    return highDiff + lowDiff;
}

mat4 matRotZ(float rad){
    return transpose(mat4(
        vec4(cos(rad),-sin(rad),0,0),
        vec4(sin(rad),cos(rad),0,0),
        vec4(0,0,1,0),
        vec4(0,0,0,1)
    ));
}

void main() {
    float symbolTextureWidth=float(textureSize(symbolTexture,0).x);
    float offset=sampleInfo.x+sampleInfo.z*62.;
    float index=clamp(offset+float(gl_VertexID),0.,sampleInfo.x+sampleInfo.y-1.);
    
    
    int u=int(mod(index,symbolTextureWidth));
    int v=int(floor(index/symbolTextureWidth));
    
    
    vec4 posColor=texelFetch(symbolTexture,ivec2(u,v),0);
    // vec4 posColor=texture(symbolTexture, vec2(float(u)/symbolTextureWidth, float(v)/symbolTextureWidth));

    
    int intR=int(posColor.r*255.);
    int intG=int(posColor.g*255.);
    float fractX=float(intR&252)/255.;
    float fractY=float(intG&252)/255.;
    
    float intX=posColor.b*255.;
    float intY=posColor.a*255.;
    
    float x=((fractX+intX)/255.);
    float y=((fractY+intY)/255.);

    
    
    vec4 symbolOffset_ss=matRotZ(rotation)*u_symbolMatrix*vec4(x,-y,0.,1.);

    vec4 geoPos_cs = czm_viewProjection * vec4(geoPosition_height, 1.0);
    // vec4 geoPos_cs = u_matrix * vec4(translateRelativeToEye(geoPosition_height.xyz, geoPosition_low.xyz), 1.0);
    gl_Position=vec4(geoPos_cs.xy+symbolOffset_ss.xy*geoPos_cs.w/u_bufferSize,geoPos_cs.zw);
    // gl_Position=vec4(x, -y, 0.0, 1.0);
    

    // gl_Position = vec4(x,-y,0.,1.0);
    // gl_Position = geoPos_cs;
    gl_PointSize=10.;

    
    
    int colorIndex=((intR&3)<<2)+(intG&3);

    v_color=vec4(texelFetch(paletteTexture,ivec2(colorIndex,int(sampleInfo.w)),0).rgb, 1.0);
    // v_color=vec4(texelFetch(paletteTexture,ivec2(0, 4),0).rgb, 1.0);
    // v_color=vec4(texelFetch(paletteTexture,ivec2(0, ),0).rgb, 1.0);
    // v_color=vec4(sampleInfo.x / 914.0, sampleInfo.y / 618.0, sampleInfo.z / 10.0, sampleInfo.z);
    // v_color = posColor;
    // color=vec4(symbolTextureWidth / 2.0,0.,0.,1.);
}

