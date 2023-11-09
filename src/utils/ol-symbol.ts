import WebGLTileLayer from "ol/layer/WebGLTile.js";
import axios from "axios";
import { encodeFloatToDouble } from "@/utils/common";
import { mat4 } from "gl-matrix";

export class CustomLayer extends WebGLTileLayer {
  vertexAddress: string;
  fragmentAddress: string;
  symbolImageAddress: string;
  paletteImageAddress: string;
  descriptionAddress: string;
  poistionAddress: string;

  vertexScript: string | null = null;
  fragmentScript: string | null = null;
  symbolImage: HTMLImageElement | null = null;
  paletteImage: HTMLImageElement | null = null;
  vertexArray: number[] = [];
  instanceNum: number = 0;

  gl: WebGL2RenderingContext | null = null;
  program: WebGLProgram | null = null;
  renderVAO: WebGLVertexArrayObject | null = null;
  symbolTexture: WebGLTexture | null = null;
  paletteTexture: WebGLTexture | null = null;
  constructor(vertexAddress: string, fragmentAddress: string, symbolImageAddress: string, paletteImageAddress: string, descriptionAddress: string, poistionAddress: string) {
    super({});
    this.vertexAddress = vertexAddress;
    this.fragmentAddress = fragmentAddress;
    this.symbolImageAddress = symbolImageAddress;
    this.paletteImageAddress = paletteImageAddress;
    this.descriptionAddress = descriptionAddress;
    this.poistionAddress = poistionAddress;
  }
  async prepareData(type: string, number: number) {
    const vertexScriptPromise: Promise<string> = axios.get(this.vertexAddress).then((res) => res.data);
    const fragmentScriptPromise: Promise<string> = axios.get(this.fragmentAddress).then((res) => res.data);
    const symbolImagePromise: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
      const symbolImage = new Image();
      symbolImage.src = this.symbolImageAddress;
      symbolImage.onload = () => {
        resolve(symbolImage);
      };
    });
    const paletteImagePromise: Promise<HTMLImageElement> = new Promise((resolve, reject) => {
      const paletteImage = new Image();
      paletteImage.src = this.paletteImageAddress;
      paletteImage.onload = () => {
        resolve(paletteImage);
      };
    });
    const descriptionPromise = axios.get(this.descriptionAddress).then((res) => res.data);
    const positionPromise = axios.get(this.poistionAddress).then((res) => res.data);

    return Promise.all([vertexScriptPromise, fragmentScriptPromise, symbolImagePromise, paletteImagePromise, descriptionPromise, positionPromise]).then((res) => {
      this.vertexScript = res[0];
      this.fragmentScript = res[1];
      this.symbolImage = res[2];
      this.paletteImage = res[3];
      const sampleArray: number[] = [];
      const position: number[] = [];

      const rotationArray: number[] = [];
      const arr = (res[4] as any).markers.description;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === type) {
          const instanceNum = Math.ceil(arr[i].length / number);
          for (let j = 0; j < (res[5] as any).features.length; j++) {
            const item = (res[5] as any).features[j];
            // const coord = fromLonLat([item.geometry.coordinates[0], item.geometry.coordinates[1]], "EPSG:3857");
            // const coord = Cesium.Cartesian3.fromDegrees(item.geometry.coordinates[0], item.geometry.coordinates[1]);
            const positionX = encodeFloatToDouble(item.geometry.coordinates[0]);
            const positionY = encodeFloatToDouble(item.geometry.coordinates[1]);
            for (let k = 0; k < instanceNum; k++) {
              sampleArray.push(arr[i].base, arr[i].length, k, arr[i].ID);
              position.push(positionX[0], positionY[0], positionX[1], positionY[1]);
              rotationArray.push(0);
            }
          }
        }
      }
      this.instanceNum = rotationArray.length;
      this.vertexArray = [...sampleArray, ...position, ...rotationArray];

    });
  }

  prepareRenderResource(gl: WebGL2RenderingContext) {
    if (this.renderVAO === null) {
      const vShader = gl.createShader(gl.VERTEX_SHADER)!;
      const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
      gl.shaderSource(vShader, this.vertexScript!);
      gl.shaderSource(fShader, this.fragmentScript!);
      gl.compileShader(vShader);
      gl.compileShader(fShader);

      this.program = gl.createProgram()!;
      gl.attachShader(this.program, vShader);
      gl.attachShader(this.program, fShader);
      gl.linkProgram(this.program);

      this.renderVAO = gl.createVertexArray();
      gl.bindVertexArray(this.renderVAO);
      const VBO = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 4 * 4, 0);
      gl.vertexAttribDivisor(0, 1);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 4 * 4, this.instanceNum * 4 * 4);
      gl.vertexAttribDivisor(1, 1);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 4 * 1, this.instanceNum * 8 * 4);
      gl.vertexAttribDivisor(2, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindVertexArray(null);

      if (this.symbolImage && this.paletteImage) {
        this.symbolTexture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_2D, this.symbolTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.symbolImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        this.paletteTexture = gl.createTexture();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.bindTexture(gl.TEXTURE_2D, this.paletteTexture);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.paletteImage);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      }
    }
  }
  render(frameState: any, target: HTMLCanvasElement) {
    const canvas = this.renderSources(frameState, []);
    if (!this.gl) this.gl = target.getContext("webgl2");
    if (this.gl) {
      this.prepareRenderResource(this.gl);

      this.gl.useProgram(this.program);
      const modelMatrix = mat4.create();
      mat4.identity(modelMatrix);
      mat4.scale(modelMatrix, modelMatrix, [25 * window.devicePixelRatio, 25 * window.devicePixelRatio, 1.0]);
      const symbolMatrixLoc = this.gl.getUniformLocation(this.program!, "u_symbolMatrix");
      this.gl.uniformMatrix4fv(symbolMatrixLoc, false, modelMatrix);
      const bufferSizeLoc = this.gl.getUniformLocation(this.program!, "u_bufferSize");
      this.gl.uniform2f(bufferSizeLoc, this.gl.canvas.width, this.gl.canvas.height);

      const positionX = encodeFloatToDouble(118.81259);
      const positionY = encodeFloatToDouble(32.048116);

      const centerHighLoc = this.gl.getUniformLocation(this.program!, "u_mercatorCenterHigh");
      this.gl.uniform2f(centerHighLoc, positionX[0], positionY[0]);
      const centerLowLoc = this.gl.getUniformLocation(this.program!, "u_mercatorCenterLow");
      this.gl.uniform2f(centerLowLoc, positionX[1], positionY[1]);
      const pixel_size = this.gl.getUniformLocation(this.program!, "pixel_size");
      this.gl.uniform2f(pixel_size, frameState.size[0], frameState.size[1]);
      const transform_a = this.gl.getUniformLocation(this.program!, "transform_a");
      this.gl.uniform3f(transform_a, frameState.coordinateToPixelTransform[0], frameState.coordinateToPixelTransform[2], frameState.coordinateToPixelTransform[4]);
      const transform_b = this.gl.getUniformLocation(this.program!, "transform_b");
      this.gl.uniform3f(transform_b, frameState.coordinateToPixelTransform[1], frameState.coordinateToPixelTransform[3], frameState.coordinateToPixelTransform[5]);

      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.symbolTexture);
      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.paletteTexture);
      const symbolTextureLoc = this.gl.getUniformLocation(this.program!, "symbolTexture");
      const paletteTextureLoc = this.gl.getUniformLocation(this.program!, "paletteTexture");
      this.gl.uniform1i(symbolTextureLoc, 0);
      this.gl.uniform1i(paletteTextureLoc, 1);
      this.gl.bindVertexArray(this.renderVAO);

      this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 64, this.instanceNum);
      // this.gl.drawArrays(this.gl.POINTS, 0, 6);

      this.gl.bindVertexArray(null);
      this.gl.bindTexture(this.gl.TEXTURE_2D, null);
      this.gl.useProgram(null);
    }

    return canvas;
  }
}
