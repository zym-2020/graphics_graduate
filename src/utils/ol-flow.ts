import WebGLTileLayer from "ol/layer/WebGLTile.js";
import { FlowDescriptionType, FlowEnum } from "@/type";
import { rand, GlProgram } from "@/utils/common";
import axios from "axios";

export class CustomLayer extends WebGLTileLayer {
  private gl: WebGL2RenderingContext | null = null;
  private flowDescription: FlowDescriptionType | null = null;
  private shaderScriptMap = new Map();
  private imageMap = new Map();
  private textureMap = new Map();
  private samplerMap = new Map();

  private updateProgram: GlProgram | null = null;
  private trajectoryProgram: GlProgram | null = null;
  private pointProgram: GlProgram | null = null;
  private poolProgram: GlProgram | null = null;

  private simulationVAO: WebGLVertexArrayObject | null = null;
  private simulationVAO2: WebGLVertexArrayObject | null = null;
  private renderVAO: WebGLVertexArrayObject | null = null;
  private renderVAO2: WebGLVertexArrayObject | null = null;
  private XFBO: WebGLTransformFeedback | null = null;
  private XFBO2: WebGLTransformFeedback | null = null;
  private simulationBuffer: WebGLBuffer | null = null;
  private xfSimulationBuffer: WebGLBuffer | null = null;
  private UBO: WebGLBuffer | null = null;
  private sVAO: WebGLVertexArrayObject | null = null;
  private rVAO: WebGLVertexArrayObject | null = null;
  private xfBO: WebGLTransformFeedback | null = null;
  private unPackBuffer: WebGLBuffer | null = null;

  private uboMapBuffer: Float32Array = new Float32Array(12);

  private textureOffsetArray: { offsetX: number; offsetY: number }[] = [];

  private beginBlock = -1.0;

  private segmentPrepare: number = 0;
  constructor() {
    super({});
  }

  private async getFlowDescription(address: string) {
    await axios.get(address).then((res) => {
      const data = res.data;
      this.flowDescription = {
        seeding: data.area_masks,
        constraints: {
          maxDropRate: data.constraints.max_drop_rate,
          maxDropRateBump: data.constraints.max_drop_rate_bump,
          maxSegmentNum: data.constraints.max_segment_num,
          // maxTrajectoryNum: data.constraints.max_streamline_num,
          maxTrajectoryNum: 262144,
          maxTextureSize: data.constraints.max_texture_size,
        },
        extent: data.extent,
        flowBoundary: {
          uMax: data.flow_boundary.u_max,
          uMin: data.flow_boundary.u_min,
          vMax: data.flow_boundary.v_max,
          vMin: data.flow_boundary.v_min,
        },
        flowFields: data.flow_fields,
        projection: {
          projectionMapbox: data.projection["mapbox"],
          projectionCesium: data.projection["cesium"],
          projectionOl: data.projection["ol"]
        },
        textureSize: {
          seeding: data.texture_size.area_mask,
          flowField: data.texture_size.flow_field,
          projection: data.texture_size.projection,
        },
      };
      this.segmentPrepare = this.flowDescription.constraints.maxSegmentNum;
    });
  }

  private async getShaderScript(key: string, address: string) {
    await axios.get(address).then((res) => {
      this.shaderScriptMap.set(key, res.data);
    });
  }

  private async getImage(key: string, address: string, flip: ImageOrientation) {
    return new Promise((resolve, reject) => {
      axios.get(address, { responseType: "blob" }).then((res) => {
        createImageBitmap(res.data, { imageOrientation: flip, premultiplyAlpha: "none", colorSpaceConversion: "default" }).then((imageBitmap) => {
          this.imageMap.set(key, imageBitmap);
          resolve(null);
        });
      });
    });
  }

  async prepareAsyncData(descriptionAddress: string, shaderScriptAddressArr: { key: string; address: string }[]) {
    await this.getFlowDescription(descriptionAddress);
    const promiseArr = [];
    shaderScriptAddressArr.forEach((item) => {
      promiseArr.push(this.getShaderScript(item.key, item.address));
    });
    for (let i = 0; i < 3; i++) {
      promiseArr.push(this.getImage(FlowEnum.FLOW_FIELD_IMAGE + i, "/flow/texture/" + this.flowDescription!.flowFields[i], "flipY"));
      promiseArr.push(this.getImage(FlowEnum.SEEDING_IMAGE + i, "/flow/texture/" + this.flowDescription!.seeding[i], "flipY"));
    }
    promiseArr.push(this.getImage(FlowEnum.PROJECTION_OL_IMAGE, "/flow/texture/" + this.flowDescription!.projection.projectionOl, "flipY"));
    await Promise.all(promiseArr);
  }

