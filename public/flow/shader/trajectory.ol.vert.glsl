#version 300 es
precision highp float;

layout (location = 0) in float isAlive;

layout (std140) uniform FlowFieldUniforms
{
    float progress;
    float segmentNum;
    float fullLife;
    float dropRate;
    float dropRateBump;
    float speedFactor;
    float colorScheme;
    vec4 flowBoundary;
};

uniform sampler2D particlePool;
uniform sampler2D projectionTexture;
uniform int blockNum;
uniform int beginBlock;
uniform int blockSize;
uniform float fillWidth;
uniform float aaWidth;
uniform vec2 viewport;

uniform vec2 pixel_size;
uniform vec3 transform_a;
uniform vec3 transform_b;

out struct Stream_line_setting 
{
    float edgeParam;
    float alphaDegree;
    float velocity; // a percentage
    float isDiscarded;
} sls;


vec4 ReCoordinate(vec2 pos) {

    vec2 geoPos;
    geoPos = texture(projectionTexture, pos).rg;
    float geoPositionX = transform_a.x * geoPos.x + transform_a.y * geoPos.y + transform_a.z;
    float geoPositionY = transform_b.x * geoPos.x + transform_b.y * geoPos.y + transform_b.z;
    vec4 res=vec4(geoPositionX / pixel_size.x * 2.0 - 1.0, 1.0 - geoPositionY / pixel_size.y * 2.0,  0.,1.);
    return res;
}

ivec2 get_uv(int vertexIndex)
{
    // calculate the blockIndex of the current vertx
    int blockIndex = (beginBlock - vertexIndex + blockNum) % blockNum;

    // calculate original uv of the block
    int textureWidth = textureSize(particlePool, 0).x;
    int columnNum = textureWidth / blockSize;
    ivec2 blockUV = ivec2(blockIndex % columnNum, blockIndex / columnNum) * blockSize;

    // calculate uv of the current vertex
    ivec2 vertexUV = blockUV + ivec2(gl_InstanceID % blockSize, gl_InstanceID / blockSize);

    return vertexUV;
}

vec4 transfer_to_clip_space(vec2 pos)
{
    return ReCoordinate(pos);
}

vec4 get_clip_position(ivec2 uv)
{
    return transfer_to_clip_space(texelFetch(particlePool, uv, 0).rg);
}

vec2 get_vector(vec2 beginVertex, vec2 endVertex)
{
    return normalize(endVertex - beginVertex);
}

void main()
{
    // get screen positions from particle pool
    float parity = float(gl_VertexID % 2);
    int currentVertex = gl_VertexID / 2;
    int nextVertex = currentVertex + 1;
    ivec2 c_uv = get_uv(currentVertex);
    ivec2 n_uv = get_uv(nextVertex);
    vec4 cv_pos_CS = get_clip_position(c_uv);
    vec4 nv_pos_CS = get_clip_position(n_uv);
    vec2 cv_pos_SS = cv_pos_CS.xy / cv_pos_CS.w;
    vec2 nv_pos_SS = nv_pos_CS.xy / nv_pos_CS.w;

    // calculate the screen offset
    float speedRate = texelFetch(particlePool, c_uv, 0).b;
    float lineWidth = (fillWidth + aaWidth * 2.0);// * mix(2.0, 1.0, clamp(pow(speedRate * 10.0, 3.0), 0.0, 1.0));
    vec2 cn_vector = get_vector(cv_pos_SS, nv_pos_SS);
    float screenOffset = lineWidth / 2.0;

    // translate current vertex position
    vec3 view = vec3(0.0, 0.0, 1.0);
    vec2 v_offset = normalize(cross(view, vec3(cn_vector, 0.0))).xy * mix(1.0, -1.0, parity);  //等价于以下
    // vec2 v_offset = normalize(vec2(-cn_vector.y, cn_vector.x)).xy * mix(1.0, -1.0, parity);
    
    vec2 vertexPos_SS = cv_pos_SS + v_offset * screenOffset / viewport;

    //////////////
    // calculate vertex position in screen coordinates
    vec2 vertexPos_CS = vertexPos_SS * cv_pos_CS.w;
    gl_Position = vec4(vertexPos_CS, 0.0, cv_pos_CS.w);

    // prepare for anti-aliasing
    sls.edgeParam = 2.0 * parity - 1.0;

    float segmentRate = float(currentVertex) / segmentNum;
    sls.alphaDegree = 1.0 - segmentRate;

    sls.velocity = speedRate;
    sls.isDiscarded = isAlive;
}