  private prepareResource(gl: WebGL2RenderingContext) {
    if (this.simulationVAO && this.simulationVAO2 && this.renderVAO && this.renderVAO2) return;
    const available_extensions = gl.getSupportedExtensions()!;
    for (const extension of available_extensions) {
      gl.getExtension(extension);
    }
    // 绑定shader
    this.updateProgram = new GlProgram(gl);
    this.trajectoryProgram = new GlProgram(gl);
    this.pointProgram = new GlProgram(gl);
    this.poolProgram = new GlProgram(gl);
    this.updateProgram.setShader(gl, this.shaderScriptMap.get(FlowEnum.UPDATE_VERTEX), this.shaderScriptMap.get(FlowEnum.UPDATE_FRAGMENT), ["newInfo", "aliveTime"]);
    this.trajectoryProgram.setShader(gl, this.shaderScriptMap.get(FlowEnum.TRAJECTORY_VERTEX), this.shaderScriptMap.get(FlowEnum.TRAJECTORY_FRAGMENT));
    this.pointProgram.setShader(gl, this.shaderScriptMap.get(FlowEnum.POINT_VERTEX), this.shaderScriptMap.get(FlowEnum.POINT_FRAGMENT));
    this.poolProgram.setShader(gl, this.shaderScriptMap.get(FlowEnum.POOL_VERTEX), this.shaderScriptMap.get(FlowEnum.POOL_FRAGMENT));

    const maxBlockSize = Math.ceil(Math.sqrt(this.flowDescription!.constraints.maxTrajectoryNum)); //1024

    this.uboMapBuffer[8] = this.flowDescription!.flowBoundary.uMin;
    this.uboMapBuffer[9] = this.flowDescription!.flowBoundary.vMin;
    this.uboMapBuffer[10] = this.flowDescription!.flowBoundary.uMax;
    this.uboMapBuffer[11] = this.flowDescription!.flowBoundary.vMax;

    // 设置sampler
    this.samplerMap.set("lSampler", addSampler(gl, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE));
    this.samplerMap.set("nSampler", addSampler(gl, gl.NEAREST, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE));

    // 设置simulationVAO buffer
    this.simulationVAO = gl.createVertexArray();
    gl.bindVertexArray(this.simulationVAO);
    const particleMapBuffer = new Float32Array(maxBlockSize * maxBlockSize * 3).fill(0);
    for (let i = 0; i < maxBlockSize * maxBlockSize; i++) {
      particleMapBuffer[i * 3 + 0] = rand(0, 1.0);
      particleMapBuffer[i * 3 + 1] = rand(0, 1.0);
      particleMapBuffer[i * 3 + 2] = 0.0;
    }
    this.simulationBuffer = this.makeBufferBySource(gl, gl.ARRAY_BUFFER, particleMapBuffer, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.simulationBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
    gl.enableVertexAttribArray(0);
    const particleCountdownArray = new Float32Array(this.flowDescription!.constraints.maxTrajectoryNum).fill(this.flowDescription!.constraints.maxSegmentNum * 9.0);
    const lifeBuffer = this.makeBufferBySource(gl, gl.ARRAY_BUFFER, particleCountdownArray, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 1 * 4, 0);
    gl.enableVertexAttribArray(1);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    // 设置simulationVAO2 buffer
    this.simulationVAO2 = gl.createVertexArray();
    gl.bindVertexArray(this.simulationVAO2);
    this.xfSimulationBuffer = this.makeBufferBySource(gl, gl.ARRAY_BUFFER, particleMapBuffer, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.xfSimulationBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
    gl.enableVertexAttribArray(0);
    const xfLifeBuffer = this.makeBufferBySource(gl, gl.ARRAY_BUFFER, particleCountdownArray, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, xfLifeBuffer);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 1 * 4, 0);
    gl.enableVertexAttribArray(1);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    // 设置renderVAO buffer
    this.renderVAO = gl.createVertexArray();
    gl.bindVertexArray(this.renderVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 1 * 4, 0);
    gl.vertexAttribDivisor(0, 1);
    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    // 设置renderVA02 buffer
    this.renderVAO2 = gl.createVertexArray();
    gl.bindVertexArray(this.renderVAO2);
    gl.bindBuffer(gl.ARRAY_BUFFER, xfLifeBuffer);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 1 * 4, 0);
    gl.vertexAttribDivisor(0, 1);
    gl.enableVertexAttribArray(0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    // 设置XFBO buffer
    this.XFBO = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.XFBO);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.xfSimulationBuffer);
    gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.xfSimulationBuffer, 0, maxBlockSize * maxBlockSize * 12);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, xfLifeBuffer);
    gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, 1, xfLifeBuffer, 0, maxBlockSize * maxBlockSize * 4);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // 设置XFBO2 buffer
    this.XFBO2 = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.XFBO2);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, this.simulationBuffer);
    gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, 0, this.simulationBuffer, 0, maxBlockSize * maxBlockSize * 12);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, lifeBuffer);
    gl.bindBufferRange(gl.TRANSFORM_FEEDBACK_BUFFER, 1, lifeBuffer, 0, maxBlockSize * maxBlockSize * 4);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    this.UBO = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.UBO);
    gl.bufferData(gl.ARRAY_BUFFER, 48, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    // 设置纹理
    for (let i = 0; i < 3; i++) {
      const flowFieldTexture = this.createMyTexture(gl, 1, gl.TEXTURE_2D, WebGL2RenderingContext.RG32F, 0, 0);
      fillTexture(
        gl,
        this.imageMap.get(FlowEnum.FLOW_FIELD_IMAGE + i),
        "Float_Point",
        0,
        this.flowDescription!.textureSize.flowField[0],
        this.flowDescription!.textureSize.flowField[1],
        gl.TEXTURE_2D,
        flowFieldTexture!,
        WebGL2RenderingContext.RG32F,
        1,
        WebGL2RenderingContext.RG,
        WebGL2RenderingContext.FLOAT
      );
      this.textureMap.set(FlowEnum.FLOW_FIELD_TEXTURE + i, flowFieldTexture);

      const seedingTexture = this.createMyTexture(gl, 1, gl.TEXTURE_2D, WebGL2RenderingContext.RGBA8, 0, 0);
      fillTexture(
        gl,
        this.imageMap.get(FlowEnum.SEEDING_IMAGE + i),
        "Integer",
        0,
        this.flowDescription!.textureSize.seeding[0],
        this.flowDescription!.textureSize.seeding[1],
        gl.TEXTURE_2D,
        seedingTexture!,
        WebGL2RenderingContext.RGBA8,
        1,
        WebGL2RenderingContext.RGBA,
        WebGL2RenderingContext.UNSIGNED_BYTE
      );
      this.textureMap.set(FlowEnum.SEEDING_TEXTURE + i, seedingTexture);
    }
    const projectionTexture2D = this.createMyTexture(gl, 1, gl.TEXTURE_2D, WebGL2RenderingContext.RG32F, 0, 0);
    fillTexture(
      gl,
      this.imageMap.get(FlowEnum.PROJECTION_OL_IMAGE),
      "Float_Point",
      0,
      this.flowDescription!.textureSize.projection[0],
      this.flowDescription!.textureSize.projection[1],
      gl.TEXTURE_2D,
      projectionTexture2D!,
      WebGL2RenderingContext.RG32F,
      1,
      WebGL2RenderingContext.RG,
      WebGL2RenderingContext.FLOAT
    );
    this.textureMap.set(FlowEnum.PROJECTION_OL_TEXTURE, projectionTexture2D);

    const maxBlockColumn = Math.floor(this.flowDescription!.constraints.maxTextureSize / maxBlockSize);
    for (let i = 0; i < this.flowDescription!.constraints.maxSegmentNum; i++) {
      const offset = {
        offsetX: (i % maxBlockColumn) * maxBlockSize,
        offsetY: Math.floor(i / maxBlockColumn) * maxBlockSize,
      };
      this.textureOffsetArray.push(offset);
    }
    particleMapBuffer.fill(0);
    const poolTexture = this.createMyTexture(gl, 1, gl.TEXTURE_2D, WebGL2RenderingContext.RGB32F, this.flowDescription!.constraints.maxTextureSize, this.flowDescription!.constraints.maxTextureSize);
    this.textureMap.set(FlowEnum.POOL_TEXTURE, poolTexture);
  }

  createMyTexture(gl: WebGL2RenderingContext, mipLevels: number, target: number, internalFormat: number, width: number, height: number) {
    const texture = gl.createTexture();
    if (width !== 0 && height !== 0) {
      gl.bindTexture(target, texture);
      gl.texStorage2D(target, mipLevels, internalFormat, width, height);
      gl.bindTexture(target, null);
    }
    return texture;
  }

  makeBufferBySource(gl: WebGL2RenderingContext, target: number, source: ArrayBuffer | number, usage: number) {
    const VBO = gl.createBuffer();
    gl.bindBuffer(target, VBO);
    if (typeof source === "number") gl.bufferData(target, source, usage);
    else gl.bufferData(target, source, usage);
    return VBO;
  }

  tickLogicCount() {
    this.beginBlock = (this.beginBlock + 1) % 16;
    this.swap();

    this.uboMapBuffer[1] = this.flowDescription!.constraints.maxSegmentNum;
    this.uboMapBuffer[2] = this.flowDescription!.constraints.maxSegmentNum * 10;
    this.uboMapBuffer[3] = 0.003;
    this.uboMapBuffer[4] = 0.001;
    this.uboMapBuffer[5] = 2.0 * 0.01 * 100;
    this.uboMapBuffer[6] = 0;
  }

  swap() {
    if (this.beginBlock % 2 == 0) {
      this.sVAO = this.simulationVAO;
      this.rVAO = this.renderVAO;
      this.xfBO = this.XFBO;
      this.unPackBuffer = this.simulationBuffer;
    } else {
      this.sVAO = this.simulationVAO2;
      this.rVAO = this.renderVAO2;
      this.xfBO = this.XFBO2;
      this.unPackBuffer = this.xfSimulationBuffer;
    }
  }

  bindUBO(gl: WebGL2RenderingContext, bindingPointIndex: number) {
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.UBO);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.uboMapBuffer);
    gl.bindBufferRange(gl.UNIFORM_BUFFER, bindingPointIndex, this.UBO, 0, this.uboMapBuffer.length * 4.0);
  }

  tickRender(gl: WebGL2RenderingContext, frameState: any) {
    const maxBlockSize = Math.ceil(Math.sqrt(this.flowDescription!.constraints.maxTrajectoryNum));

    this.bindUBO(gl, 0);
    // Pass 1: Simulation
    gl.bindVertexArray(this.sVAO);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, this.xfBO);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textureMap.get(FlowEnum.FLOW_FIELD_TEXTURE + 0));
    gl.bindSampler(0, this.samplerMap.get("lSampler"));
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.textureMap.get(FlowEnum.FLOW_FIELD_TEXTURE + 1));
    gl.bindSampler(1, this.samplerMap.get("lSampler"));
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.textureMap.get(FlowEnum.SEEDING_TEXTURE + 0));
    gl.bindSampler(2, this.samplerMap.get("nSampler"));
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.textureMap.get(FlowEnum.SEEDING_TEXTURE + 1));
    gl.bindSampler(3, this.samplerMap.get("nSampler"));
    this.updateProgram?.useProgram(gl);
    this.updateProgram?.setVec1i(gl, "flowField", [0, 1]);
    this.updateProgram?.setVec1i(gl, "mask", [2, 3]);
    this.updateProgram?.setFloat(gl, "randomSeed", Math.random());
    this.updateProgram?.setUniformBlock(gl, "FlowFieldUniforms", 0);
    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    // gl.drawArrays(gl.POINTS, 0, this.flowDescription!.constraints.maxTrajectoryNum);
    gl.drawArrays(gl.POINTS, 0, 10000);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);
    gl.bindVertexArray(null);
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // Pass 2: Update particle pool

    gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, this.unPackBuffer);
    updateTextureByBuffer(
      gl,
      0,
      maxBlockSize,
      maxBlockSize,
      gl.TEXTURE_2D,
      this.textureMap.get(FlowEnum.POOL_TEXTURE),
      this.textureOffsetArray[this.beginBlock].offsetX,
      this.textureOffsetArray[this.beginBlock].offsetY,
      WebGL2RenderingContext.RGB,
      WebGL2RenderingContext.FLOAT
    );
    gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, null);
    if (this.segmentPrepare > 0) {
      this.segmentPrepare--;
      return;
    }
    // gl.finish();

    // Pass 3: Rendering by trajectorires or points
    gl.bindVertexArray(this.rVAO);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textureMap.get(FlowEnum.POOL_TEXTURE));
    gl.bindSampler(0, this.samplerMap.get("nSampler"));
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.textureMap.get(FlowEnum.PROJECTION_OL_TEXTURE));
    gl.bindSampler(1, this.samplerMap.get("lSampler"));
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendColor(0.0, 0.0, 0.0, 0.0);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.trajectoryProgram?.useProgram(gl);
    this.trajectoryProgram?.setInt(gl, "particlePool", 0);
    this.trajectoryProgram?.setInt(gl, "projectionTexture", 1);
    this.trajectoryProgram?.setInt(gl, "blockNum", this.flowDescription!.constraints.maxSegmentNum);
    this.trajectoryProgram?.setInt(gl, "beginBlock", this.beginBlock);
    this.trajectoryProgram?.setInt(gl, "blockSize", maxBlockSize);
    this.trajectoryProgram?.setFloat(gl, "currentSegmentNum", 8.0);
    this.trajectoryProgram?.setFloat(gl, "fillWidth", 1);
    this.trajectoryProgram?.setFloat(gl, "aaWidth", 2);
    this.trajectoryProgram?.setFloat2(gl, "viewport", gl.canvas.width, gl.canvas.height);
    this.trajectoryProgram?.setFloat3(gl, "transform_a", frameState.coordinateToPixelTransform[0], frameState.coordinateToPixelTransform[2], frameState.coordinateToPixelTransform[4]);
    this.trajectoryProgram?.setFloat3(gl, "transform_b", frameState.coordinateToPixelTransform[1], frameState.coordinateToPixelTransform[3], frameState.coordinateToPixelTransform[5]);
    this.trajectoryProgram?.setFloat2(gl, "pixel_size", frameState.size[0], frameState.size[1]);
    this.trajectoryProgram?.setUniformBlock(gl, "FlowFieldUniforms", 0);
    // gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, (8 - 1) * 2, this.flowDescription!.constraints.maxTrajectoryNum);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, (16 - 1) * 2, 10000);

    gl.disable(gl.BLEND);

    gl.bindVertexArray(null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  render(frameState: any, target: HTMLCanvasElement) {
    console.log(2)
    const canvas = this.renderSources(frameState, []);
    if (!this.gl) this.gl = target.getContext("webgl2");
    else {
      this.prepareResource(this.gl);
      this.tickLogicCount();
      this.tickRender(this.gl, frameState);
    }
    return canvas;
  }
}

const fillTexture = (
  gl: WebGL2RenderingContext,
  image: ImageBitmap,
  dataType: "Float_Point" | "Integer",
  level: number,
  width: number,
  height: number,
  target: number,
  texture: WebGLTexture,
  internalFormat: number,
  mipLevels: number,
  format: number,
  type: number
) => {
  gl.bindTexture(target, texture);
  gl.texStorage2D(target, mipLevels, internalFormat, width, height);
  gl.bindTexture(target, null);
  if (dataType === "Float_Point") {
    const pixelData = new Uint8Array(image.width * image.height * 4);
    const frameTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, frameTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    const FBO = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, FBO);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameTexture, 0);

    gl.readPixels(0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, pixelData);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.bindTexture(target, texture);
    gl.texSubImage2D(target, level, 0, 0, width, height, format, type, new Float32Array(pixelData.buffer));
    if (mipLevels > 1) {
      gl.generateMipmap(target);
    }
    gl.bindTexture(target, null);
  } else if (dataType === "Integer") {
    gl.bindTexture(target, texture);
    gl.texSubImage2D(target, level, 0, 0, width, height, format, type, image);
    if (mipLevels > 1) {
      gl.generateMipmap(target);
    }
    gl.bindTexture(target, null);
  }
};

const updateTexture = (
  gl: WebGL2RenderingContext,
  data: ArrayBufferView,
  level: number,
  width: number,
  height: number,
  target: number,
  texture: WebGLTexture,
  xoffset: number,
  yoffset: number,
  format: number,
  type: number
) => {
  gl.bindTexture(target, texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, data);
  gl.bindTexture(target, null);
};

const updateTextureByBuffer = (
  gl: WebGL2RenderingContext,
  level: number,
  width: number,
  height: number,
  target: number,
  texture: WebGLTexture,
  xoffset: number,
  yoffset: number,
  format: number,
  type: number
) => {
  gl.bindTexture(target, texture);
  gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, 0);
  gl.bindTexture(target, null);
};

const addSampler = (gl: WebGL2RenderingContext, magFilter: number, minFilter: number, addressModeU: number, addressModeV: number, addressModeW?: number) => {
  const sampler = gl.createSampler();
  gl.samplerParameteri(sampler!, gl.TEXTURE_MAG_FILTER, magFilter);
  gl.samplerParameteri(sampler!, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.samplerParameteri(sampler!, gl.TEXTURE_WRAP_S, addressModeU);
  gl.samplerParameteri(sampler!, gl.TEXTURE_WRAP_T, addressModeV);
  if (addressModeW) {
    gl.samplerParameteri(sampler!, gl.TEXTURE_WRAP_R, addressModeW);
  }
  return sampler;
};
